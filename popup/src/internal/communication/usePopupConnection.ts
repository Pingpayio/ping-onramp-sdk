import { atom, useAtom, useAtomValue } from "jotai";
import { useNavigate } from "@tanstack/react-router";
// @ts-expect-error post-me typings are weird
import { ChildHandshake, Connection, WindowMessenger } from "post-me";
import { useEffect } from "react";
import type {
  InitiateOnrampFlowPayload,
  PopupActionMethods,
  SdkListenerMethods,
} from "../../../../src/internal/communication/post-me-types";
import { useOnrampFlow, useSetOnrampTarget } from "../../state/hooks";

const SKIP_POPUP = import.meta.env.VITE_SKIP_POSTME_HANDSHAKE === "true" ||
  (window as any).VITE_SKIP_POSTME_HANDSHAKE === true;

const popupConnectionAtomInternal = atom<Connection<
  PopupActionMethods,
  SdkListenerMethods
> | null>(null);
export const popupConnectionAtom = atom((get) =>
  get(popupConnectionAtomInternal),
);
const setPopupConnectionAtom = atom(
  null,
  (
    _get,
    set,
    update: Connection<PopupActionMethods, SdkListenerMethods> | null,
  ) => {
    set(popupConnectionAtomInternal, update);
  },
);

export function usePopupConnection() {
  const [, setConnection] = useAtom(setPopupConnectionAtom);
  const connection = useAtomValue(popupConnectionAtom);

  // Check for skip handshake environment variable (Vite env or global window var for tests)
  if (SKIP_POPUP) {
    console.warn(
      "[usePopupConnection] Skipping post-me handshake and using mock connection due to VITE_SKIP_POSTME_HANDSHAKE flag.",
    );
    // Define a mock connection that aligns with the SdkListenerMethods structure
    // This mock should be sufficient for tests that don't rely on actual parent communication
    const mockConnection = {
      remoteHandle: () => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        call: (methodName: string, params?: any) => {
          console.log(
            `[MockConnection] Called ${methodName} with params:`,
            params,
          );
          // Return resolved promises for common calls to avoid breaking tests
          if (
            [
              "reportPopupReady",
              "reportFlowStarted",
              "reportStepChanged",
              "reportFormDataSubmitted",
              "reportOnrampInitiated",
              "reportProcessComplete",
              "reportProcessFailed",
              "reportPopupClosedByUser",
            ].includes(methodName)
          ) {
            return Promise.resolve();
          }
          return Promise.resolve({}); // Default mock response
        },
      }),
      close: () => {
        console.log("[MockConnection] close() called");
      },
      localHandle: () => ({
        // Mock local methods if needed, though typically not called by the SDK in this manner
      }),
      closed: false, // Or true, depending on what's more appropriate for tests
      connected: true,
    } as unknown as Connection<PopupActionMethods, SdkListenerMethods>; // Cast to the expected type

    useEffect(() => {
      setConnection(mockConnection);
    }, [setConnection]);

    return { connection: mockConnection };
  }

  const { setFlowError } = useOnrampFlow();
  const setOnrampTarget = useSetOnrampTarget();
  const navigate = useNavigate();

  useEffect(() => {
    if (!SKIP_POPUP && !window.opener) {
      console.error("Popup: Not opened by an SDK window.");
      setFlowError(
        "Initialization error: Popup not opened correctly."
      );
      navigate({
        to: "/onramp/error",
        search: { error: "Initialization error: Popup not opened correctly." }
      });
      return;
    }

    const popupActionMethods: PopupActionMethods = {
      initiateOnrampInPopup: async (payload: InitiateOnrampFlowPayload) => {
        console.log(
          "[Popup] Received initiateOnrampInPopup from SDK:",
          payload,
        );
        if (payload) {
          setOnrampTarget(payload.target);
          navigate({ to: "/onramp/connect-wallet" });

          connection
            ?.remoteHandle()
            .call("reportFlowStarted", payload)
            .catch((e: unknown) =>
              console.error("Popup: Error calling reportFlowStarted", e),
            );
        } else {
          const errorMsg = "Popup: Invalid initiation payload received.";
          console.error(errorMsg);
          setFlowError(errorMsg);
          navigate({
            to: "/onramp/error",
            search: { error: errorMsg }
          });
          connection
            ?.remoteHandle()
            .call("reportProcessFailed", { error: errorMsg, step: "loading" })
            .catch((e: unknown) =>
              console.error("Popup: Error calling reportProcessFailed", e),
            );
        }
      },
    };

    let sdkOrigin: string;

    if (process.env.NODE_ENV === "development") {
      try {
        if (
          window.opener &&
          window.opener.location &&
          typeof window.opener.location.origin === "string" &&
          window.opener.location.origin !== "null"
        ) {
          sdkOrigin = new URL(window.opener.location.href).origin;
          console.log(
            `Popup (Dev): Using opener's origin for WindowMessenger: ${sdkOrigin}`,
          );
        } else {
          sdkOrigin = "*"; // Fallback for development
          console.warn(
            "Popup (Dev): Could not reliably determine opener's origin or it was 'null'. Falling back to '*' for WindowMessenger. This is acceptable for some dev scenarios but ensure SDK host matches if issues arise.",
          );
        }
      } catch (e) {
        sdkOrigin = "*"; // Fallback for development
        console.warn(
          "Popup (Dev): Error determining opener's origin. Using '*' for WindowMessenger.",
          e,
        );
      }
    } else {
      // NODE_ENV === 'production'
      // In PRODUCTION, the SDK (opener) MUST provide its origin via the 'ping_sdk_opener_origin' query parameter.
      // The popup (e.g., https://onramp.pingpay.io) will use this as the expected remoteOrigin for post-me.
      const queryParams = new URLSearchParams(window.location.search);
      const expectedOpenerOrigin = queryParams.get("ping_sdk_opener_origin");

      if (!expectedOpenerOrigin) {
        console.error(
          "Popup (Prod): CRITICAL - 'ping_sdk_opener_origin' query parameter is missing. Cannot securely initialize communication with SDK.",
        );
        setFlowError(
          "Configuration error: SDK identification parameter missing.",
        );
        navigate({
          to: "/onramp/error",
          search: { error: "Configuration error: SDK identification parameter missing." }
        });
        return; // Abort connection setup
      }

      sdkOrigin = expectedOpenerOrigin;
      console.log(
        `Popup (Prod): Using expected SDK origin for WindowMessenger: ${sdkOrigin}. Post-me will validate event.origin against this.`,
      );
    }

    // Final safeguard: if sdkOrigin somehow ended up as '*' in production, abort.
    // The logic above with early returns should prevent this, but this is a defense-in-depth check.
    if (sdkOrigin === "*" && process.env.NODE_ENV === "production") {
      console.error(
        "Popup (Prod): CRITICAL - sdkOrigin resolved to '*' despite checks. This is an insecure state. Aborting connection.",
      );
      setFlowError(
        "Security misconfiguration: Wildcard origin detected in production.",
      );
      navigate({
        to: "/onramp/error",
        search: { error: "Security misconfiguration: Wildcard origin detected in production." }
      });
      return;
    }

    const messenger = new WindowMessenger({
      localWindow: window,
      remoteWindow: window.opener,
      remoteOrigin: sdkOrigin,
    });

    ChildHandshake<PopupActionMethods, SdkListenerMethods>(
      messenger,
      popupActionMethods,
    )
      .then((conn: Connection<PopupActionMethods, SdkListenerMethods>) => {
        console.log("Popup: post-me ChildHandshake successful.");
        setConnection(conn);
        conn
          ?.remoteHandle()
          .call("reportPopupReady")
          .then(() => console.log("Popup: reportPopupReady call successful."))
          .catch((e: unknown) => {
            console.error("Popup: Error calling reportPopupReady", e);
            setFlowError("Failed to signal readiness to SDK.");
            navigate({
              to: "/onramp/error",
              search: { error: "Failed to signal readiness to SDK." }
            });
          });
      })
      .catch((e: unknown) => {
        console.error("Popup: post-me ChildHandshake failed.", e);

        setFlowError(
          `Connection to SDK failed: ${e instanceof Error ? e.message : String(e)}`,
        );
        navigate({
          to: "/onramp/error",
          search: { error: `Connection to SDK failed: ${e instanceof Error ? e.message : String(e)}` }
        });
      });

    const handleBeforeUnload = (_: BeforeUnloadEvent) => {
      const currentConnectionValue = connection;
      if (currentConnectionValue) {
        console.log("Popup: Window is closing, reporting to SDK");
        currentConnectionValue
          ?.remoteHandle()
          .call("reportPopupClosedByUser")
          .catch((e: unknown) =>
            console.warn(
              "Popup: Failed to emit reportPopupClosedByUser on unload",
              e,
            ),
          );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      connection?.close();
      setConnection(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { connection };
}
