import { atom, useAtom, useAtomValue } from 'jotai';
import { ChildHandshake, Connection, WindowMessenger } from 'post-me';
import { useEffect } from 'react';
import type {
  InitiateOnrampFlowPayload,
  PopupActionMethods,
  SdkListenerMethods
} from '../../../../src/internal/communication/post-me-types';
import { useOnrampFlow, useSetOnrampTarget } from '../../state/hooks';

const popupConnectionAtomInternal = atom<Connection<PopupActionMethods, SdkListenerMethods> | null>(null);
export const popupConnectionAtom = atom((get) => get(popupConnectionAtomInternal));
const setPopupConnectionAtom = atom(null, (_get, set, update: Connection<PopupActionMethods, SdkListenerMethods> | null) => {
  set(popupConnectionAtomInternal, update);
});

export function usePopupConnection() {
  const [, setConnection] = useAtom(setPopupConnectionAtom);
  const connection = useAtomValue(popupConnectionAtom);

  const { goToStep, setFlowError } = useOnrampFlow();
  const setOnrampTarget = useSetOnrampTarget();

  useEffect(() => {
    if (!window.opener) {
      console.error("Popup: Not opened by an SDK window.");
      setFlowError("Initialization error: Popup not opened correctly.", "loading");
      return;
    }

    const popupActionMethods: PopupActionMethods = {
      initiateOnrampInPopup: async (payload: InitiateOnrampFlowPayload) => {
        console.log('[Popup] Received initiateOnrampInPopup from SDK:', payload);
        if (payload) {
          setOnrampTarget(payload.target);
          goToStep("form-entry");

          connection?.remoteHandle().call('reportFlowStarted', payload)
            .catch((e: unknown) => console.error("Popup: Error calling reportFlowStarted", e));
        } else {
          const errorMsg = "Popup: Invalid initiation payload received.";
          console.error(errorMsg);
          setFlowError(errorMsg, "loading");
          connection?.remoteHandle().call('reportProcessFailed', { error: errorMsg, step: "loading" })
            .catch((e: unknown) => console.error("Popup: Error calling reportProcessFailed", e));
        }
      },
    };

    // Determine the SDK's origin. For development, this might be a fixed localhost URL.
    // For production, this MUST be the actual origin of the parent window hosting the SDK.
    // A placeholder '*' is insecure for production.
    let sdkOrigin = '*'; // Default for flexibility in local dev if ports change
    if (process.env.NODE_ENV === 'development') {
      // Attempt to get opener's origin if possible, otherwise use a common dev default
      try {
        if (window.opener && new URL(window.opener.location.href).origin) {
          sdkOrigin = new URL(window.opener.location.href).origin;
        } else {
          // Fallback for local dev if opener origin isn't readily available or is file://
          // This might need to be configurable if SDK example runs on different port
          console.warn("Popup: Could not determine opener's origin dynamically in dev. Falling back to localhost:5174 or similar if your example runs there. Ensure this matches SDK host.");
        }
      } catch (e) {
        console.warn("Popup: Error determining opener's origin. Using wildcard. THIS IS INSECURE FOR PRODUCTION.", e);
      }
    } else {
      // In PRODUCTION, this origin MUST be set to the specific, trusted origin of your SDK host.
      // sdkOrigin = 'https://your-sdk-host.com'; // Example
      console.error("Popup: CRITICAL - remoteOrigin for WindowMessenger is not set for production. Using wildcard is insecure.");
    }
    // If popup is served from a different port (e.g. 5173) and SDK example from another (e.g. 5174 for examples/dist)
    // you might need to explicitly set the SDK's origin if document.referrer is not reliable or applicable.
    // For now, using '*' with a strong recommendation to configure it properly.
    // A more robust way for dev might be to pass it via query param from SDK if origins differ.


    const messenger = new WindowMessenger({
      localWindow: window,
      remoteWindow: window.opener,
      remoteOrigin: sdkOrigin
    });

    ChildHandshake<PopupActionMethods, SdkListenerMethods>(messenger, popupActionMethods)
      .then((conn: Connection<PopupActionMethods, SdkListenerMethods>) => {
        console.log('Popup: post-me ChildHandshake successful.');
        setConnection(conn);
        conn.remoteHandle().call('reportPopupReady')
          .then(() => console.log("Popup: reportPopupReady call successful."))
          .catch((e: unknown) => {
            console.error("Popup: Error calling reportPopupReady", e);
            setFlowError("Failed to signal readiness to SDK.", "loading");
          });
      })
      .catch((e: unknown) => {
        console.error('Popup: post-me ChildHandshake failed.', e);

        setFlowError(`Connection to SDK failed: ${e instanceof Error ? e.message : String(e)}`, "loading");
      });

    const handleBeforeUnload = () => {
      const currentConnectionValue = connection;
      if (currentConnectionValue) {
        currentConnectionValue.remoteHandle().call('reportPopupClosedByUser')
          .catch((e: unknown) => console.warn("Popup: Failed to emit reportPopupClosedByUser on unmount/unload", e));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      connection?.close();
      setConnection(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { connection };
}
