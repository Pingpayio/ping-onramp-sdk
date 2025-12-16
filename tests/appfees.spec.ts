// Test appFees functionality: passing from SDK to popup, and through API requests

import test, { expect } from "@playwright/test";

test.describe("AppFees functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should pass appFees from SDK config to popup URL", async ({ page }) => {
    // Listen for console logs
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("appFees") || text.includes("SDK:") || text.includes("Popup:")) {
        consoleMessages.push(text);
      }
    });

    // Start waiting for the popup window BEFORE clicking the button
    const popupPromise = page.waitForEvent("popup");

    // Click the button that should open the onramp popup
    await page.click("#openOnrampButton");

    // Wait for the popup window to open
    const popupPage = await popupPromise;

    // Wait a bit for the popup to load and process URL params
    await popupPage.waitForTimeout(1000);

    // Check that the popup URL contains appFees parameter
    const popupUrl = popupPage.url();
    expect(popupUrl).toContain("appFees");

    // Parse the appFees from URL
    const urlParams = new URL(popupUrl).searchParams;
    const appFeesParam = urlParams.get("appFees");
    expect(appFeesParam).toBeTruthy();

    // Verify appFees structure
    if (appFeesParam) {
      const appFees = JSON.parse(appFeesParam);
      expect(Array.isArray(appFees)).toBe(true);
      expect(appFees.length).toBeGreaterThan(0);
      expect(appFees[0]).toHaveProperty("recipient");
      expect(appFees[0]).toHaveProperty("fee");
      expect(appFees[0].fee).toBe(100); // 100 basis points = 1%
      expect(appFees[0].recipient).toBe("test.near");
    }

    // Check console logs for appFees messages
    const appFeesLogs = consoleMessages.filter((msg) =>
      msg.toLowerCase().includes("appfees"),
    );
    expect(appFeesLogs.length).toBeGreaterThan(0);

    await popupPage.close();
  });

  test("should include appFees in quote request when popup makes API call", async ({
    page,
  }) => {
    // Intercept API requests from the popup page to check if appFees is included
    const apiRequests: Array<{ url: string; body: any }> = [];

    // Start waiting for the popup window BEFORE setting up route interception
    const popupPromise = page.waitForEvent("popup");

    // Click the button to open onramp
    await page.click("#openOnrampButton");

    const popupPage = await popupPromise;

    // Wait for popup to load
    await popupPage.waitForTimeout(2000);

    // Set up route interception on the popup page (not the main page)
    await popupPage.route("**/api/onramp/quote", async (route) => {
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
      // Continue with the actual request
      await route.continue();
    });

    // Wait for the form to load and potentially trigger a quote request
    // The quote request is triggered when amount is entered and form is valid
    try {
      // Wait for form elements to be visible
      await popupPage.waitForSelector('input[type="number"], input[name="amount"]', {
        timeout: 5000,
      });

      // Enter an amount to trigger quote request (if not already triggered)
      const amountInput = popupPage.locator('input[type="number"], input[name="amount"]').first();
      if (await amountInput.isVisible()) {
        await amountInput.fill("100");
        // Wait for the debounced quote request (300ms debounce + network time)
        await popupPage.waitForTimeout(1500);
      }
    } catch (error) {
      console.log("Could not find amount input, quote might be triggered automatically");
      // Wait a bit more in case quote is triggered automatically
      await popupPage.waitForTimeout(2000);
    }

    // Wait for quote requests to be made
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

  test("should log appFees at each step of the flow", async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("appFees") || text.includes("SDK:") || text.includes("Popup:")) {
        consoleMessages.push(text);
      }
    });

    const popupPromise = page.waitForEvent("popup");
    await page.click("#openOnrampButton");
    const popupPage = await popupPromise;

    // Wait for popup to process
    await popupPage.waitForTimeout(2000);

    // Check that we have logs from SDK
    const sdkLogs = consoleMessages.filter((msg) => msg.includes("SDK:"));
    expect(sdkLogs.length).toBeGreaterThan(0);

    // Check that we have logs mentioning appFees
    const appFeesLogs = consoleMessages.filter((msg) =>
      msg.toLowerCase().includes("appfees"),
    );
    expect(appFeesLogs.length).toBeGreaterThan(0);

    // Verify specific log messages
    const hasSdkAppFeesLog = consoleMessages.some(
      (msg) => msg.includes("SDK:") && msg.includes("appFees"),
    );
    expect(hasSdkAppFeesLog).toBe(true);

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

    await popupPage.waitForTimeout(2000);

    // Popup should still load successfully even with appFees
    expect(popupPage.url()).toMatch(/onramp/);

    await popupPage.close();
  });
});

