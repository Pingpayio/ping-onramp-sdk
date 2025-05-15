
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
      // Start with 0% and animate to 30%
      setProgress(0);
      let currentProgress = 0;
      
      const incrementProgress = () => {
        if (currentProgress < 40) {
          currentProgress += 5;
          setProgress(currentProgress);
          timeoutId = setTimeout(incrementProgress, 300);
        } else {
          setCurrentStage('swap');
        }
      };
      
      timeoutId = setTimeout(incrementProgress, 500);
    } else if (currentStage === 'swap') {
      // Start at 40% and animate to 100%
      let currentProgress = 40;
      
      const incrementProgress = () => {
        if (currentProgress < 95) {
          currentProgress += 5;
          setProgress(currentProgress);
          timeoutId = setTimeout(incrementProgress, 300);
        } else {
          setProgress(100);
          setCurrentStage('completed');
        }
      };
      
      timeoutId = setTimeout(incrementProgress, 500);
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
