
import { z } from 'zod';
import { PingpayOnrampError } from './errors';
import { createSdkChannel } from './internal/communication/channel';
import type {
  OnrampFlowStep,
  OnrampResult,
  TargetAsset,
  formDataSubmittedPayloadSchema,
  initiateOnrampFlowPayloadSchema,
  onrampInitiatedPayloadSchema,
  processFailedPayloadSchema,
  transactionSignedPayloadSchema,
  walletConnectedPayloadSchema
} from './internal/communication/messages';
import { closePopup, openPopup } from './internal/utils/popup-manager';
import type { PingpayOnrampConfig } from './types';

export class PingpayOnramp {
  private config: PingpayOnrampConfig;
  private popup: Window | null = null;
  private channel: ReturnType<typeof createSdkChannel> | null = null;
  private onrampPromise: { resolve: (result: OnrampResult) => void; reject: (error: PingpayOnrampError) => void } | null = null;
  private popupReadyPromise: Promise<void> | null = null;
  private resolvePopupReady: (() => void) | null = null;

  constructor(config: PingpayOnrampConfig) {
    this.config = {
      popupUrl: '/popup/index.html', // Default popup URL
      ...config,
    };
    // apiKey is now part of this.config

    this.popupReadyPromise = new Promise<void>((resolve) => {
        this.resolvePopupReady = resolve;
    });
  }

  private getPopupOrigin(): string {
    try {
      if (!this.config.popupUrl) {
        throw new Error('popupUrl is not configured.');
      }
      return new URL(this.config.popupUrl, window.location.origin).origin;
    } catch (e) {
      console.error("Invalid popupUrl:", this.config.popupUrl, e);
      // Fallback or re-throw, depending on desired strictness.
      
      throw new PingpayOnrampError('Invalid popupUrl configured.', { popupUrl: this.config.popupUrl });
    }
  }

  public async initiateOnramp(target: TargetAsset, initialData?: any): Promise<OnrampResult> {
    if (this.popup && !this.popup.closed) {
      this.popup.focus();
      throw new PingpayOnrampError('Onramp process is already active.');
    }

    // Reset popupReadyPromise for this new initiation attempt
    this.popupReadyPromise = new Promise<void>((resolve) => {
        this.resolvePopupReady = resolve;
    });

    return new Promise((resolve, reject) => {
      this.onrampPromise = { resolve, reject };
      try {
        const popupUrl = this.config.popupUrl || '/popup/index.html';
        this.popup = openPopup(popupUrl, 'PingpayOnrampPopup', 500, 700);
        if (!this.popup) {
          throw new PingpayOnrampError('Failed to open popup window. Please check your browser settings.');
        }

        this.channel = createSdkChannel(this.popup, this.getPopupOrigin());
        this.setupChannelListeners();

        // Wait for popup to be ready before sending initial message
        // This is now handled by the 'popup-ready' listener which resolves popupReadyPromise
        this.popupReadyPromise?.then(() => {
          if (this.channel && this.popup && !this.popup.closed) {
            this.channel.emit('initiate-onramp-flow', { target, initialData });
          } else if (this.onrampPromise) {
            // If channel or popup became invalid before sending, reject.
            this.onrampPromise.reject(new PingpayOnrampError('Popup closed or channel unavailable before flow initiation.'));
            this.cleanup();
          }
        }).catch(error => {
            if (this.onrampPromise) {
                this.onrampPromise.reject(new PingpayOnrampError('Error during popup readiness wait.', error));
                this.cleanup();
            }
        });


        // Monitor popup closure
        const checkPopupClosed = setInterval(() => {
          if (this.popup && this.popup.closed) {
            clearInterval(checkPopupClosed);
            if (this.onrampPromise) {
              this.onrampPromise.reject(new PingpayOnrampError('Popup closed by user before completion.'));
              this.cleanup(); // This will also call onPopupClose if configured
            } else {
              // If no onrampPromise, it means it was already resolved/rejected.
              // Still, call onPopupClose if the popup was closed externally.
              this.config.onPopupClose?.();
              this.cleanup(); // Ensure full cleanup
            }
          }
        }, 500);

      } catch (error) {
        const onrampError = error instanceof PingpayOnrampError ? error : new PingpayOnrampError(error instanceof Error ? error.message : 'Failed to initiate onramp flow.', error);
        this.onrampPromise.reject(onrampError);
        this.cleanup();
      }
    });
  }

  private setupChannelListeners(): void {
    if (!this.channel) return;

    this.channel.on('popup-ready', () => {
      console.log('SDK: Popup is ready.');
      if (this.resolvePopupReady) this.resolvePopupReady();
      this.config.onPopupReady?.();
    });

    this.channel.on('flow-started', (payload: z.infer<typeof initiateOnrampFlowPayloadSchema>) => {
      console.log('SDK: Flow started by popup.', payload);
      this.config.onFlowStarted?.(payload);
    });

    this.channel.on('step-changed', (payload: { step: OnrampFlowStep; details?: any }) => {
      console.log('SDK: Onramp step changed:', payload.step, payload.details);
      this.config.onStepChange?.(payload.step, payload.details);
    });

    this.channel.on('form-data-submitted', (payload: z.infer<typeof formDataSubmittedPayloadSchema>) => {
      console.log('SDK: Form data submitted.', payload);
      this.config.onFormDataSubmitted?.(payload);
    });

    this.channel.on('wallet-connected', (payload: z.infer<typeof walletConnectedPayloadSchema>) => {
      console.log('SDK: Wallet connected.', payload);
      this.config.onWalletConnected?.(payload);
    });

    this.channel.on('transaction-signed', (payload: z.infer<typeof transactionSignedPayloadSchema>) => {
      console.log('SDK: Transaction signed.', payload);
      this.config.onTransactionSigned?.(payload);
    });

    this.channel.on('onramp-initiated', (payload: z.infer<typeof onrampInitiatedPayloadSchema>) => {
      console.log('SDK: Onramp initiated with service.', payload);
      this.config.onOnrampInitiated?.(payload);
    });

    this.channel.on('process-complete', (payload: { result: OnrampResult }) => {
      if (this.onrampPromise) {
        this.onrampPromise.resolve(payload.result);
      }
      this.config.onProcessComplete?.(payload.result);
      this.cleanup();
    });

    this.channel.on('process-failed', (payload: z.infer<typeof processFailedPayloadSchema>) => {
      if (this.onrampPromise) {
        this.onrampPromise.reject(new PingpayOnrampError(payload.error, payload.details, payload.step));
      }
      this.config.onProcessFailed?.(payload);
      this.cleanup();
    });

    this.channel.on('popup-closed-by-user', () => {
      if (this.onrampPromise) {
        // If an onramp process was active, reject its promise.
        this.onrampPromise.reject(new PingpayOnrampError('Popup closed by user.'));
      }
      // onPopupClose is called within cleanup
      this.cleanup();
    });
  }

  private cleanup(): void {
    if (this.popup && !this.popup.closed) {
      closePopup(this.popup);
    }
    this.config.onPopupClose?.(); // Call onPopupClose whenever cleanup is invoked
    this.popup = null;
    // this.channel?.close(); // TypedChannel instances do not have a .close() method.
    this.channel = null;
    this.onrampPromise = null;
    // Reset popupReadyPromise for subsequent calls to initiateOnramp
    this.popupReadyPromise = new Promise<void>((resolve) => {
        this.resolvePopupReady = resolve;
    });
  }

  public close(): void {
    // This method is intended for the SDK consumer to programmatically close the onramp.
    if (this.channel && this.popup && !this.popup.closed) {
        try {
            // Attempt to inform the popup it's being closed by the SDK.
            // This is distinct from the popup closing itself.
            // We might need a specific message like 'sdk-closing-popup' if the popup needs to react.
            
        } catch (e) {
            // Ignore errors if channel is already closed or popup is gone
        }
    }
    this.cleanup(); // This will close the popup and call onPopupClose.
  }
}
