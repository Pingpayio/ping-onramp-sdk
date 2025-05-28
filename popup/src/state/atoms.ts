// popup/src/state/atoms.ts

import { atom } from 'jotai';
// The import path for messages needs to be relative to this file's location
// Assuming 'messages.ts' is in 'pingpay-onramp/src/internal/communication/'
// and this file is in 'pingpay-onramp/popup/src/state/'
// The relative path would be '../../src/internal/communication/messages'
// However, the spec uses: import type { OnrampFlowStep, TargetAsset } from '../internal/communication/messages';
// This implies 'messages.ts' is expected to be at 'popup/src/internal/communication/messages.ts'
// BUT the spec also says: // src/internal/communication/messages.ts ... This file is shared and imported by both the SDK and the popup.
// And the popup channel.ts uses: import type { SdkToPopupMessages, PopupToSdkMessages } from "../../../src/internal/communication/messages";
// This path from popup/src/internal/communication/channel.ts to src/internal/communication/messages.ts is correct.
// So, from popup/src/state/atoms.ts, the path to src/internal/communication/messages.ts should be:
// ../../src/internal/communication/messages
// Correcting the import path based on the shared nature of messages.ts
import type { OnrampFlowStep, TargetAsset, OnrampResult } from '../../../src/internal/communication/messages';

// Atoms for managing the overall onramp flow state
export const onrampStepAtom = atom<OnrampFlowStep>('loading');
export const onrampErrorAtom = atom<string | null>(null); // For displaying general errors

// Atoms for data collected during the flow
export const onrampTargetAtom = atom<TargetAsset | null>(null); // The target chain and asset from the SDK
export const initialDataAtom = atom<any | null>(null); // Any initial data from the SDK
export const formDataAtom = atom<any | null>(null); // Data from the form step
export const walletStateAtom = atom<{ address: string; chainId?: string; walletName?: string } | null>(null); // Connected wallet info
export const signedTransactionAtom = atom<{ signature: string; publicKey: string; transactionHash?: string; walletName?: string } | null>(null); // Signed transaction data

// Atoms for managing state within specific steps (optional, can also be local component state)
// export const coinbaseConnectLoadingAtom = atom(false);
// export const nearSigningLoadingAtom = atom(false);

// Atom for the final result to send back to the SDK
// The type OnrampResult was added to messages.ts exports in a previous step.
export const onrampResultAtom = atom<OnrampResult | null>(null);
