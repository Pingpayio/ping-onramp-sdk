import { atom } from 'jotai';
import type { OnrampFlowStep, OnrampResult, TargetAsset } from '../../../src/internal/communication/messages';
import type { FormValues } from '../components/steps/form-entry-view';
import type { IntentProgress, NearIntentsDisplayInfo } from "../types/onramp";

// Atoms for managing the overall onramp flow state
export const onrampStepAtom = atom<OnrampFlowStep>('loading');
export const onrampErrorAtom = atom<string | null>(null);

// Atoms for data collected during the flow
export const onrampTargetAtom = atom<TargetAsset | null>(null);
export const formDataAtom = atom<FormValues | null>(null);
export const walletStateAtom = atom<{ address: string; chainId?: string; walletName?: string } | null>(null); // Connected wallet info
export const signedTransactionAtom = atom<{ signature: string; publicKey: string; transactionHash?: string; walletName?: string } | null>(null); // Signed transaction data

// Atom for the final result to send back to the SDK
export const onrampResultAtom = atom<OnrampResult | null>(null);

// Atom for detailed sub-steps during the withdrawal process
export const processingSubStepAtom = atom<IntentProgress>("none");

// Atom for UI display information related to the NEAR intent process
export const nearIntentsDisplayInfoAtom = atom<NearIntentsDisplayInfo>({});
