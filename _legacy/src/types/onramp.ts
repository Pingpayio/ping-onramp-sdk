// src/types/onramp.ts

/**
 * Defines the possible stages of the onramp and intent process.
 */
export type IntentProgress =
  | "none" // Initial state before any action
  | "form" // User is filling out the onramp form
  | "generating_url" // Generating Coinbase Onramp URL
  | "redirecting_coinbase" // About to redirect or has redirected to Coinbase
  | "depositing" // Waiting for deposit from Coinbase to NEAR Intents deposit address
  | "querying" // Querying quotes for swaps (main and/or storage)
  | "signing" // Waiting for user to sign the intent message
  | "withdrawing" // Intent published, waiting for settlement
  | "done" // Process completed successfully
  | "error"; // An error occurred at some stage

/**
 * Defines the structure for token information needed by the SDK and logic.
 * This aligns with the guide's definition. The existing BaseTokenInfo from
 * near-intents-sdk is very similar and often used.
 */
export interface TokenInfo {
  defuseAssetId: string; // Unique identifier for the token on a specific chain, e.g., "USDC.BASE_MAINNET"
  symbol: string; // Common symbol, e.g., "USDC"
  name?: string; // Full name, e.g., "USD Coin"
  decimals: number; // Token decimals, e.g., 6 for USDC
  chainName: string; // Identifier for the chain, e.g., "base", "near"
  logoUrl?: string; // Optional URL for the token's logo
  // address?: string;    // Contract address, often part of near-intents-sdk's BaseTokenInfo
}

/**
 * Defines the structure for parameters expected in the redirect URL from Coinbase.
 */
export interface CallbackParams {
  type?: string; // Expected: "intents"
  action?: string; // Expected: "withdraw"
  network?: string; // Expected: "near" (target network for final asset)
  asset?: string; // Expected: "USDC" (asset to be delivered on target network)
  amount?: string; // The fiat amount from the initial onramp
  recipient?: string; // The final NEAR recipient address
  // Potentially other parameters Coinbase might send
}

// Example Token List structure (for reference, actual list is in src/utils/tokens.ts)
// import { NEP141_STORAGE_TOKEN_ID } from 'near-intents-sdk';
// export const GUIDE_LIST_TOKENS_EXAMPLE: TokenInfo[] = [
//   {
//     defuseAssetId: "USDC.BASE_MAINNET", // Placeholder, actual is like "nep141:base-0x..."
//     symbol: "USDC",
//     name: "USD Coin on Base",
//     decimals: 6,
//     chainName: "base",
//     logoUrl: "...",
//   },
//   {
//     defuseAssetId: "USDC.NEAR_MAINNET", // Placeholder, actual is like "nep141:172..."
//     symbol: "USDC",
//     name: "USD Coin on NEAR",
//     decimals: 6,
//     chainName: "near",
//     logoUrl: "...",
//   },
//   {
//     defuseAssetId: "NEAR.NEAR_MAINNET", // Placeholder, should align with NEP141_STORAGE_TOKEN_ID
//     // defuseAssetId: NEP141_STORAGE_TOKEN_ID, // More accurately
//     symbol: "NEAR",
//     name: "NEAR Protocol",
//     decimals: 24,
//     chainName: "near",
//     logoUrl: "...",
//   },
// ];
