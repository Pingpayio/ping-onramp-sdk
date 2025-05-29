import type { PopupToSdkMessages, SdkToPopupMessages } from '../../../../src/internal/communication/messages';

// Define a union type for SdkToPopupMessages
type SdkToPopupMessage<T extends keyof SdkToPopupMessages = keyof SdkToPopupMessages> = 
  T extends keyof SdkToPopupMessages 
    ? { type: T; payload: SdkToPopupMessages[T] } 
    : never;

// Define a union type for PopupToSdkMessages
type PopupToSdkMessage<T extends keyof PopupToSdkMessages = keyof PopupToSdkMessages> = 
  T extends keyof PopupToSdkMessages 
    ? { type: T; payload: PopupToSdkMessages[T] } 
    : never;


// This is a placeholder implementation.
// In a real scenario, this would involve window.postMessage or similar mechanisms.

const sdkOrigin = '*'; // Be more specific in a real application

export function sendMessageToSdk(message: PopupToSdkMessage): void {
  console.log('POPUP Sending to SDK:', message);
  if (window.parent !== window) {
    window.parent.postMessage(message, sdkOrigin);
  } else if (window.opener) {
    window.opener.postMessage(message, sdkOrigin);
  } else {
    console.warn('No SDK window (parent or opener) found to send message to.');
  }
}

export function listenToSdkMessages(callback: (message: SdkToPopupMessage) => void): () => void {
  const handler = (event: MessageEvent) => {
    // Add origin check for security if sdkOrigin is not '*'
    // if (event.origin !== sdkOrigin && sdkOrigin !== '*') return;

    const message = event.data as SdkToPopupMessage;
    if (message && message.type && (message.type === 'initiate-onramp-flow' /* add other SdkToPopup message types here */)) { 
      console.log('POPUP Received from SDK:', message);
      callback(message);
    } else if (message && message.type) {
      console.log('POPUP Received unknown/unhandled message type from SDK or other source:', message.type);
    }
  };

  window.addEventListener('message', handler);
  console.log('POPUP Listening for SDK messages...');

  return () => {
    window.removeEventListener('message', handler);
    console.log('POPUP Stopped listening for SDK messages.');
  };
}

// Export the new types
export type { SdkToPopupMessage, PopupToSdkMessage };
