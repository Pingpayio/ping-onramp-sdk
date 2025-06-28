import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
  OnrampResult,
  TargetAsset,
} from "../../../src/internal/communication/messages";
import type { OneClickToken, StatusResponseData } from "../lib/one-click-api";
import type { NearIntentsDisplayInfo } from "../types/onramp";

// Atom for global error state
export const onrampErrorAtom = atom<string | null>(null);

// Atoms for data collected during the flow
export const onrampTargetAtom = atomWithStorage<TargetAsset | null>(
  "onrampTarget", // sessionStorage key
  null,
);
export const walletStateAtom = atomWithStorage<{
  address: string;
  chainId?: string;
  walletName?: string;
} | null>(
  "walletState", // sessionStorage key
  null,
); // Connected wallet info

// Atom for the final result to send back to the SDK
export const onrampResultAtom = atom<OnrampResult | null>(null); // Transient

// Atom for UI display information related to the NEAR intent process
export const nearIntentsDisplayInfoAtom = atom<NearIntentsDisplayInfo>({}); // Transient UI state

// Atoms for 1Click API flow
export const oneClickSupportedTokensAtom = atomWithStorage<
  OneClickToken[] | null
>("oneClickSupportedTokens", null);

// oneClickStatusAtom is dynamic and fetched after redirect, so no need to persist the status itself.
export const oneClickStatusAtom = atom<StatusResponseData | null>(null);
