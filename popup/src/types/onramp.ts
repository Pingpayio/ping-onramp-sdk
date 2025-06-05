export interface CallbackParams {
  type?: string;
  action?: string;
  network?: string;
  asset?: string;
  amount?: string;
  recipient?: string;
}

export type IntentProgress =
  | "form"
  | "generating_url"
  | "redirecting_coinbase" // Or other onramp provider
  | "depositing"
  | "querying"
  | "signing"
  | "withdrawing"
  | "done"
  | "error"
  | "none"; // Initial or idle state

export interface NearIntentsDisplayInfo {
  message?: string;
  amountIn?: number; // e.g., fiat amount or initial crypto amount
  amountOut?: number; // e.g., final crypto amount received by user
  explorerUrl?: string;
}

// Re-exporting from @defuse-protocol/defuse-sdk for convenience if needed elsewhere,
// or they can be imported directly from the SDK.
// For now, let's assume direct import from SDK where needed to keep this file focused.
// import type { BaseTokenInfo, UnifiedTokenInfo } from "@defuse-protocol/defuse-sdk";
// export type { BaseTokenInfo, UnifiedTokenInfo };
