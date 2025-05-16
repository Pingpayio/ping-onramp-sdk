
import React from 'react';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import TransactionProgressBar from './transaction/TransactionProgressBar';
import TransactionStageCard from './transaction/TransactionStageCard';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import TransactionCompletionMessage from './transaction/TransactionCompletionMessage';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();

  // Generate mock transaction hashes
  const depositTxHash = generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = generateTxHash('0x9c');

  // Check if transaction is completed
  const isCompleted = currentStage === 'completed';

  return (
    <div className="w-full space-y-3">
      {/* Progress bar */}
      <TransactionProgressBar progress={progress} />
      
      {/* Current stage card with consistent height */}
      <div className={`${isMobile ? 'transaction-stage-mobile' : ''}`}>
        <TransactionStageCard 
          currentStage={currentStage}
          onboardingTxHash={depositTxHash}
          swapTxHash={swapTxHash}
          finalTxHash={finalTxHash}
          asset={asset}
          amount={amount}
          walletAddress={walletAddress}
        />
      </div>
      
      {/* Completion message (shown when completed) */}
      {isCompleted && (
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
        isCompleted={isCompleted}
      />
      
      {/* Status message based on transaction stage */}
      {currentStage !== 'completed' && currentStage !== 'failed' ? (
        <p className="text-center text-white/60 text-sm mt-2">
          Please do not close this window while your transaction is being processed.
        </p>
      ) : currentStage === 'completed' && (
        <p className="text-center text-white/60 text-sm mt-2">
          Transaction complete, you can now close this window.
        </p>
      )}
    </div>
  );
};

export default TransactionProgress;
