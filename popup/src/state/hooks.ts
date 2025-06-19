import { useAtom, useSetAtom } from "jotai";
import type { IntentProgress, NearIntentsDisplayInfo } from "../types/onramp";
import {
  formDataAtom,
  nearIntentsDisplayInfoAtom,
  onrampErrorAtom,
  onrampResultAtom,
  onrampTargetAtom,
  processingSubStepAtom,
  signedTransactionAtom,
  walletStateAtom,
  // 1Click atoms
  oneClickSupportedTokensAtom,
  oneClickFullQuoteResponseAtom,
  oneClickStatusAtom,
} from "./atoms";

/**
 * Hook for managing global error state
 * @returns Object with error state and setFlowError function
 */
export const useOnrampFlow = () => {
  const [error, setError] = useAtom(onrampErrorAtom);

  const setFlowError = (errorMessage: string) => {
    setError(errorMessage);
    console.error("Global error set:", errorMessage);
  };

  return { error, setFlowError };
};

export const useOnrampTarget = () => useAtom(onrampTargetAtom);
export const useSetOnrampTarget = () => useSetAtom(onrampTargetAtom);
export const useFormData = () => useAtom(formDataAtom);
export const useWalletState = () => useAtom(walletStateAtom);
export const useSetWalletState = () => useSetAtom(walletStateAtom);
export const useSignedTransaction = () => useAtom(signedTransactionAtom);
export const useOnrampResult = () => useAtom(onrampResultAtom);
export const useSetOnrampResult = () => useSetAtom(onrampResultAtom);

export const useProcessingSubStep = (): [
  IntentProgress,
  (update: IntentProgress | ((prev: IntentProgress) => IntentProgress)) => void,
] => useAtom(processingSubStepAtom);

export const useSetProcessingSubStep = (): ((
  update: IntentProgress | ((prev: IntentProgress) => IntentProgress),
) => void) => useSetAtom(processingSubStepAtom);

export const useNearIntentsDisplayInfo = (): [
  NearIntentsDisplayInfo,
  (
    update:
      | NearIntentsDisplayInfo
      | ((prev: NearIntentsDisplayInfo) => NearIntentsDisplayInfo),
  ) => void,
] => useAtom(nearIntentsDisplayInfoAtom);

export const useSetNearIntentsDisplayInfo = (): ((
  update:
    | NearIntentsDisplayInfo
    | ((prev: NearIntentsDisplayInfo) => NearIntentsDisplayInfo),
) => void) => useSetAtom(nearIntentsDisplayInfoAtom);

// Hooks for 1Click API state
export const useOneClickSupportedTokens = () =>
  useAtom(oneClickSupportedTokensAtom);
export const useSetOneClickSupportedTokens = () =>
  useSetAtom(oneClickSupportedTokensAtom);

export const useOneClickFullQuoteResponse = () =>
  useAtom(oneClickFullQuoteResponseAtom);
export const useSetOneClickFullQuoteResponse = () =>
  useSetAtom(oneClickFullQuoteResponseAtom);

export const useOneClickStatus = () => useAtom(oneClickStatusAtom);
export const useSetOneClickStatus = () => useSetAtom(oneClickStatusAtom);
