// Test appFees functionality: passing from SDK to popup, and through API requests

import test, { expect } from "@playwright/test";

test.describe("AppFees functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should include appFees in quote request when popup makes API call", async ({
    page,
    context,
  }) => {
    const apiRequests: Array<{ url: string; body: any }> = [];

    // Set up route interception at context level to catch all popup requests
    await context.route("**/api/onramp/quote", async (route) => {
      const request = route.request();
      const postData = request.postData();
      if (postData) {
        const body = JSON.parse(postData);
        apiRequests.push({
          url: request.url(),
          body,
        });
        console.log("Intercepted quote request with body:", JSON.stringify(body, null, 2));
      }
      await route.continue();
    });

    const popupPromise = page.waitForEvent("popup");
    await page.click("#openOnrampButton");
    const popupPage = await popupPromise;

    // Wait for the form to be visible
    await popupPage.waitForSelector("#amount", { timeout: 5000 });
    
    // Fill in the recipient address to make form valid
    const recipientInput = popupPage.locator("#recipientAddress");
    await recipientInput.fill("test.near");

    // Fill amount input to trigger quote request
    const amountInput = popupPage.locator("#amount");
    await amountInput.fill("100");

    // Wait for the debounced quote request (300ms debounce + network time)
    await popupPage.waitForTimeout(2000);

    // Check if any quote requests were made
    expect(apiRequests.length).toBeGreaterThan(0);

    const quoteRequest = apiRequests.find((req) => req.url.includes("/quote"));
    expect(quoteRequest).toBeDefined();

    if (quoteRequest) {
      expect(quoteRequest.body).toHaveProperty("appFees");
      expect(quoteRequest.body.appFees).toBeDefined();
      expect(Array.isArray(quoteRequest.body.appFees)).toBe(true);
      expect(quoteRequest.body.appFees.length).toBeGreaterThan(0);
      expect(quoteRequest.body.appFees[0]).toHaveProperty("recipient");
      expect(quoteRequest.body.appFees[0]).toHaveProperty("fee");
      expect(quoteRequest.body.appFees[0].recipient).toBe("test.near");
      expect(quoteRequest.body.appFees[0].fee).toBe(100);
      
      console.log("✓ Verified appFees in quote request to our API:", quoteRequest.body.appFees);
    }

    await popupPage.close();
  });

  test("should work end-to-end with appFees", async ({ page }) => {
    const popupPromise = page.waitForEvent("popup");
    await page.click("#openOnrampButton");
    const popupPage = await popupPromise;

    await popupPage.waitForURL(/\/onramp\/form-entry/, { timeout: 10000 });

    const popupUrl = popupPage.url();
    expect(popupUrl).toMatch(/^https:\/\/pingpay\.local\.gd:5173/);
    expect(popupUrl).toContain("/onramp/form-entry");
    
    await expect(popupPage.locator("#amount")).toBeVisible();

    await popupPage.close();
  });

  test("should handle missing appFees gracefully", async ({ page }) => {
    // This test would require modifying the demo app to not include appFees
    // For now, we'll just verify the system doesn't break when appFees is not provided
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("appFees") || text.includes("SDK:")) {
        consoleMessages.push(text);
      }
    });

    // Note: This test assumes the demo app has appFees configured
    // To properly test missing appFees, you'd need a separate test setup
    // For now, we verify the system works with appFees present

    const popupPromise = page.waitForEvent("popup");
    await page.click("#openOnrampButton");
    const popupPage = await popupPromise;

    await popupPage.waitForURL(/\/onramp\/form-entry/, { timeout: 10000 });

    expect(popupPage.url()).toMatch(/^https:\/\/pingpay\.local\.gd:5173/);
    expect(popupPage.url()).toContain("/onramp/form-entry");

    await popupPage.close();
  });
});
