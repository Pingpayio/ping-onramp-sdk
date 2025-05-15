
import React from 'react';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { generateTxHash } from '@/lib/transaction-utils';
import TransactionProgressBar from './transaction/TransactionProgressBar';
import TransactionStageCard from './transaction/TransactionStageCard';
import TransactionDetailsCard from './transaction/TransactionDetailsCard';
import TransactionCompletionMessage from './transaction/TransactionCompletionMessage';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Home, ExternalLink } from 'lucide-react';
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
  
  // Generate Explorer URL for NEAR transaction
  const getExplorerUrl = () => {
    return `https://explorer.near.org/transactions/${finalTxHash}`;
  };

  return (
    <div className="w-full space-y-3 flex flex-col h-full">
      <div className="flex-grow">
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
      
      {/* Navigation buttons - positioned in the same location as Start Onramp button */}
      <div className="mt-auto pt-4">
        <div className="flex justify-between">
          <Link to="/">
            <Button 
              variant="outline" 
              icon={<Home className="h-4 w-4" />}
            >
              Return Home
            </Button>
          </Link>
          
          {currentStage === 'completed' && finalTxHash && (
            <a href={getExplorerUrl()} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                icon={<ExternalLink className="h-4 w-4" />}
                className={`rounded-full flex items-center gap-2 border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 ${isMobile ? 'w-1/2' : ''}`}
              >
                View on Explorer
              </Button>
            </a>
          )}
        </div>
      </div>
      
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
