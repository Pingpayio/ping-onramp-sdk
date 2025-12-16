// test the onramp processing view: transaction progress and failure states

import test, { expect } from "@playwright/test";

test.describe("Onramp Processing View", () => {
  const popupUrl = "https://pingpay.local.gd:5173/onramp/processing";

  // Helper function to wait for popup server and navigate
  async function navigateToProcessingPage(page: any) {
    await expect(async () => {
      try {
        await page.goto(popupUrl, { timeout: 5000, waitUntil: "domcontentloaded" });
        const url = page.url();
        expect(url).toMatch(/onramp\/processing/);
      } catch (error) {
        throw new Error(
          `Popup server not ready: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }).toPass({
      timeout: 30000,
      intervals: [1000],
    });

    await page.waitForLoadState("networkidle");
  }

  test("should handle direct navigation to processing page", async ({
    page,
  }) => {
    // Directly navigate to the processing page without going through the normal flow
    // This tests the unhappy path where the page is accessed without proper state
    await navigateToProcessingPage(page);

    // Verify the page shows the processing view
    // The processing view should render even without proper state, showing a default/loading state
    const processingTitle = page.locator('h3:has-text("Processing Onramp")');
    await expect(processingTitle).toBeVisible({ timeout: 5000 });

    // Verify it shows the transaction progress section
    const progressSection = page.locator('text="Transaction Progress"');
    await expect(progressSection).toBeVisible();

    // Verify it shows a processing/loading state (since no state atoms are populated)
    // The component should show "Processing..." or "Waiting for status updates..." when accessed directly
    const processingText = page.locator(
      'text=/Processing|Waiting for status updates/i',
    );
    await expect(processingText.first()).toBeVisible();

    // Verify the "Do not close this window" message is present
    const warningMessage = page.locator('text=/Do not close this window/i');
    await expect(warningMessage).toBeVisible();

    // Verify the URL is correct
    await expect(page).toHaveURL(/\/onramp\/processing/);
  });

  test("should display failed status when injected (unhappy flow)", async ({
    page,
  }) => {
    
    // Directly navigate to the processing page
    await navigateToProcessingPage(page);
    
    // Wait for the processing view to be visible (ensures component is mounted)
    const processingTitle = page.locator('h3:has-text("Processing Onramp")');
    await expect(processingTitle).toBeVisible({ timeout: 5000 });

    // Inject a failed status into the Jotai store (simulating a failed swap)
    await page.evaluate(() => {
      const testHelpers = (window as any).__PINGPAY_TEST_HELPERS__;
      if (!testHelpers) {
        throw new Error("Test helpers not found on window");
      }

      // Create a mock failed status response
      const mockFailedStatus = {
        quoteResponse: {
          timestamp: new Date().toISOString(),
          signature: "test-signature",
          quoteRequest: {
            swapType: "EXACT_INPUT",
            slippageTolerance: 100,
            originAsset: "nep141:base-0x833589f",
            depositType: "INTENTS",
            destinationAsset: "nep141:wrap.near",
            amount: "1000000",
            refundTo: "test.near",
            refundType: "INTENTS",
            recipient: "test.near",
            recipientType: "INTENTS",
            deadline: new Date(Date.now() + 3600000).toISOString(),
          },
          quote: {
            depositAddress: "test-deposit-address",
            amountIn: "1000000",
            amountInFormatted: "3.0",
            amountOut: "950000",
            amountOutFormatted: "95.00",
            deadline: new Date(Date.now() + 3600000).toISOString(),
            timeWhenInactive: new Date(Date.now() + 3600000).toISOString(),
            timeEstimate: 300,
          },
        },
        status: "FAILED",
        updatedAt: new Date().toISOString(),
      };

      testHelpers.setOneClickStatus(mockFailedStatus);
    });

    // Wait for React to re-render and the failed state to appear
    // Use expect.poll to wait for the failed state UI elements
    await expect(async () => {
      const failedTitle = page.locator('text="Transaction Failed"');
      const isVisible = await failedTitle.isVisible().catch(() => false);
      if (!isVisible) {
        throw new Error("Failed title not yet visible");
      }
    }).toPass({
      timeout: 10000,
      intervals: [200],
    });

    // Verify we're still on the processing page (not redirected to error)
    await expect(page).toHaveURL(/\/onramp\/processing/);

    // Verify the page shows the failed status with correct title
    const failedTitle = page.locator('text="Transaction Failed"');
    await expect(failedTitle).toBeVisible();

    // Verify it shows the error message per Figma design
    const errorMessage = page.locator(
      'text=/Swap Unsuccessful - Your funds are safe/i',
    );
    await expect(errorMessage).toBeVisible();

    // Verify the progress is at 0% (failed state shows 0% per Figma)
    const progressText = page.locator('text="0%"');
    await expect(progressText).toBeVisible();

    // Verify the Contact Support button is present
    const contactSupportButton = page.locator(
      'button:has-text("Contact Support")',
    );
    await expect(contactSupportButton).toBeVisible();

    // Verify the footer message for failed state
    const footerMessage = page.locator(
      'text=/The swap to your destination asset failed/i',
    );
    await expect(footerMessage).toBeVisible();
  });
});

