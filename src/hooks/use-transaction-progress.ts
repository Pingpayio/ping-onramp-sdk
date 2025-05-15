
import { useState, useEffect } from 'react';

export type TransactionStage = 'payment' | 'swap' | 'completed' | 'failed';

interface UseTransactionProgressProps {
  initialStage?: TransactionStage;
  simulateProgress?: boolean;
}

export const useTransactionProgress = ({
  initialStage = 'payment',
  simulateProgress = true
}: UseTransactionProgressProps = {}) => {
  const [currentStage, setCurrentStage] = useState<TransactionStage>(initialStage);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate transaction progress for demo purposes
  useEffect(() => {
    if (!simulateProgress) return;
    
    let timeoutId: NodeJS.Timeout;
    
    if (currentStage === 'payment') {
      // Simulate payment processing (3 seconds)
      setProgress(25);
      timeoutId = setTimeout(() => {
        setCurrentStage('swap');
        setProgress(50);
      }, 3000);
    } else if (currentStage === 'swap') {
      // Simulate swap progress (4 seconds)
      timeoutId = setTimeout(() => {
        setCurrentStage('completed');
        setProgress(100);
      }, 4000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentStage, simulateProgress]);
  
  const setStage = (stage: TransactionStage) => {
    setCurrentStage(stage);
    
    // Update progress based on stage
    switch (stage) {
      case 'payment':
        setProgress(25);
        break;
      case 'swap':
        setProgress(50);
        break;
      case 'completed':
        setProgress(100);
        break;
      case 'failed':
        setError('Transaction failed');
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
