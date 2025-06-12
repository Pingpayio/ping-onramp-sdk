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

const ONE_CLICK_API_BASE_URL = "https://1click.chaindefuser.com/v0";

// Function to fetch supported tokens from 1Click API
export async function fetch1ClickSupportedTokens(): Promise<OneClickToken[]> {
  const response = await fetch(`${ONE_CLICK_API_BASE_URL}/tokens`);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch 1Click supported tokens: ${response.status} ${errorBody}`,
    );
  }
  return response.json();
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
  params: QuoteRequestParams,
): Promise<QuoteResponseData> {
  const response = await fetch(`${ONE_CLICK_API_BASE_URL}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => response.text());
    console.error("1Click API Error (requestSwapQuote):", errorBody);
    throw new Error(
      `Failed to request swap quote: ${response.status} ${
        errorBody?.message || JSON.stringify(errorBody)
      }`,
    );
  }
  return response.json();
}

// Function to submit deposit transaction hash
export async function submitDepositTransaction(
  params: SubmitDepositParams,
): Promise<StatusResponseData> {
  const response = await fetch(
    `${ONE_CLICK_API_BASE_URL}/deposit/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    },
  );
  if (!response.ok) {
    const errorBody = await response.json().catch(() => response.text());
    console.error(
      "1Click API Error (submitDepositTransaction):",
      errorBody,
    );
    throw new Error(
      `Failed to submit deposit transaction: ${response.status} ${
        errorBody?.message || JSON.stringify(errorBody)
      }`,
    );
  }
  return response.json();
}

// Function to get swap execution status
export async function getSwapStatus(
  depositAddress: string,
): Promise<StatusResponseData> {
  const response = await fetch(
    `${ONE_CLICK_API_BASE_URL}/status?depositAddress=${encodeURIComponent(
      depositAddress,
    )}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (!response.ok) {
    if (response.status === 404) {
      console.warn(
        `1Click API: Deposit address ${depositAddress} not found (404).`,
      );
    }
    const errorBody = await response.json().catch(() => response.text());
    console.error("1Click API Error (getSwapStatus):", errorBody);
    throw new Error(
      `Failed to get swap status: ${response.status} ${
        errorBody?.message || JSON.stringify(errorBody)
      }`,
    );
  }
  return response.json();
}
