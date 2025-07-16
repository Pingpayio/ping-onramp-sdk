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

import { getConnection } from "@/lib/popup-connection";
import type {
  PopupActionMethods,
  SdkListenerMethods,
} from "@pingpay/onramp-sdk";
import type { Connection } from "post-me";

type PopupConnection = Connection<PopupActionMethods, SdkListenerMethods>;
type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface PopupConnectionContextType {
  connection: PopupConnection | null;
  status: ConnectionStatus;
  call: <TMethod extends keyof SdkListenerMethods>(
    method: TMethod,
    ...args: Parameters<SdkListenerMethods[TMethod]>
  ) => Promise<ReturnType<SdkListenerMethods[TMethod]> | undefined>;
}

const PopupConnectionContext = createContext<PopupConnectionContextType>({
  connection: null,
  status: "idle",
  call: async () => {
    console.warn("PopupConnectionContext: `call` invoked before connection");
    return Promise.resolve(undefined);
  },
});

export const usePopupConnection = () => {
  return use(PopupConnectionContext);
};

export const PopupConnectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const connectionRef = useRef<PopupConnection | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const call = useCallback(
    async <TMethod extends keyof SdkListenerMethods>(
      method: TMethod,
      ...args: Parameters<SdkListenerMethods[TMethod]>
    ): Promise<ReturnType<SdkListenerMethods[TMethod]> | undefined> => {
      const conn = connectionRef.current;
      if (!conn) {
        console.warn(
          `[PopupConnectionProvider] Attempted to call ${method} before connection was established.`,
        );
        return undefined;
      }
      try {
        return (await conn
          .remoteHandle()
          .call(method, ...args)) as ReturnType<SdkListenerMethods[TMethod]>;
      } catch (e) {
        console.error(`[PopupConnectionProvider] Error calling ${method}:`, e);
        throw e;
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;
    setStatus("connecting");

    getConnection()
      .then((conn) => {
        if (isMounted) {
          connectionRef.current = conn;
          setStatus("connected");
        }
      })
      .catch((e) => {
        console.error("Failed to establish connection:", e);
        if (isMounted) {
          setStatus("error");
        }
      });

    const handleBeforeUnload = () => {
      if (connectionRef.current) {
        console.log("Popup: Window is closing, reporting to SDK");
        void call("reportPopupClosedByUser").catch((e: unknown) => {
          console.warn(
            "Popup: Failed to emit reportPopupClosedByUser on unload",
            e,
          );
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      connectionRef.current?.close();
    };
  }, [call]);

  const contextValue = useMemo(
    () => ({
      connection: connectionRef.current,
      status,
      call,
    }),
    [status, call],
  );

  return (
    <PopupConnectionContext.Provider value={contextValue}>
      {children}
    </PopupConnectionContext.Provider>
  );
};
