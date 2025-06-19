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
  | "redirecting"
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
