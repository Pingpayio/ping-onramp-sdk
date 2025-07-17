import { SKIP_POSTME_HANDSHAKE } from "@/config";
import type {
  InitiateOnrampFlowPayload,
  PopupActionMethods,
  SdkListenerMethods,
  TargetAsset,
} from "@pingpay/onramp-sdk";
import { ChildHandshake, type Connection, WindowMessenger } from "post-me";

type PopupConnection = Connection<PopupActionMethods, SdkListenerMethods>;

let connectionPromise: Promise<PopupConnection> | null = null;
let resolveTargetAsset: (target: TargetAsset) => void;

const targetAssetPromise: Promise<TargetAsset> = new Promise((resolve) => {
  resolveTargetAsset = resolve;
});

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

const establishConnection = async (): Promise<PopupConnection> => {
  if (SKIP_POSTME_HANDSHAKE === "true") {
    console.warn(
      "[PopupConnection] Skipping post-me handshake due to VITE_SKIP_POSTME_HANDSHAKE flag.",
    );
    const mockTarget = { chain: "NEAR", asset: "wNEAR" };
    resolveTargetAsset(mockTarget);
    return {
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
  }

  const opener = window.opener as WindowProxy;
  const openerOrigin = getOpenerOrigin();
  const sdkOrigin =
    openerOrigin ?? (process.env.NODE_ENV === "development" ? "*" : null);

  if (!sdkOrigin) {
    throw new Error(
      "Configuration error: SDK identification parameter missing.",
    );
  }

  if (sdkOrigin === "*" && process.env.NODE_ENV === "production") {
    throw new Error(
      "Security misconfiguration: Wildcard origin detected in production.",
    );
  }

  const popupActionMethods: PopupActionMethods = {
    initiateOnrampInPopup: (payload: InitiateOnrampFlowPayload) => {
      console.log("[Popup] Received initiateOnrampInPopup from SDK:", payload);
      resolveTargetAsset(payload.target);
      // We can report flow started here, as it's a direct response to the initiation
      connectionPromise
        ?.then((conn) => conn.remoteHandle().call("reportFlowStarted", payload))
        .catch((e) =>
          console.error("Failed to report flow started on initiation", e),
        );
    },
  };

  const messenger = new WindowMessenger({
    localWindow: window,
    remoteWindow: opener,
    remoteOrigin: sdkOrigin,
  });

  const conn = await ChildHandshake(messenger, popupActionMethods);
  console.log("Popup: post-me ChildHandshake successful.");

  // After connection, immediately report that the popup is ready.
  conn
    .remoteHandle()
    .call("reportPopupReady")
    .catch((e) => console.error("Failed to report popup ready", e));

  return conn;
};

export const getConnection = (): Promise<PopupConnection> => {
  if (!connectionPromise) {
    connectionPromise = establishConnection();
  }
  return connectionPromise;
};

export const getTargetAsset = (): Promise<TargetAsset> => {
  // Ensure connection is initiated, which will eventually resolve the target asset
  getConnection().catch((e) => {
    console.error("Connection failed during getTargetAsset", e);
    // Propagate error to targetAssetPromise if connection fails
    // This requires changing how resolveTargetAsset is handled, maybe a reject function
  });
  return targetAssetPromise;
};
