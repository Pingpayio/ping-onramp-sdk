// test the onramp: connecting to wallet, filling out form, verifying redirect url params

import test, { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test.describe("Onramp functionality", () => {
  let popupPage: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");

    const popupPromise = page.waitForEvent("popup");
    await page.click("#openOnrampButton");
    popupPage = await popupPromise;

    let popupReadyMessageReceived = false;
    popupPage.on("console", (msg) => {
      const text = msg.text();
      if (text.includes('Popup: Sending "ready"') || text.includes("Popup: Attempting to send")) {
        popupReadyMessageReceived = true;
      }
    });

    await expect(async () => {
      expect(popupReadyMessageReceived).toBe(true);
      expect(popupPage.url()).toMatch(/^https:\/\/pingpay\.local\.gd:5173/);
    }).toPass({
      timeout: 10000,
    });
  });

  test.afterEach(() => {
    popupPage.close();
  });

  test.skip("should fill and submit a form on the onramp popup", async () => {
    // Ensure popupPage is available
    expect(popupPage, "Popup page should be defined").toBeDefined();
    expect(popupPage.isClosed(), "Popup page should not be closed").toBe(false);

    // Example: Fill an email input field
    // Replace '#email-input' with the actual selector for your email field
    const emailInput = popupPage.locator("#email-input");
    await emailInput.waitFor({ state: "visible", timeout: 5000 }); // Wait for element to be visible
    await emailInput.fill("test@example.com");
    await expect(emailInput).toHaveValue("test@example.com");

    // Example: Click a submit button
    // Replace '#submit-form-button' with the actual selector for your submit button
    const submitButton = popupPage.locator("#submit-form-button");
    await submitButton.waitFor({ state: "visible", timeout: 5000 });
    await submitButton.click();

    // Example: Assert that a success message appears
    // Replace '#success-message' with the actual selector for your success message
    // and 'Form submitted successfully!' with the expected text.
    const successMessage = popupPage.locator("#success-message");
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(successMessage).toHaveText("Form submitted successfully!");

    // You can also check for URL changes or other side effects if applicable
    // For example:
    // await expect(popupPage).toHaveURL(/.*\/success/);
  });

  // Add other tests for onramp functionality here
});
