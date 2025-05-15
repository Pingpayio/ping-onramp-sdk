
import React from 'react';
import { type TransactionStage } from '@/hooks/use-transaction-progress';
import StatusProgressBar from './transaction/StatusProgressBar';
import StatusCard from './transaction/StatusCard';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import CompletionMessage from './transaction/CompletionMessage';

interface TransactionStatusProps {
  status: 'pending' | 'completed' | 'failed';
  title: string;
  description: string;
  txHash?: string;
  stage?: TransactionStage;
  progress?: number;
  onboardingTxHash?: string;
  swapTxHash?: string;
  amount?: string;
  asset?: string;
  walletAddress?: string;
}

const TransactionStatus = ({
  status,
  title,
  description,
  txHash,
  stage = 'deposit',
  progress = 0,
  onboardingTxHash,
  swapTxHash,
  amount,
  asset,
  walletAddress
}: TransactionStatusProps) => {
  return (
    <div className="flex flex-col space-y-4 max-w-md w-full">
      {/* Progress bar */}
      <StatusProgressBar progress={progress} />
      
      {/* Current stage card */}
      <StatusCard 
        status={status}
        title={title}
        description={description}
        txHash={txHash}
        stage={stage}
        onboardingTxHash={onboardingTxHash}
        swapTxHash={swapTxHash}
      />

      {/* Transaction details card - always visible */}
      <TransactionDetailsCard 
        amount={amount}
        asset={asset}
        walletAddress={walletAddress}
      />

      {/* Completion message - only shown when completed */}
      {stage === 'completed' && (
        <CompletionMessage 
          amount={amount}
          asset={asset}
          stage={stage}
        />
      )}
    </div>
  );
};

export default TransactionStatus;
