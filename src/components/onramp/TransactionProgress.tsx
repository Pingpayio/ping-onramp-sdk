
import React from 'react';
import { generateTxHash } from '@/lib/transaction-utils';
import TransactionStageCard from './transaction/TransactionStageCard';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import TransactionCompletionMessage from './transaction/TransactionCompletionMessage';
import type { IntentProgress } from '@/types/onramp';

interface TransactionProgressProps {
  asset: string | null;
  amount: string;
  walletAddress: string;

  intentProgress?: IntentProgress;
  error?: string | null;
  displayInfo?: { message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string };
}

const TransactionProgress = ({
  asset,
  amount,
  walletAddress,
  intentProgress = 'none',
  error = null,
  displayInfo = {},
}: TransactionProgressProps) => {

  const depositTxHash = displayInfo?.explorerUrl || generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = displayInfo?.explorerUrl || generateTxHash('0x9c');

  const isCompleted = intentProgress === 'done';
  const isFailed = intentProgress === 'error';

  return (
    <div className="w-full space-y-3">
      <TransactionStageCard
        intentProgress={intentProgress}
        onboardingTxHash={depositTxHash}
        swapTxHash={swapTxHash}
        finalTxHash={finalTxHash}
        asset={asset}
        amount={amount}
        walletAddress={walletAddress}
        displayInfo={displayInfo}
        error={error || displayInfo?.error}
      />

      {isCompleted && (
        <TransactionCompletionMessage
          amount={displayInfo?.amountOut ? displayInfo.amountOut.toString() : "processed amount"}
          asset={asset}
          txHash={finalTxHash}
          message={displayInfo?.message || "Transaction completed successfully!"}
        />
      )}
      
      {isFailed && (
        <div className="bg-red-500/10 p-3 rounded-md text-center">
          <p className="text-red-400 font-medium">Transaction Failed</p>
          <p className="text-white/80 text-sm">{error || displayInfo?.error || "An unknown error occurred."}</p>
        </div>
      )}

      <TransactionDetailsCard
        amount={amount}
        asset={asset}
        walletAddress={walletAddress}
        isCompleted={isCompleted}
        displayInfo={displayInfo}
      />

      {!isCompleted && !isFailed && (
        <p className="text-center text-white/60 text-sm mt-2">
          {displayInfo?.message || "Your transaction is being processed. Please do not close this window."}
        </p>
      )}
      {isCompleted && !displayInfo?.message && ( // Fallback completion message if not in displayInfo
        <p className="text-center text-white/60 text-sm mt-2">
          Transaction complete! You can now close this window.
        </p>
      )}
       {isFailed && !error && !displayInfo?.error &&( // Fallback failure message
        <p className="text-center text-white/60 text-sm mt-2">
          The transaction could not be completed. Please check for more details or try again.
        </p>
      )}
    </div>
  );
};

export default TransactionProgress;
