import type { TypedChannel } from 'typed-channel';
import { createPostMessageTransport, createTypedChannel } from "typed-channel";
import type { PopupToSdkMessages, SdkToPopupMessages } from "./messages";

// creates typed channel to popup
export function createSdkChannel(
  popupWindow: Window
): TypedChannel<PopupToSdkMessages, SdkToPopupMessages> {
  if (!popupWindow) {
    throw new Error("Popup window instance is required to create a channel.");
  }

  const transport = createPostMessageTransport<PopupToSdkMessages, SdkToPopupMessages>(popupWindow);
  const channel = createTypedChannel(transport);
  return channel;
}
