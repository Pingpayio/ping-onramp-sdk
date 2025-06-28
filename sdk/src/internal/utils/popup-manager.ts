/**
 * Opens a new popup window.
 * @param url The URL to open in the popup.
 * @param windowName The name of the window.
 * @param width The width of the popup window.
 * @param height The height of the popup window.
 * @returns The Window object for the opened popup, or null if it failed.
 */
export function openPopup(
  url: string,
  windowName: string,
  width: number,
  height: number,
): Window | null {
  const sdkHostOrigin = window.location.origin;
  const popupUrl = new URL(url);
  popupUrl.searchParams.set("ping_sdk_opener_origin", sdkHostOrigin);

  const top = (window.screen.height - height) / 2 + window.screenY;
  const left = (window.screen.width - width) / 2 + window.screenX;

  const features = [
    `width=${width}`,
    `height=${height}`,
    `top=${top}`,
    `left=${left}`,
    "scrollbars=yes",
    "resizable=yes",
    "status=yes",
    "location=no", // Hides address bar in some browsers, but not all
    "toolbar=no",
    "menubar=no",
  ].join(",");

  const newWindow = window.open(popupUrl.toString(), windowName, features);

  if (newWindow) {
    newWindow.focus();
  }

  return newWindow;
}

/**
 * Closes a given popup window.
 * @param popupWindow The popup window to close.
 */
export function closePopup(popupWindow: Window | null): void {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  }
}
