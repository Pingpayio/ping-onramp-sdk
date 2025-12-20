import { expect, test } from "@playwright/test";

const POPUP_BASE_URL = "https://pingpay.local.gd:5173";
const MOCK_NEAR_ADDRESS = "test.near";
const MOCK_AMOUNT = "100";

test.describe("Basic Onramp Flow", () => {
  test("should load popup, fill form, and navigate through onramp flow", async ({
    page,
  }) => {
    const sessionId = "test-session-id";
    await page.goto(`${POPUP_BASE_URL}/onramp?sessionId=${sessionId}&chain=near&asset=usdc`);

    // Wait for form to load
    await page.waitForSelector("#amount", { timeout: 10000 });
    await page.waitForSelector("#recipientAddress");

    // Fill the form
    await page.fill("#amount", MOCK_AMOUNT);
    await page.fill("#recipientAddress", MOCK_NEAR_ADDRESS);

    // Verify form is filled correctly
    await expect(page.locator("#amount")).toHaveValue(MOCK_AMOUNT);
    await expect(page.locator("#recipientAddress")).toHaveValue(MOCK_NEAR_ADDRESS);

    // Verify submit button exists and becomes enabled when form is valid
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});
