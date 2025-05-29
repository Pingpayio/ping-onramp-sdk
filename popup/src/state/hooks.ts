import { useAtom } from 'jotai';
import {
  onrampStepAtom,
  onrampErrorAtom,
  onrampTargetAtom,
  initialDataAtom,
  formDataAtom,
  walletStateAtom,
  signedTransactionAtom,
  onrampResultAtom,
} from './atoms';
import type { OnrampFlowStep, OnrampResult } from '../../../src/internal/communication/messages';
import type { WalletConnectionResult, TransactionSignResult } from '../services/types';

// Example hook to manage the onramp step
export function useOnrampFlow() {
  const [step, setStep] = useAtom(onrampStepAtom);
  const [error, setError] = useAtom(onrampErrorAtom);

  const goToStep = (newStep: OnrampFlowStep) => {
    setStep(newStep);
    setError(null); // Clear errors when changing steps
  };

  const setFlowError = (errorMessage: string, currentStep?: OnrampFlowStep) => {
    setError(errorMessage);
    setStep(currentStep || 'error'); // Go to error step or stay on current step with error
  };

  return { step, goToStep, error, setFlowError };
}

// Hook for managing onramp target data
export function useOnrampTarget() {
  return useAtom(onrampTargetAtom);
}
export function useSetOnrampTarget() {
    const [, setTarget] = useAtom(onrampTargetAtom);
    return setTarget;
}


// Hook for managing initial data passed from SDK
export function useInitialData() {
  return useAtom(initialDataAtom);
}
export function useSetInitialData() {
    const [, setInitial] = useAtom(initialDataAtom);
    return setInitial;
}

// Hook for managing form data
export function useFormData() {
  return useAtom(formDataAtom);
}
export function useSetFormData() {
    const [, setForm] = useAtom(formDataAtom);
    return setForm;
}


// Hook for managing connected wallet state
export function useWallet() {
  return useAtom(walletStateAtom);
}
export function useSetWallet() {
    const [, setWallet] = useAtom(walletStateAtom);
    return (walletInfo: WalletConnectionResult | null) => setWallet(walletInfo);
}

// Hook for managing signed transaction data
export function useSignedTransaction() {
  return useAtom(signedTransactionAtom);
}
export function useSetSignedTransaction() {
    const [, setTx] = useAtom(signedTransactionAtom);
    return (txInfo: TransactionSignResult | null) => setTx(txInfo);
}


// Hook for managing the final onramp result
export function useOnrampProcessResult() {
  return useAtom(onrampResultAtom);
}
export function useSetOnrampProcessResult() {
    const [, setResult] = useAtom(onrampResultAtom);
    return (result: OnrampResult | null) => setResult(result);
}

// Add more custom hooks as needed to interact with your Jotai state.
// For example, a hook to get and set the current onramp service being used,
// or hooks for loading states of specific operations.
