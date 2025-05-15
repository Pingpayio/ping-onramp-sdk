
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, Home } from 'lucide-react';
import TransactionProgressBar from './transaction/TransactionProgressBar';
import TransactionStageCard from './transaction/TransactionStageCard';
import SwapVisualizer from './transaction/SwapVisualizer';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import TransactionCompletionMessage from './transaction/TransactionCompletionMessage';

interface TransactionProgressProps {
  asset: string | null;
  amount: string;
  walletAddress: string;
  isSimulated?: boolean;
}

const TransactionProgress = ({
  asset,
  amount,
  walletAddress,
  isSimulated = true
}: TransactionProgressProps) => {
  const navigate = useNavigate();
  const {
    currentStage,
    progress,
    error
  } = useTransactionProgress({ simulateProgress: isSimulated });

  // Generate mock transaction hashes
  const depositTxHash = generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = generateTxHash('0x9c');

  const isCompleted = currentStage === 'completed';

  return (
    <div className="w-full flex flex-col h-full">
      <div className="space-y-3 flex-1 overflow-auto">
        {/* Progress bar */}
        <TransactionProgressBar progress={progress} />
        
        {/* Current stage card */}
        <TransactionStageCard 
          currentStage={currentStage}
          onboardingTxHash={depositTxHash}
          swapTxHash={swapTxHash}
          finalTxHash={finalTxHash}
          asset={asset}
          amount={amount}
          walletAddress={walletAddress}
        />
        
        {/* NEAR Intents swap visual (shown during appropriate stages) */}
        <SwapVisualizer asset={asset} stage={currentStage} />

        {/* Completion message (shown when completed) */}
        {isCompleted && (
          <TransactionCompletionMessage 
            amount={amount} 
            asset={asset} 
          />
        )}

        {/* Transaction details - only shown when completed */}
        {isCompleted && (
          <TransactionDetailsCard 
            amount={amount} 
            asset={asset} 
            walletAddress={walletAddress} 
          />
        )}
      </div>
      
      {/* The action buttons have been removed from here */}
    </div>
  );
};

export default TransactionProgress;
