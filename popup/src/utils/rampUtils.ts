import { CDP_PROJECT_ID } from "../config";

/**
 * Utility functions for Coinbase Onramp URL generation
 */
export interface OnrampURLParams {
  asset: string; // e.g., "USDC"
  amount: string; // Fiat amount, e.g., "10"
  network: string; // EVM network for deposit, e.g., "base"
  address: string; // EVM deposit address (e.g., NEAR Intents deposit address on Base)
  partnerUserId: string; // User's EVM wallet address
  redirectUrl: string; // Callback URL to this application
  paymentCurrency?: string;
  paymentMethod?: string;
  enableGuestCheckout?: boolean;
  sessionId?: string; // Added from reference
}
/**
 * Generates a Coinbase Onramp URL with the provided parameters,
 * aligning with the reference implementation.
 */
export function generateOnrampURL(params: OnrampURLParams): string {
  const {
    asset,
    amount,
    network,
    address,
    partnerUserId,
    redirectUrl,
    paymentCurrency,
    paymentMethod,  
    enableGuestCheckout,
    sessionId,
  } = params;

  const cdpAppIdToUse = CDP_PROJECT_ID;

  if (!cdpAppIdToUse || cdpAppIdToUse === "YOUR_COINBASE_APP_ID_HERE") {
    console.error("Coinbase App ID is not set or is a placeholder.");
    return "error:missing_app_id";
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    // throw new Error("Invalid or zero amount provided for onramp.");
    // Instead of throwing, return an error string or handle as per popup's error strategy
    console.error("Invalid or zero amount provided for onramp.");
    return "error:invalid_amount";
  }

  const baseUrl = "https://pay.coinbase.com/buy/select-asset";
  const queryParams = new URLSearchParams();

  // Required parameters
  queryParams.append("appId", cdpAppIdToUse);

  const addressesObj: Record<string, string[]> = {};
  addressesObj[address] = [network]; // Assumes network is a single string like "base"
  queryParams.append("destinationWallets", JSON.stringify([{ address: address, blockchains: [network.toUpperCase()] }]));


  if (asset) { 
    // queryParams.append("assets", JSON.stringify([asset])); // Old way
    queryParams.append("defaultAsset", asset.toUpperCase());
  }

  if (network) { 
    queryParams.append("defaultNetwork", network.toUpperCase());
  }

  if (paymentMethod) { 
    const formattedPaymentMethod = paymentMethod.toUpperCase();
    queryParams.append("defaultPaymentMethod", formattedPaymentMethod);
  }

  if (numericAmount > 0) { 
    queryParams.append("presetFiatAmount", numericAmount.toString());
  }

  if (paymentCurrency) {
    queryParams.append("fiatCurrency", paymentCurrency.toUpperCase());
  }

  // Ensure partnerUserId is not overly long, Coinbase has a limit (e.g., 49 chars)
  queryParams.append("partnerUserId", partnerUserId.substring(0, 49));

  if (redirectUrl) {
    queryParams.append("redirectUrl", redirectUrl);
  }
  
  // The following are often part of the "experience" settings in Coinbase Pay SDK
  // queryParams.append("experienceLoggedIn", "popup"); // Example: "popup" or "new_tab"
  // queryParams.append("experienceLoggedOut", "popup");


  if (sessionId) {
    queryParams.append("sessionToken", sessionId); // Check if this is the correct param name, might be client_id or similar
  }

  if (enableGuestCheckout !== undefined) {
    queryParams.append("enableGuestCheckout", enableGuestCheckout.toString());
  }

  return `${baseUrl}?${queryParams.toString()}`;
}
