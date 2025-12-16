import type { OnrampResult, TargetAsset } from "@pingpay/onramp-types";
import { atom } from "jotai";
import type { OneClickFee, StatusResponseData } from "../lib/one-click-api";

export interface NearIntentsDisplayInfo {
  logoUrl?: string;
  contractName?: string;
  message?: string;
  amountIn?: number; // e.g., fiat amount or initial crypto amount
  amountOut?: number; // e.g., final crypto amount received by user
  explorerUrl?: string;
}

// Atom for global error state
export const onrampErrorAtom = atom<string | null>(null);

// Atoms for data collected during the flow
export const onrampTargetAtom = atom<TargetAsset | null>(null);
export const appFeesAtom = atom<OneClickFee[] | null>(null);

// Atom for the final result to send back to the SDK
export const onrampResultAtom = atom<OnrampResult | null>(null);

// Atom for UI display information related to the NEAR intent process
export const nearIntentsDisplayInfoAtom = atom<NearIntentsDisplayInfo>({});

// oneClickStatusAtom is dynamic and fetched after redirect, so no need to persist the status itself.
export const oneClickStatusAtom = atom<StatusResponseData | null>(null);
