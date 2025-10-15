import type { OnrampResult, TargetAsset } from "@pingpay/onramp-types";
import { PingpayOnrampError } from "./errors";
import { closePopup, openPopup } from "./internal/utils/popup-manager";
import type { PingpayOnrampConfig } from "./types";

const DEFAULT_POPUP_URL = "https://onramp.pingpay.io";

const POPUP_WINDOW_NAME = "PingpayOnrampPopup";

const POPUP_WIDTH = 500;

const POPUP_HEIGHT = 700;

/**
 * PingPay Onramp SDK for integrating cryptocurrency onramp functionality.
 *
 * This class provides a simple interface to initiate onramp flows through a popup window,
 * allowing users to purchase cryptocurrency using fiat payment methods.
 *
 * @example
 * ```typescript
 * // Create a new instance with configuration
 * const config: PingpayOnrampConfig = {
 *   onProcessComplete: (result) => console.log('Complete:', result),
 *   onProcessFailed: (error) => console.error('Failed:', error)
 * };
 *
 * const onramp = new PingpayOnramp(config);
 *
 * // Initiate the onramp process
 * try {
 *   const result = await onramp.initiateOnramp({ chain: 'NEAR', asset: 'wNEAR' });
 *   console.log('Onramp successful:', result);
 * } catch (error) {
 *   console.error('Onramp failed:', error);
 * }
 * ```
 */
export class PingpayOnramp {
  private config: PingpayOnrampConfig;
  private channel: BroadcastChannel | null = null;
  private popup: Window | null = null;
  private sessionId: string = "";
  private checkClosedInterval?: NodeJS.Timeout;
  private onrampPromise: {
    resolve: (result: OnrampResult) => void;
    reject: (error: PingpayOnrampError) => void;
  } | null = null;
  private status: "idle" | "active" | "closed" = "idle";
  private popupUrl: string;

  /**
   * Creates a new PingpayOnramp instance.
   *
   * @param config - Configuration object containing callback functions and optional settings
   */
  constructor(config: PingpayOnrampConfig) {
    this.config = config;
    this.popupUrl = config.popupUrl ?? DEFAULT_POPUP_URL;
  }

  /**
   * Initiates the onramp process for the specified target asset.
   *
   * Opens a popup window that guides the user through the onramp flow including
   * wallet connection, form submission, and transaction processing.
   *
   * @param target - The target asset specification containing chain and asset identifiers
   * @returns Promise that resolves with the onramp result when the process completes successfully
   */
  public initiateOnramp(target: TargetAsset): Promise<OnrampResult> {
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
      this.sessionId = crypto.randomUUID();
      this.channel = new BroadcastChannel("pingpay-onramp");

      // Listen for messages from popup
      this.channel.onmessage = (event) => {
        if (event.data.sessionId === this.sessionId) {
          if (event.data.type === "complete") {
            this.onrampPromise?.resolve(event.data.result);
            this.cleanup();
          } else if (event.data.type === "error") {
            const error = new PingpayOnrampError(
              event.data.error,
              event.data.details,
              event.data.step,
            );
            this.onrampPromise?.reject(error);
            this.cleanup();
          }
        }
      };

      // Open popup with sessionId and target asset in URL
      console.log(`SDK: Opening popup with sessionId: ${this.sessionId}`);
      const url = new URL(`${this.popupUrl}/onramp`);
      url.searchParams.set("sessionId", this.sessionId);
      url.searchParams.set("chain", target.chain);
      url.searchParams.set("asset", target.asset);

      this.popup = openPopup(
        url.toString(),
        POPUP_WINDOW_NAME,
        POPUP_WIDTH,
        POPUP_HEIGHT,
      );

      if (!this.popup) {
        const error = new PingpayOnrampError(
          "Failed to open popup window. Please check your browser settings.",
        );
        this.onrampPromise?.reject(error);
        this.cleanup();
        return;
      }

      this.checkClosedInterval = setInterval(() => {
        if (this.popup?.closed) {
          if (this.checkClosedInterval) {
            clearInterval(this.checkClosedInterval);
            this.checkClosedInterval = undefined;
          }
          this.onrampPromise?.reject(
            new PingpayOnrampError("Popup closed before completion."),
          );
          this.cleanup();
        }
      }, 1000);
    });
  }

  private cleanup(): void {
    if (this.status === "closed") {
      return;
    }

    if (this.checkClosedInterval) {
      clearInterval(this.checkClosedInterval);
      this.checkClosedInterval = undefined;
    }

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    if (this.popup && !this.popup.closed) {
      closePopup(this.popup);
    }

    this.config.onPopupClose?.();
    this.popup = null;
    this.onrampPromise = null;
    this.status = "closed";
  }

  /**
   * Closes the onramp instance and cleans up all resources.
   *
   * This method closes any open popup windows, clears intervals, and terminates
   * communication channels. After calling this method, the instance cannot be reused.
   *
   * @example
   * ```typescript
   * // Clean shutdown when done with the onramp instance
   * onramp.close();
   * ```
   */
  public close(): void {
    this.cleanup();
  }
}
