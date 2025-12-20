// test opening and closing the popup

import test, { expect } from "@playwright/test";

test.describe("Popup functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000"); // (examples)
  });

  test("should open popup, validate URL, and confirm onPopupReady event", async ({
    page,
  }) => {
    let popupReadyMessageReceived = false;

    // Start waiting for the popup window BEFORE clicking the button
    const popupPromise = page.waitForEvent("popup");

    // Click the button that should open the onramp popup
    await page.click("#openOnrampButton");

    // Wait for the popup window to open and get its page object
    const popupPage = await popupPromise;

    // Listen for the popup's console to detect when it's ready
    popupPage.on("console", (msg) => {
      const text = msg.text();
      if (text.includes('Popup: Sending "ready"') || text.includes("Popup: Attempting to send")) {
        popupReadyMessageReceived = true;
      }
    });

    // Validate the popup URL
    await expect(popupPage.url()).toMatch(/^https:\/\/pingpay\.local\.gd:5173/);

    // Wait for the popup to signal it's ready (via its console log)
    await expect(async () => {
      expect(popupReadyMessageReceived).toBe(true);
    }).toPass({
      timeout: 10000,
    });

    await popupPage.close();
  });
});
