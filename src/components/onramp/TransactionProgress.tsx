
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
    <div className="w-full space-y-3 flex flex-col h-full">
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
      
      {/* Action buttons - moved to bottom with mt-auto to match Start Onramp position */}
      <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
        <Button
          variant="default"
          className="bg-white text-[#3D315E] hover:bg-white rounded-[9999px] flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Return Home
        </Button>
        
        <Button
          variant="outline"
          className="bg-[#AF9EF9]/10 border-none text-[#AF9EF9] hover:bg-[#AF9EF9]/20 flex items-center gap-2 rounded-[9999px]"
          onClick={() => window.open(`https://explorer.near.org/transactions/${finalTxHash}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </Button>
      </div>
    </div>
  );
};

export default TransactionProgress;
