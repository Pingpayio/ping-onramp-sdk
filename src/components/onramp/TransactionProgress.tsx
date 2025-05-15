
import React from 'react';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import TransactionProgressBar from './transaction/TransactionProgressBar';
import TransactionStageCard from './transaction/TransactionStageCard';
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
  const {
    currentStage,
    progress,
    error
  } = useTransactionProgress({ simulateProgress: isSimulated });

  // Generate mock transaction hashes
  const depositTxHash = generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = generateTxHash('0x9c');

  return (
    <div className="w-full space-y-3">
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
      
      {/* Completion message (shown when completed) */}
      {currentStage === 'completed' && (
        <TransactionCompletionMessage 
          amount={amount} 
          asset={asset} 
          txHash={finalTxHash}
        />
      )}

      {/* Transaction details */}
      <TransactionDetailsCard 
        amount={amount} 
        asset={asset} 
        walletAddress={walletAddress} 
      />
    </div>
  );
};

export default TransactionProgress;
