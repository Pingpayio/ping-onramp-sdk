// src/internal/communication/channel.ts

import { createTypedChannel } from "typed-channel";
import { createPostMessageTransport } from "typed-channel";
import type { SdkToPopupMessages, PopupToSdkMessages } from "./messages";
import type { TypedChannel } from 'typed-channel'; // Import TypedChannel for explicit return type

// Function to create and return the typed channel for a given popup window
export function createSdkChannel(
  popupWindow: Window,
  targetOrigin: string
): TypedChannel<PopupToSdkMessages, SdkToPopupMessages> {
  if (!popupWindow) {
    throw new Error("Popup window instance is required to create a channel.");
  }

  const transport = createPostMessageTransport<PopupToSdkMessages, SdkToPopupMessages>(popupWindow);
  const channel = createTypedChannel(transport);
  return channel;
}
