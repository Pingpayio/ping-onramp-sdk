
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
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
      
      {/* Action buttons - only enabled when completed */}
      {isCompleted && (
        <div className="flex justify-between space-x-3 mt-6">
          <Button
            variant="outline"
            className="bg-white/5 border border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Link className="h-4 w-4" />
            Return Home
          </Button>
          
          <Button
            variant="outline"
            className="bg-[#AF9EF9]/10 border border-[#AF9EF9]/20 text-[#AF9EF9] hover:bg-[#AF9EF9]/20 flex items-center gap-2"
            onClick={() => window.open(`https://explorer.near.org/transactions/${finalTxHash}`, '_blank')}
          >
            <Link className="h-4 w-4" />
            View on NEAR Explorer
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionProgress;
