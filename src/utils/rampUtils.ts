/**
 * Utility functions for Coinbase Onramp URL generation
 */

interface OnrampURLParams {
  asset: string; // e.g., "USDC"
  amount: string; // Fiat amount, e.g., "10"
  network: string; // EVM network for deposit, e.g., "base"
  address: string; // EVM deposit address (e.g., NEAR Intents deposit address on Base)
  partnerUserId: string; // User's EVM wallet address
  redirectUrl: string; // Callback URL to this application
  paymentCurrency?: string; // e.g., "USD"
  paymentMethod?: string; // e.g., "card"
  enableGuestCheckout?: boolean;
  // sessionId is not explicitly in the guide's example but kept if needed for other flows
  sessionId?: string;
}

// Coinbase Developer Platform Project ID / App ID
const CDP_APP_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID!;
if (!CDP_APP_ID) {
  console.error("NEXT_PUBLIC_CDP_PROJECT_ID is not set in environment variables.");
  // Potentially throw an error or handle this case as appropriate for your app
}

/**
 * Generates a Coinbase Onramp URL with the provided parameters,
 * aligning with the NEAR Intents USDC Onramp Implementation Guide.
 */
export function generateOnrampURL(params: OnrampURLParams): string {
  const {
    asset, // Should be "USDC" for this flow
    amount, // Fiat amount
    network, // Should be "base" for this flow
    address, // This is the NEAR Intents deposit address on Base
    partnerUserId,
    redirectUrl,
    paymentCurrency = 'USD', // Default to USD as per guide example
    paymentMethod = "card", // Default to "card" as per guide example
    enableGuestCheckout,
    sessionId,
  } = params;

  if (!CDP_APP_ID) {
    // Or return a dummy URL / throw error to prevent proceeding
    return "error:missing_app_id";
  }

  // Parse amount to a number for presetFiatAmount
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    // Coinbase might have its own minimums, but basic validation here
    throw new Error("Invalid or zero amount provided for onramp.");
  }

  // Base URL for Coinbase Onramp
  const baseUrl = "https://pay.coinbase.com/buy";

  // Build query parameters
  const queryParams = new URLSearchParams({
    appId: CDP_APP_ID,
    destinationWallets: JSON.stringify([
      {
        address: address, // The generated Base deposit address
        assets: [asset], // e.g., ["USDC"]
        supportedNetworks: [network], // e.g., ["base"]
        network: network, // The network for the deposit address
      },
    ]),
    partnerUserId: partnerUserId.substring(0, 49), // Coinbase has a 49 char limit
    defaultExperience: "buy",
    // presetCryptoAmount: amount, // Guide uses this, but fiatAmount is more direct from user input
    presetFiatAmount: numericAmount.toString(), // Using fiat amount as per user input
    defaultAsset: asset, // e.g., "USDC"
    defaultNetwork: network, // e.g., "base"
    defaultPaymentMethod: paymentMethod,
    redirectUrl: redirectUrl, // Critical for callback
  });

  if (paymentCurrency) {
    queryParams.append("fiatCurrency", paymentCurrency); // Optional, but good to include
  }

  if (enableGuestCheckout !== undefined) {
    queryParams.append("enableGuestCheckout", enableGuestCheckout.toString());
  }

  if (sessionId) {
    queryParams.append("sessionToken", sessionId); // If using session tokens
  }

  return `${baseUrl}?${queryParams.toString()}`;
}
