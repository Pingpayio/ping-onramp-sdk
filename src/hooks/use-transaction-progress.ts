
import { useState, useEffect } from 'react';

export type TransactionStage =
  | 'confirming_evm_deposit'
  | 'quoting_bridge_swap'
  | 'awaiting_intent_signature'
  | 'publishing_intent'
  | 'awaiting_intent_settlement'
  | 'intent_completed'
  | 'intent_failed';

interface UseTransactionProgressProps {
  initialStage?: TransactionStage;
}

export const useTransactionProgress = ({
  initialStage = 'confirming_evm_deposit',
}: UseTransactionProgressProps = {}) => {
  const [currentStage, setCurrentStage] = useState<TransactionStage>(initialStage);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const setStage = (stage: TransactionStage) => {
    setCurrentStage(stage);
    setError(null);

    switch (stage) {
      case 'confirming_evm_deposit':
        setProgress(10); // Waiting for funds from onramp provider
        break;
      case 'quoting_bridge_swap':
        setProgress(30); // Querying for bridge/swap rates
        break;
      case 'awaiting_intent_signature':
        setProgress(50); // Waiting for user to sign the intent
        break;
      case 'publishing_intent':
        setProgress(70); // Publishing the signed intent
        break;
      case 'awaiting_intent_settlement':
        setProgress(90); // Waiting for the intent to settle on NEAR
        break;
      case 'intent_completed':
        setProgress(100);
        break;
      case 'intent_failed':
        break;
    }
  };
  
  return {
    currentStage,
    progress,
    error,
    setStage,
    setError
  };
};
