// src/internal/communication/channel.ts

import { createTypedChannel } from "typed-channel";
import { createPostMessageTransport } from "typed-channel";
import type { SdkToPopupMessages, PopupToSdkMessages } from "./messages";

// Function to create and return the typed channel for a given popup window
export function createSdkChannel(popupWindow: Window): ReturnType<typeof createTypedChannel<PopupToSdkMessages, SdkToPopupMessages>> {
  const transport = createPostMessageTransport<PopupToSdkMessages, SdkToPopupMessages>(popupWindow, {
      // Optional: Add origin validation for security
      targetOrigin: '*', // IMPORTANT: Replace '*' with the actual origin of your popup when deployed
      // validateMessage: (event) => { /* Add your validation logic here, potentially using Zod schemas */ return true; }
  });
  const channel = createTypedChannel(transport);
  return channel;
}
