// @ts-expect-error post-me typings are weird
import { Connection, ParentHandshake, WindowMessenger } from "post-me";
import { PingpayOnrampError } from "./errors";
import type {
  OnrampResult,
  TargetAsset,
} from "./internal/communication/messages";
import type {
  InitiateOnrampFlowPayload,
  PopupActionMethods,
  SdkListenerMethods,
} from "./internal/communication/post-me-types";
import { closePopup, openPopup } from "./internal/utils/popup-manager";
import type { PingpayOnrampConfig } from "./types";

const DEFAULT_POPUP_URL = "https://onramp.pingpay.io";
const POPUP_WINDOW_NAME = "PingpayOnrampPopup";
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 700;

type OnrampStatus = "idle" | "active" | "closed";

export class PingpayOnramp {
  private config: PingpayOnrampConfig;
  private popup: Window | null = null;
  private postMeConnection: Connection<
    SdkListenerMethods,
    PopupActionMethods
  > | null = null;
  private onrampPromise: {
    resolve: (result: OnrampResult) => void;
    reject: (error: PingpayOnrampError) => void;
  } | null = null;
  private heartbeatInterval?: NodeJS.Timeout;
  private status: OnrampStatus = "idle";

  private popupUrl: string;

  constructor(config: PingpayOnrampConfig) {
    this.config = config;
    this.popupUrl = config.popupUrl ?? DEFAULT_POPUP_URL;
  }

  public initiateOnramp(
    target: TargetAsset,
    initialData?: any,
  ): Promise<OnrampResult> {
    if (this.status === "active") {
      this.popup?.focus();
      throw new PingpayOnrampError("Onramp process is already active.");
    }

    if (this.status === "closed") {
      throw new PingpayOnrampError(
        "SDK has been closed and cannot be reused. Please create a new instance.",
      );
    }

    this.status = "active";

    return new Promise((resolve, reject) => {
      this.onrampPromise = { resolve, reject };

      (async () => {
        try {
          console.log(`SDK: Opening popup at URL: ${this.popupUrl}`);
          this.popup = openPopup(
            this.popupUrl,
            POPUP_WINDOW_NAME,
            POPUP_WIDTH,
            POPUP_HEIGHT,
          );
          if (!this.popup) {
            throw new PingpayOnrampError(
              "Failed to open popup window. Please check your browser settings.",
            );
          }

          const messenger = new WindowMessenger({
            localWindow: window,
            remoteWindow: this.popup,
            remoteOrigin: new URL(this.popupUrl).origin,
          });

          const sdkListenerMethods: SdkListenerMethods = {
            reportPopupReady: async () => {
              console.log("SDK: Received reportPopupReady from popup.");
              this.config.onPopupReady?.();
              if (this.postMeConnection) {
                try {
                  const payload: InitiateOnrampFlowPayload = {
                    target,
                    initialData,
                  };
                  console.log(
                    "SDK: Calling initiateOnrampInPopup on popup.",
                    payload,
                  );
                  await this.postMeConnection
                    .remoteHandle()
                    .call("initiateOnrampInPopup", payload);
                  console.log("SDK: initiateOnrampInPopup call completed.");
                } catch (e) {
                  const errorMsg =
                    "SDK: Error calling initiateOnrampInPopup on popup";
                  console.error(errorMsg, e);
                  this.onrampPromise?.reject(
                    new PingpayOnrampError(
                      errorMsg,
                      e instanceof Error ? e : undefined,
                    ),
                  );
                  this.cleanup();
                }
              }
            },
            reportFlowStarted: async (payload) => {
              console.log("SDK: Flow started by popup.", payload);
              this.config.onFlowStarted?.(payload);
            },
            reportStepChanged: async (payload) => {
              console.log(
                "SDK: Onramp step changed:",
                payload.step,
                payload.details,
              );
              this.config.onStepChange?.(payload.step, payload.details);
            },
            reportFormDataSubmitted: async (payload) => {
              console.log("SDK: Form data submitted.", payload);
              this.config.onFormDataSubmitted?.(payload);
            },
            reportWalletConnected: async (payload) => {
              console.log("SDK: Wallet connected.", payload);
              this.config.onWalletConnected?.(payload);
            },
            reportTransactionSigned: async (payload) => {
              console.log("SDK: Transaction signed.", payload);
              this.config.onTransactionSigned?.(payload);
            },
            reportOnrampInitiated: async (payload) => {
              console.log("SDK: Onramp initiated with service.", payload);
              this.config.onOnrampInitiated?.(payload);
            },
            reportProcessComplete: async (payload) => {
              console.log("SDK: Process complete.", payload);
              if (this.onrampPromise) {
                this.onrampPromise.resolve(payload.result);
              }
              this.config.onProcessComplete?.(payload.result);
              this.cleanup();
            },
            reportProcessFailed: async (payload) => {
              console.log("SDK: Process failed.", payload);
              if (this.onrampPromise) {
                this.onrampPromise.reject(
                  new PingpayOnrampError(
                    payload.error,
                    payload.details,
                    payload.step,
                  ),
                );
              }
              this.config.onProcessFailed?.(payload);
            },
            reportPopupClosedByUser: async () => {
              console.log("SDK: Popup closed by user.");
              if (this.onrampPromise) {
                this.onrampPromise.reject(
                  new PingpayOnrampError("Popup closed by user."),
                );
              }
              this.cleanup();
            },
          };

          this.postMeConnection = await ParentHandshake(
            messenger,
            sdkListenerMethods,
            5000,
          );

          console.log("SDK: post-me ParentHandshake successful.");
          this.setupHeartbeat();
        } catch (error) {
          const onrampError =
            error instanceof PingpayOnrampError
              ? error
              : new PingpayOnrampError(
                  error instanceof Error
                    ? error.message
                    : "Failed to initiate onramp flow.",
                  error,
                );
          this.onrampPromise?.reject(onrampError);
          this.cleanup();
        }
      })();
    });
  }

  private setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.popup?.closed) {
        console.log("SDK: Heartbeat detected popup closed.");
        if (this.onrampPromise) {
          this.onrampPromise.reject(
            new PingpayOnrampError("Popup closed before completion."),
          );
        }
        this.cleanup();
      }
    }, 1000);
  }

  private cleanup(): void {
    if (this.status === "closed") {
      return;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
    if (this.postMeConnection) {
      this.postMeConnection.close();
      this.postMeConnection = null;
    }
    if (this.popup && !this.popup.closed) {
      closePopup(this.popup);
    }
    this.config.onPopupClose?.();
    this.popup = null;
    this.onrampPromise = null;
    this.status = "closed";
  }

  public close(): void {
    this.cleanup();
  }
}
