import { atom } from "jotai";
import type { OnrampResult, TargetAsset } from "../../../src/internal/communication/messages";
import type { QuoteResponseData, OneClickToken } from "../lib/one-click-api";
import type { UserLocation, CoinbaseOptimalOption } from '../utils/onrampConfigUtils';
import type { OnrampConfigResponseData } from '@coinbase/onchainkit/fund';

// Local type definitions as fallbacks if not exported from one-click-api
// Based on usage in App.tsx and FormEntryView.tsx
export interface WalletState {
  address?: string | null;
  chainId?: string | null;
  walletName?: string | null;
}

export interface SwapQuote { // Part of SwapStatusResponse and QuoteResponseData
    amountInFormatted: string;
    amountOutFormatted: string;
    // Add other relevant fields from the actual quote structure
}

export interface SwapDetails { // Part of SwapStatusResponse
    destinationChainTxHashes?: { hash: string; explorerUrl: string }[];
    // Add other relevant fields
}

export interface SwapStatusResponse { // Fallback definition
    status: string;
    quoteResponse: { quote: SwapQuote }; // Assuming QuoteResponseData has a quote object
    swapDetails?: SwapDetails;
    // Add other fields based on actual structure from getSwapStatus
}


// Existing atoms
export const onrampFlowStepAtom = atom<string>("loading"); // e.g., loading, connect-wallet, form-entry, etc.
export const onrampFlowErrorAtom = atom<{ message: string; step?: string } | null>(null);
export const walletStateAtom = atom<WalletState | null>(null); // Uses local WalletState
export const onrampResultAtom = atom<OnrampResult | null>(null);
export const onrampTargetAtom = atom<TargetAsset | null>(null);

// Atoms for 1Click specific data
export const oneClickSupportedTokensAtom = atom<OneClickToken[] | null>(null);
export const oneClickFullQuoteResponseAtom = atom<QuoteResponseData | null>(null); // Changed to QuoteResponseData
export const oneClickStatusAtom = atom<SwapStatusResponse | null>(null); // Uses local SwapStatusResponse

// Atoms for UI display related to NEAR Intents (can be repurposed)
export const nearIntentsDisplayInfoAtom = atom<{
  message?: string;
  amountIn?: number;
  amountOut?: number;
  explorerUrl?: string;
} | null>(null);


// New atoms for Coinbase dynamic configuration
export const userLocationAtom = atom<UserLocation | null>(null);
export const coinbaseOnrampConfigAtom = atom<OnrampConfigResponseData | null>(null);
export const optimalCoinbaseOptionAtom = atom<CoinbaseOptimalOption | null>(null);
export const coinbaseConfigLoadingAtom = atom<boolean>(false);
