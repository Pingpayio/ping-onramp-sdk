import { useAtom, useSetAtom } from "jotai";
import type { OnrampFlowStep } from "../../../src/internal/communication/messages";
import type { IntentProgress, NearIntentsDisplayInfo } from "../types/onramp";
import {
  formDataAtom,
  nearIntentsDisplayInfoAtom,
  onrampErrorAtom,
  onrampResultAtom,
  onrampStepAtom,
  onrampTargetAtom,
  processingSubStepAtom,
  signedTransactionAtom,
  walletStateAtom,
  // 1Click atoms
  oneClickSupportedTokensAtom,
  oneClickFullQuoteResponseAtom,
  oneClickStatusAtom,
} from "./atoms";

export const useOnrampFlow = () => {
  const [step, setStep] = useAtom(onrampStepAtom);
  const [error, setError] = useAtom(onrampErrorAtom);

  const goToStep = (newStep: OnrampFlowStep) => {
    setStep(newStep);
    setError(null);
  };

  const setFlowError = (errorMessage: string, errorStep?: OnrampFlowStep) => {
    setError(errorMessage);
    if (errorStep) {
      setStep(errorStep);
    } else {
      setStep("error");
    }
  };

  return { step, goToStep, error, setFlowError };
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
