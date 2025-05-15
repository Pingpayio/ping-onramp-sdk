
import { useState, useEffect } from 'react';

export type TransactionStage = 'deposit' | 'querying' | 'signing' | 'sending' | 'payment' | 'swap' | 'completed' | 'failed';

interface UseTransactionProgressProps {
  initialStage?: TransactionStage;
  simulateProgress?: boolean;
}

export const useTransactionProgress = ({
  initialStage = 'deposit',
  simulateProgress = true
}: UseTransactionProgressProps = {}) => {
  const [currentStage, setCurrentStage] = useState<TransactionStage>(initialStage);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate transaction progress for demo purposes
  useEffect(() => {
    if (!simulateProgress) return;
    
    let timeoutId: NodeJS.Timeout;
    
    if (currentStage === 'deposit') {
      // Start with 0% and animate to 20%
      setProgress(0);
      let currentProgress = 0;
      
      const incrementProgress = () => {
        if (currentProgress < 20) {
          currentProgress += 2;
          setProgress(currentProgress);
          timeoutId = setTimeout(incrementProgress, 300);
        } else {
          setCurrentStage('querying');
        }
      };
      
      timeoutId = setTimeout(incrementProgress, 500);
    } else if (currentStage === 'querying') {
      // Start at 20% and animate to 40%
      let currentProgress = 20;
      
      const incrementProgress = () => {
        if (currentProgress < 40) {
          currentProgress += 2;
          setProgress(currentProgress);
          timeoutId = setTimeout(incrementProgress, 300);
        } else {
          setCurrentStage('signing');
        }
      };
      
      timeoutId = setTimeout(incrementProgress, 500);
    } else if (currentStage === 'signing') {
      // Start at 40% and animate to 60%
      let currentProgress = 40;
      
      const incrementProgress = () => {
        if (currentProgress < 60) {
          currentProgress += 2;
          setProgress(currentProgress);
          timeoutId = setTimeout(incrementProgress, 300);
        } else {
          setCurrentStage('sending');
        }
      };
      
      timeoutId = setTimeout(incrementProgress, 500);
    } else if (currentStage === 'sending') {
      // Start at 60% and animate to 95%
      let currentProgress = 60;
      
      const incrementProgress = () => {
        if (currentProgress < 95) {
          currentProgress += 3;
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
      case 'deposit':
        setProgress(10);
        break;
      case 'querying':
        setProgress(30);
        break;
      case 'signing':
        setProgress(50);
        break;
      case 'sending':
        setProgress(75);
        break;
      case 'payment':
        setProgress(20);
        break;
      case 'swap':
        setProgress(60);
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
