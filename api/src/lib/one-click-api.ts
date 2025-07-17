// Types based on the 1Click API documentation

export interface OneClickFee {
  recipient: string;
  fee: number;
}

export interface OneClickToken {
  assetId: string;
  decimals: number;
  blockchain: string;
  symbol: string;
  price?: string;
  priceUpdatedAt?: string;
  contractAddress?: string;
}

export interface QuoteRequestParams {
  dry?: boolean;
  swapType: "EXACT_INPUT" | "EXACT_OUTPUT";
  slippageTolerance: number; // basis points, e.g., 100 for 1%
  originAsset: string; // assetId
  depositType: "ORIGIN_CHAIN" | "INTENTS";
  destinationAsset: string; // assetId
  amount: string; // smallest unit
  refundTo: string; // address
  refundType: "ORIGIN_CHAIN" | "INTENTS";
  recipient: string; // address
  recipientType: "DESTINATION_CHAIN" | "INTENTS";
  deadline: string; // ISO date-time
  referral?: string;
  quoteWaitingTimeMs?: number;
  appFees?: OneClickFee[];
}

export interface QuoteResponseData {
  timestamp: string;
  signature: string;
  quoteRequest: QuoteRequestParams; // The request that generated this quote
  quote: {
    depositAddress: string;
    amountIn: string;
    amountInFormatted: string;
    amountInUsd?: string;
    minAmountIn?: string;
    amountOut: string;
    amountOutFormatted: string;
    amountOutUsd?: string;
    minAmountOut?: string;
    deadline: string; // ISO date-time for quote validity
    timeWhenInactive: string; // ISO date-time
    timeEstimate: number; // seconds
  };
}

export interface SubmitDepositParams {
  txHash: string;
  depositAddress: string;
}

export interface OriginChainTxHash {
  hash: string;
  explorerUrl: string;
}

export interface SwapDetails {
  intentHashes?: string[];
  nearTxHashes?: string[];
  amountIn?: string;
  amountInFormatted?: string;
  amountInUsd?: string;
  amountOut?: string;
  amountOutFormatted?: string;
  amountOutUsd?: string;
  slippage?: number;
  originChainTxHashes?: OriginChainTxHash[];
  destinationChainTxHashes?: OriginChainTxHash[];
  refundedAmount?: string;
  refundedAmountFormatted?: string;
  refundedAmountUsd?: string;
}

export interface StatusResponseData {
  quoteResponse: QuoteResponseData; // The original quote this status pertains to
  status:
    | "PENDING_DEPOSIT" // Waiting for user to deposit funds
    | "KNOWN_DEPOSIT_TX" // Deposit tx hash submitted or detected
    | "PROCESSING" // Swap is in progress
    | "SUCCESS" // Swap completed successfully
    | "REFUNDED" // Swap failed, funds refunded
    | "FAILED" // Swap failed, funds may be stuck or require manual intervention
    | "EXPIRED"; // Quote expired before deposit
  updatedAt: string; // ISO date-time
  swapDetails?: SwapDetails;
}

import { OneClickClient } from "./one-click-client";
// Function to fetch supported tokens from 1Click API
export async function fetch1ClickSupportedTokens(
  client: OneClickClient,
): Promise<OneClickToken[]> {
  return client.get<OneClickToken[]>("/tokens");
}

// Helper to find a specific token from the list
export function find1ClickAsset(
  tokens: OneClickToken[],
  symbol: string,
  blockchain: string,
): OneClickToken | undefined {
  return tokens.find(
    (token) =>
      token.symbol.toLowerCase() === symbol.toLowerCase() &&
      token.blockchain.toLowerCase() === blockchain.toLowerCase(),
  );
}

// Function to request a swap quote
export async function requestSwapQuote(
  client: OneClickClient,
  params: QuoteRequestParams,
): Promise<QuoteResponseData> {
  return client.post<QuoteResponseData>("/quote", params);
}

// Function to submit deposit transaction hash
export async function submitDepositTransaction(
  client: OneClickClient,
  params: SubmitDepositParams,
): Promise<StatusResponseData> {
  return client.post<StatusResponseData>("/deposit/submit", params);
}

// Function to get swap execution status
export async function getSwapStatus(
  client: OneClickClient,
  depositAddress: string,
): Promise<StatusResponseData> {
  return client.get<StatusResponseData>(
    `/status?depositAddress=${encodeURIComponent(depositAddress)}`,
  );
}
