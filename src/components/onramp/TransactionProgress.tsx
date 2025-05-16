
import React from 'react';
import { type TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import TransactionProgressBar from './transaction/TransactionProgressBar';
import TransactionStageCard from './transaction/TransactionStageCard';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import TransactionCompletionMessage from './transaction/TransactionCompletionMessage';

interface TransactionProgressProps {
  asset: string | null;
  amount: string;
  walletAddress: string; 

  currentStage?: TransactionStage; 
  progress?: number;             
  error?: string | null;         
  displayInfo?: { message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string };
}

const TransactionProgress = ({
  asset,
  amount,
  walletAddress,
  currentStage = 'confirming_evm_deposit', 
  progress = 0,
  error = null,
  displayInfo = {},
}: TransactionProgressProps) => {

  const depositTxHash = displayInfo?.explorerUrl || generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = displayInfo?.explorerUrl || generateTxHash('0x9c');

  const isCompleted = currentStage === 'intent_completed';
  const isFailed = currentStage === 'intent_failed';

  return (
    <div className="w-full space-y-3">
      {/* Progress bar */}
      <TransactionProgressBar progress={progress || 0} />

      {/* Current stage card  */}
      <TransactionStageCard
        currentStage={currentStage}
        onboardingTxHash={depositTxHash} 
        swapTxHash={swapTxHash}
        finalTxHash={finalTxHash}
        asset={asset}
        amount={amount}
        walletAddress={walletAddress} // Target NEAR address
        displayInfo={displayInfo} // Pass displayInfo for more details
        error={error || displayInfo?.error} // Pass error state
      />

      {/* Completion message (shown when completed) */}
      {isCompleted && (
        <TransactionCompletionMessage
          amount={displayInfo?.amountOut ? displayInfo.amountOut.toString() : amount} // Show actual output amount if available
          asset={asset} // Could also be a target asset from displayInfo if different
          txHash={finalTxHash}
          message={displayInfo?.message}
        />
      )}
      
      {/* Error message display */}
      {isFailed && error && (
        <div className="bg-red-500/10 p-3 rounded-md text-center">
          <p className="text-red-400 font-medium">Transaction Failed</p>
          <p className="text-white/80 text-sm">{error || displayInfo?.error}</p>
        </div>
      )}


      {/* Transaction details - can also use displayInfo */}
      <TransactionDetailsCard
        amount={amount} // Initial fiat amount
        asset={asset} // Initial asset (e.g., USDC)
        walletAddress={walletAddress} // Target NEAR address
        isCompleted={isCompleted}
        displayInfo={displayInfo} // Pass for more details like actual amounts
      />

      {/* Status message based on transaction stage */}
      {!isCompleted && !isFailed && (
        <p className="text-center text-white/60 text-sm mt-2">
          {displayInfo?.message || "Please do not close this window while your transaction is being processed."}
        </p>
      )}
      {isCompleted && (
        <p className="text-center text-white/60 text-sm mt-2">
          Transaction complete! You can now close this window.
        </p>
      )}
       {isFailed && !error && ( // If failed but no specific error message from props
        <p className="text-center text-white/60 text-sm mt-2">
          The transaction could not be completed. Please check for more details or try again.
        </p>
      )}
    </div>
  );
};

export default TransactionProgress;
