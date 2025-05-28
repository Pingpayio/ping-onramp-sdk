// src/pingpay-onramp.ts

import { createSdkChannel } from './internal/communication/channel';
import type { SdkToPopupMessages, PopupToSdkMessages, OnrampFlowStep, TargetAsset, OnrampResult } from './internal/communication/messages';
import { openPopup, closePopup } from './internal/utils/popup-manager';
import type { PingpayOnrampConfig } from './types';
import { PingpayOnrampError } from './errors';

export class PingpayOnramp {
  private config: PingpayOnrampConfig;
  private popup: Window | null = null;
  private channel: ReturnType<typeof createSdkChannel> | null = null;
  private onrampPromise: { resolve: (result: OnrampResult) => void; reject: (error: PingpayOnrampError) => void } | null = null;

  constructor(config: PingpayOnrampConfig) {
    this.config = {
      popupUrl: '/popup/index.html', // Default popup URL, can be overridden
      ...config,
    };
  }

  public async initiateOnramp(target: TargetAsset, initialData?: any): Promise<OnrampResult> {
    if (this.popup && !this.popup.closed) {
      this.popup.focus();
      throw new PingpayOnrampError('Onramp process is already active.');
    }

    return new Promise((resolve, reject) => {
      this.onrampPromise = { resolve, reject };
      try {
        this.popup = openPopup(this.config.popupUrl, 'PingpayOnrampPopup', 500, 700);
        if (!this.popup) {
          throw new PingpayOnrampError('Failed to open popup window. Please check your browser settings.');
        }

        this.channel = createSdkChannel(this.popup);
        this.setupChannelListeners();

        // Wait for popup to be ready before sending initial message
        this.channel.once('popup-ready', () => {
          if (this.channel) {
            this.channel.emit('initiate-onramp-flow', { target, initialData });
          }
        });

        // Monitor popup closure
        const checkPopupClosed = setInterval(() => {
          if (this.popup && this.popup.closed) {
            clearInterval(checkPopupClosed);
            if (this.onrampPromise) {
              // If promise is still pending, reject it as popup was closed prematurely
              this.onrampPromise.reject(new PingpayOnrampError('Popup closed by user before completion.'));
              this.cleanup();
            }
          }
        }, 500);

      } catch (error) {
        const onrampError = error instanceof PingpayOnrampError ? error : new PingpayOnrampError(error instanceof Error ? error.message : 'Failed to initiate onramp flow.');
        this.onrampPromise.reject(onrampError);
        this.cleanup();
      }
    });
  }

  private setupChannelListeners(): void {
    if (!this.channel) return;

    this.channel.on('step-changed', (payload: { step: OnrampFlowStep; details?: any }) => {
      // Handle step changes, e.g., emit events or log
      console.log('Onramp step changed:', payload.step, payload.details);
      if (this.config.onStepChange) {
        this.config.onStepChange(payload.step, payload.details);
      }
    });

    this.channel.on('process-complete', (payload: { result: OnrampResult }) => {
      if (this.onrampPromise) {
        this.onrampPromise.resolve(payload.result);
      }
      this.cleanup();
    });

    this.channel.on('process-failed', (payload: { error: string; details?: any; step?: string }) => {
      if (this.onrampPromise) {
        this.onrampPromise.reject(new PingpayOnrampError(payload.error, payload.details, payload.step));
      }
      this.cleanup();
    });

    this.channel.on('popup-closed-by-user', () => {
      if (this.onrampPromise) {
        this.onrampPromise.reject(new PingpayOnrampError('Popup closed by user.'));
      }
      this.cleanup();
    });
  }

  private cleanup(): void {
    if (this.popup && !this.popup.closed) {
      closePopup(this.popup);
    }
    this.popup = null;
    this.channel?.close();
    this.channel = null;
    this.onrampPromise = null;
  }

  public close(): void {
    if (this.channel) {
        // Try to notify popup if it's still open and channel exists
        try {
            this.channel.emit("popup-closed-by-user", undefined);
        } catch (e) {
            // Ignore errors if channel is already closed or popup is gone
        }
    }
    this.cleanup();
  }
}
