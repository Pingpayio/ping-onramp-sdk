import { expect, test } from '@playwright/test';
import { mock } from '@wagmi/connectors';
import { createConfig, http } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import type { CallbackParams, IntentProgress, NearIntentsDisplayInfo } from '../popup/src/types/onramp';

// Constants for the test
const POPUP_BASE_URL = "http://localhost:5173";
const MOCK_EVM_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const MOCK_NEAR_ADDRESS = "test.near";
const MOCK_AMOUNT = "100";

test.describe('NEAR Intents Withdrawal Flow', () => {
  // Wagmi test config with mock connector
  const mockConfig = createConfig({
    chains: [mainnet],
    connectors: [
      mock({
        accounts: [MOCK_EVM_ADDRESS],
        features: {
          reconnect: true
        }
      })
    ],
    transports: {
      [mainnet.id]: http()
    }
  });

  test('should handle intent withdrawal callback and navigate to processing step', async ({ page }) => {
    // 1. Setup mock wallet connection and config
    const initScriptArgs = { 
      evmAddress: MOCK_EVM_ADDRESS
    };

    await page.addInitScript((args) => {
      // Set flag to skip post-me handshake for tests
      (window as any).VITE_SKIP_POSTME_HANDSHAKE = true;

      // Mock near-intents functions
      (window as any).generateNearIntentsDepositAddress = async (
        evmAddress: string,
      ) => {
        return {
          address: "0xMockDepositAddress",
          network: "base",
        };
      };

      (window as any).generateDepositAddress = async () =>
        "0xMockDepositAddress";
      (window as any).getSupportedTokens = async () => ({
        tokens: [
          {
            defuse_asset_identifier: "usdc.base",
            decimals: 6,
            asset_name: "USDC",
            near_token_id: "usdc.near",
            min_deposit_amount: "1000000",
            min_withdrawal_amount: "1000000",
            withdrawal_fee: "100000",
          },
        ],
      });
      // Mock the processNearIntentWithdrawal function
      (window as any).processNearIntentWithdrawal = async ({
        callbackParams,
        userEvmAddress,
        signMessageAsync,
        updateProgress,
        updateDisplayInfo,
      }: {
        callbackParams: Required<CallbackParams>;
        userEvmAddress: string;
        signMessageAsync: (args: { message: string }) => Promise<`0x${string}`>;
        updateProgress: (progress: IntentProgress) => void;
        updateDisplayInfo: (info: NearIntentsDisplayInfo) => void;
      }) => {
        // Simulate the withdrawal process steps with display info updates
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress('depositing');
        updateDisplayInfo({ message: 'Waiting for deposit confirmation...' });

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress('querying');
        updateDisplayInfo({ message: 'Querying bridge rates...' });

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress('signing');
        updateDisplayInfo({ message: 'Please sign the transaction...' });

        // Simulate signing
        const signature = await signMessageAsync({ message: 'Mock withdrawal message' });
        console.log('Signed with:', signature);

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress('withdrawing');
        updateDisplayInfo({ message: 'Processing withdrawal...' });

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress('done');
        updateDisplayInfo({
          message: "Transaction complete!",
          amountIn: parseFloat(callbackParams.amount),
          amountOut: parseFloat(callbackParams.amount),
          explorerUrl: "https://nearblocks.io/txns/mock-hash",
        });
      };

      // Mock window.ethereum for wagmi with signature tracking
      (window as any).ethereum = {
        isMetaMask: true,
        signMessageCalls: [],
        request: async ({
          method,
          params,
        }: {
          method: string;
          params?: any[];
        }) => {
          switch (method) {
            case 'eth_requestAccounts':
            case 'eth_accounts':
              return [args.evmAddress];
            case 'eth_chainId':
              return '0x1'; // Mainnet
            case 'personal_sign':
              // Track the sign message call
              (window as any).ethereum.signMessageCalls.push({
                message: params?.[0],
              });
              // Return a mock signature (65 bytes)
              return "0x" + "1".repeat(130);
            default:
              return null;
          }
        },
        on: (event: string, callback: Function) => {
          // Track event listeners if needed
          console.log("Ethereum event registered:", event);
        },
        removeListener: () => { },
        chainId: '0x1',
        networkVersion: '1',
        selectedAddress: args.evmAddress
      };

      // Mock post-me connection with expected method handling
      (window as any).MOCK_POST_ME_CONNECTION = {
        remoteHandle: () => ({
          call: (methodName: string, params: any) => {
            console.log(`Mock Parent.call: ${methodName}`, params);
            switch (methodName) {
              case "reportFormDataSubmitted":
                return Promise.resolve();
              case "reportOnrampInitiated":
                return Promise.resolve();
              case "reportStepChanged":
                return Promise.resolve();
              case "reportProcessComplete":
                return Promise.resolve({ success: true });
              case "reportProcessFailed":
                console.error("Process failed:", params.error);
                return Promise.resolve();
              default:
                console.warn("Unexpected method call:", methodName);
                return Promise.resolve();
            }
          },
        }),
      };
    }, initScriptArgs);

    // 2. Navigate to popup and wait for wallet connection
    await page.goto(POPUP_BASE_URL);

    // Wait for wallet connection to be established
    await page.waitForSelector('text=Connected:', { timeout: 10000 });

    // Wait for form elements to be visible and enabled
    await page.waitForSelector("#amount:not([disabled])");
    await page.waitForSelector("#nearWalletAddress:not([disabled])");

    // 3. Fill the form
    await page.fill("#amount", MOCK_AMOUNT);
    await page.fill("#nearWalletAddress", MOCK_NEAR_ADDRESS);

    // Payment method is already defaulted to 'card'
    // USDC is already selected and disabled

    // 4. Intercept navigation to Coinbase URL and simulate callback instead
    await page.route("**", async (route) => {
      const url = route.request().url();
      if (url.includes("pay.coinbase.com")) {
        // Instead of going to Coinbase, we'll simulate coming back with our callback
        const callbackUrlParams = new URLSearchParams({
          type: "intents",
          action: "withdraw",
          depositAddress: "mockOneClickDepositAddressForTest",
          network: "near",
          asset: "USDC",
          amount: MOCK_AMOUNT,
          recipient: MOCK_NEAR_ADDRESS,
        });

        const callbackUrl = `${POPUP_BASE_URL}/onramp/callback?${callbackUrlParams.toString()}`;

        // Navigate to our simulated callback URL
        await page.goto(callbackUrl);

        // Abort the original navigation to Coinbase
        await route.abort();
      } else {
        await route.continue();
      }
    });

    // 5. Submit the form
    await page.click('button[type="submit"]');

    // 6. Verify navigation to processing step and handle signing
    // Wait for the processing transaction view to be visible
    await expect(
      page.locator('[data-testid="processing-transaction-view"]'),
    ).toBeVisible({ timeout: 15000 });

    // Verify each step in the withdrawal process
    await expect(
      page.locator('[data-testid="processing-substep-depositing"]'),
    ).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Depositing funds")).toBeVisible();

    await expect(
      page.locator('[data-testid="processing-substep-querying"]'),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator("text=Querying transaction status"),
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="processing-substep-signing"]'),
    ).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Waiting for signature")).toBeVisible();

    // Verify that signing was requested and handled
    const signMessageLogs = await page.evaluate(() => {
      return (window as any).ethereum.signMessageCalls || [];
    });
    expect(signMessageLogs.length).toBeGreaterThan(0);
    // Verify the first sign message call contains expected data
    const firstSignMessage = signMessageLogs[0];
    expect(firstSignMessage).toBeDefined();
    expect(typeof firstSignMessage.message).toBe("string");

    await expect(
      page.locator('[data-testid="processing-substep-withdrawing"]'),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator('text=Processing withdrawal')
    ).toBeVisible();
    // Wait for completion
    await expect(
      page.locator('[data-testid="processing-substep-done"]'),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Transaction complete")).toBeVisible();
    await expect(page.locator(`text=${MOCK_AMOUNT} USDC`)).toBeVisible();
    await expect(
      page.locator('a[href*="nearblocks.io/txns/mock-hash"]'),
    ).toBeVisible();
  });
});
