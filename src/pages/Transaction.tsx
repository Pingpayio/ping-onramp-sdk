
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransactionStatus from '@/components/TransactionStatus';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { toast } from '@/components/ui/use-toast';
import TransactionContainer from '@/components/transaction/TransactionContainer';
import TransactionActionButtons from '@/components/transaction/TransactionActionButtons';
import { generateTransactionHash } from '@/components/transaction/utils/transactionUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const Transaction = () => {
  const location = useLocation();
  const { state } = location;
  const isMobile = useIsMobile();
  
  const {
    currentStage,
    progress,
    error
  } = useTransactionProgress({ simulateProgress: true });
  
  const defaultData = {
    status: "pending",
    title: "Transaction Processing",
    description: "Your transaction is currently being processed. This may take a few minutes.",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    asset: "NEAR",
    amount: "100",
    walletAddress: "0x1234...5678"
  };
  
  // Use state data if available, otherwise use default
  const transactionData = state?.txDetails || defaultData;

  // Generate transaction hashes
  const onboardingTxHash = generateTransactionHash('0x7a');
  const swapTxHash = generateTransactionHash('0x8b');
  const finalTxHash = generateTransactionHash('0x9c');
  
  // Show toast notifications on stage changes with consistent styling
  useEffect(() => {
    if (currentStage === 'querying') {
      toast({
        title: "Deposit Received",
        description: "Now querying quotes on NEAR Intents...",
      });
    } else if (currentStage === 'signing') {
      toast({
        title: "Quotes Retrieved",
        description: "Please sign the transaction message...",
      });
    } else if (currentStage === 'sending') {
      toast({
        title: "Transaction Signed",
        description: "Now sending your assets...",
      });
    } else if (currentStage === 'completed') {
      toast({
        title: "Transaction Complete",
        description: `Successfully delivered ${transactionData.amount} ${transactionData.asset} to your wallet.`,
      });
    }
  }, [currentStage, transactionData]);

  // Map transaction stage to status
  const getStatusFromStage = (stage: TransactionStage): 'pending' | 'completed' | 'failed' => {
    switch (stage) {
      case 'completed':
        return 'completed';
      case 'failed':
        return 'failed';
      default:
        return 'pending';
    }
  };

  return (
    <TransactionContainer>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md min-h-[550px]">
          <TransactionStatus 
            status={getStatusFromStage(currentStage)}
            title={transactionData.title || `${transactionData.asset} Transaction`}
            description={transactionData.description || 
              `Processing ${transactionData.amount} ${transactionData.asset} to ${transactionData.walletAddress}`}
            txHash={finalTxHash}
            stage={currentStage}
            progress={progress}
            onboardingTxHash={onboardingTxHash}
            swapTxHash={swapTxHash}
            amount={transactionData.amount}
            asset={transactionData.asset}
            walletAddress={transactionData.walletAddress}
          />
        </div>
      </div>
      
      <TransactionActionButtons currentStage={currentStage} />
    </TransactionContainer>
  );
};

export default Transaction;
