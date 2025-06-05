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
  sessionId?: string;
}
/**
 * Generates a Coinbase Onramp URL with the provided parameters
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

  if (!CDP_PROJECT_ID || CDP_PROJECT_ID === "YOUR_COINBASE_APP_ID_HERE") {
    throw new Error("Coinbase App ID is not set or is a placeholder.");
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid or zero amount provided for onramp.");
  }

  const baseUrl = "https://pay.coinbase.com/buy/select-asset";
  const queryParams = new URLSearchParams();

  // Required parameters
  queryParams.append("appId", CDP_PROJECT_ID);

  const addressesObj: Record<string, string[]> = {};
  addressesObj[address] = [network];
  queryParams.append("addresses", JSON.stringify(addressesObj));

  if (asset) {
    queryParams.append("assets", JSON.stringify([asset]));
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

  queryParams.append("partnerUserId", partnerUserId.substring(0, 49));

  if (redirectUrl) {
    queryParams.append("redirectUrl", redirectUrl);
  }

  if (sessionId) {
    queryParams.append("sessionToken", sessionId);
  }

  if (enableGuestCheckout !== undefined) {
    queryParams.append("enableGuestCheckout", enableGuestCheckout.toString());
  }

  return `${baseUrl}?${queryParams.toString()}`;
}
