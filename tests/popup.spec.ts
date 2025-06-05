// test opening and closing the popup

import test, { expect } from "@playwright/test";

test.describe("Popup functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000"); // (examples)
  });

  test("should open popup, validate URL, and confirm onPopupReady event", async ({
    page,
  }) => {
    // Listen for the 'onPopupReady' console message from the main page
    let popupReadyMessageReceived = false;
    page.on("console", (msg) => {
      if (msg.text() === "Example: Popup is ready") {
        popupReadyMessageReceived = true;
      }
    });

    // Start waiting for the popup window BEFORE clicking the button
    const popupPromise = page.waitForEvent("popup");

    // Click the button that should open the onramp popup
    // This ID comes from examples/src/main.ts
    await page.click("#openOnrampButton");

    // Wait for the popup window to open and get its page object
    const popupPage = await popupPromise;

    // Validate the popup URL
    await expect(popupPage.url()).toMatch(/^http:\/\/localhost:5173/);

    // Verify that the 'onPopupReady' console message was received on the main page
    // Use expect.poll to wait for the asynchronous event flag to be true.
    await expect(async () => {
      // This condition will be polled until it passes or times out.
      expect(popupReadyMessageReceived).toBe(true);
    }).toPass({
      timeout: 5000, // Maximum time to wait for the condition in milliseconds
    });

    await popupPage.close();
  });
});
