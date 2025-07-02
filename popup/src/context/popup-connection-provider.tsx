import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SKIP_POSTME_HANDSHAKE } from "@/config";
import { useOnrampFlow, useSetOnrampTarget } from "@/state/hooks";
import type {
  InitiateOnrampFlowPayload,
  PopupActionMethods,
  SdkListenerMethods,
} from "@pingpay/onramp-sdk";
import { ChildHandshake, type Connection, WindowMessenger } from "post-me";

type PopupConnection = Connection<PopupActionMethods, SdkListenerMethods>;
type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface PopupConnectionContextType {
  connection: PopupConnection | null;
  openerOrigin: string | null;
  status: ConnectionStatus;
  call: <TMethod extends keyof SdkListenerMethods>(
    method: TMethod,
    ...args: Parameters<SdkListenerMethods[TMethod]>
  ) => Promise<ReturnType<SdkListenerMethods[TMethod]> | undefined>;
}

const PopupConnectionContext = createContext<PopupConnectionContextType>({
  connection: null,
  openerOrigin: null,
  status: "idle",
  call: async () => {
    console.warn("PopupConnectionContext: `call` invoked before connection");
    return Promise.resolve(undefined);
  },
});

export const usePopupConnection = () => {
  return use(PopupConnectionContext);
};

const getOpenerOrigin = () => {
  try {
    let origin = sessionStorage.getItem("ping_sdk_opener_origin");
    if (origin) return origin;

    const queryParams = new URLSearchParams(window.location.search);
    origin = queryParams.get("ping_sdk_opener_origin");
    if (origin) {
      sessionStorage.setItem("ping_sdk_opener_origin", origin);
      return origin;
    }
  } catch (e) {
    console.warn("Popup: Failed to access sessionStorage for opener origin", e);
  }
  return null;
};

export const PopupConnectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const connectionRef = useRef<PopupConnection | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const { setFlowError } = useOnrampFlow();
  const setOnrampTarget = useSetOnrampTarget();
  const navigate = useNavigate();

  const call = useCallback(
    async <TMethod extends keyof SdkListenerMethods>(
      method: TMethod,
      ...args: Parameters<SdkListenerMethods[TMethod]>
    ): Promise<ReturnType<SdkListenerMethods[TMethod]> | undefined> => {
      if (!connectionRef.current) {
        console.warn(
          `[PopupConnectionProvider] Attempted to call ${method} before connection was established.`,
        );
        return undefined;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/return-await
        return (await connectionRef.current
          .remoteHandle()
          .call(method, ...args)) as ReturnType<SdkListenerMethods[TMethod]>;
      } catch (e) {
        console.error(`[PopupConnectionProvider] Error calling ${method}:`, e);
        throw e;
      }
    },
    [],
  );

  const establishConnection = useCallback(async () => {
    setStatus("connecting");

    if (SKIP_POSTME_HANDSHAKE) {
      console.warn(
        "[PopupConnectionProvider] Skipping post-me handshake due to VITE_SKIP_POSTME_HANDSHAKE flag.",
      );
      const mockConnection = {
        remoteHandle: () => ({
          call: (methodName: string, params?: unknown) => {
            console.log(
              `[MockConnection] Called ${methodName} with params:`,
              params,
            );
            return Promise.resolve({});
          },
        }),
        close: () => {
          console.log("[MockConnection] close() called");
        },
        localHandle: () => ({}),
        closed: false,
        connected: true,
      } as unknown as PopupConnection;
      connectionRef.current = mockConnection;
      setStatus("connected");
      return;
    }

    const opener = window.opener as WindowProxy & { location: Location };
    const openerOrigin = getOpenerOrigin();
    let sdkOrigin: string;

    if (process.env.NODE_ENV === "development") {
      try {
        sdkOrigin =
          opener.location.origin && opener.location.origin !== "null"
            ? new URL(opener.location.href).origin
            : "*";
      } catch (e) {
        console.warn("Error determining opener's origin", e);
        sdkOrigin = "*";
      }
    } else {
      if (!openerOrigin) {
        console.error(
          "Popup (Prod): CRITICAL - 'ping_sdk_opener_origin' is missing.",
        );
        setFlowError(
          "Configuration error: SDK identification parameter missing.",
        );
        setStatus("error");
        return;
      }
      sdkOrigin = openerOrigin;
    }

    if (sdkOrigin === "*" && process.env.NODE_ENV === "production") {
      console.error(
        "Popup (Prod): CRITICAL - sdkOrigin resolved to '*'. Aborting.",
      );
      setFlowError(
        "Security misconfiguration: Wildcard origin detected in production.",
      );
      setStatus("error");
      return;
    }

    const popupActionMethods: PopupActionMethods = {
      initiateOnrampInPopup: async (payload: InitiateOnrampFlowPayload) => {
        console.log(
          "[Popup] Received initiateOnrampInPopup from SDK:",
          payload,
        );
        setOnrampTarget(payload.target);
        void navigate({ to: "/onramp/connect-wallet" });
        await call("reportFlowStarted", payload);
      },
    };

    const messenger = new WindowMessenger({
      localWindow: window,
      remoteWindow: opener,
      remoteOrigin: sdkOrigin,
    });

    try {
      const conn = await ChildHandshake(messenger, popupActionMethods);
      console.log("Popup: post-me ChildHandshake successful.");
      connectionRef.current = conn;
      setStatus("connected");
      await call("reportPopupReady");
    } catch (e) {
      console.error("Popup: post-me ChildHandshake failed.", e);
      const errorMsg = `Connection to SDK failed: ${
        e instanceof Error ? e.message : String(e)
      }`;
      setFlowError(errorMsg);
      setStatus("error");
    }
  }, [setFlowError, navigate, setOnrampTarget, call]);

  useEffect(() => {
    void establishConnection();

    const handleBeforeUnload = () => {
      if (connectionRef.current) {
        console.log("Popup: Window is closing, reporting to SDK");
        call("reportPopupClosedByUser").catch((e: unknown) => {
          console.warn(
            "Popup: Failed to emit reportPopupClosedByUser on unload",
            e,
          );
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      connectionRef.current?.close();
    };
  }, [establishConnection, call]);

  const contextValue = useMemo(
    () => ({
      connection: connectionRef.current,
      openerOrigin: getOpenerOrigin(),
      status,
      call,
    }),
    [status, call],
  );

  return (
    <PopupConnectionContext value={contextValue}>
      {children}
    </PopupConnectionContext>
  );
};
