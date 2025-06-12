import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
  OnrampFlowStep,
  OnrampResult,
  TargetAsset,
} from "../../../src/internal/communication/messages";
import type { FormValues } from "../components/steps/form-entry-view";
import type {
  OneClickToken,
  QuoteResponseData,
  StatusResponseData,
} from "../lib/one-click-api";
import type { IntentProgress, NearIntentsDisplayInfo } from "../types/onramp";

// Atoms for managing the overall onramp flow state
export const onrampStepAtom = atom<OnrampFlowStep>("loading");
export const onrampErrorAtom = atom<string | null>(null);

// Atoms for data collected during the flow
export const onrampTargetAtom = atomWithStorage<TargetAsset | null>(
  "onrampTarget", // sessionStorage key
  null,
);
export const formDataAtom = atom<FormValues | null>(null);

export const walletStateAtom = atomWithStorage<{
  address: string;
  chainId?: string;
  walletName?: string;
} | null>(
  "walletState", // sessionStorage key
  null,
); // Connected wallet info

export const signedTransactionAtom = atom<{
  signature: string;
  publicKey: string;
  transactionHash?: string;
  walletName?: string;
} | null>(null);

// Atom for the final result to send back to the SDK
export const onrampResultAtom = atom<OnrampResult | null>(null); // Transient

// Atom for detailed sub-steps during the withdrawal process
export const processingSubStepAtom = atom<IntentProgress>("none"); // Transient UI state

// Atom for UI display information related to the NEAR intent process
export const nearIntentsDisplayInfoAtom = atom<NearIntentsDisplayInfo>({}); // Transient UI state

// Atoms for 1Click API flow
export const oneClickSupportedTokensAtom = atomWithStorage<
  OneClickToken[] | null
>("oneClickSupportedTokens", null);

export const oneClickFullQuoteResponseAtom =
  atomWithStorage<QuoteResponseData | null>("oneClickFullQuote", null);

// oneClickStatusAtom is dynamic and fetched after redirect, so no need to persist the status itself.
export const oneClickStatusAtom = atom<StatusResponseData | null>(null);
