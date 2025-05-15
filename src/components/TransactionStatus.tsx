
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import { type TransactionStage } from '@/hooks/use-transaction-progress';
import StatusProgressBar from './transaction/StatusProgressBar';
import StatusCard from './transaction/StatusCard';
import SwapVisualizationCard from './transaction/SwapVisualizationCard';
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
  const navigate = useNavigate();
  const isCompleted = stage === 'completed';

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
      
      {/* NEAR Intents swap visual (shown during swap stage) */}
      {(stage === 'swap' || stage === 'sending') && <SwapVisualizationCard asset={asset} />}

      {/* Completion message - only shown when completed */}
      {isCompleted && (
        <CompletionMessage 
          amount={amount}
          asset={asset}
          stage={stage}
        />
      )}

      {/* Transaction details card - only shown when completed */}
      {isCompleted && (
        <TransactionDetailsCard 
          amount={amount}
          asset={asset}
          walletAddress={walletAddress}
        />
      )}
      
      {/* Action buttons - only shown when completed */}
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
          
          {txHash && (
            <Button
              variant="outline"
              className="bg-[#AF9EF9]/10 border border-[#AF9EF9]/20 text-[#AF9EF9] hover:bg-[#AF9EF9]/20 flex items-center gap-2"
              onClick={() => window.open(`https://explorer.near.org/transactions/${txHash}`, '_blank')}
            >
              <Link className="h-4 w-4" />
              View on NEAR Explorer
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
