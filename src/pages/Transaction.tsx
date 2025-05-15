
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TransactionStatus from '@/components/TransactionStatus';
import SidebarNav from '@/components/SidebarNav';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  
  const {
    currentStage,
    progress,
    setStage,
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

  // Generate transaction hashes based on asset and wallet
  const generateTxHash = (prefix: string) => {
    const baseHash = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    return `${prefix}${baseHash.substring(prefix.length)}`;
  };

  const onboardingTxHash = generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = generateTxHash('0x9c');
  
  // Show toast notifications on stage changes with consistent styling
  useEffect(() => {
    if (currentStage === 'swap') {
      toast({
        title: "Payment Processed",
        description: "Now executing NEAR Intents swap...",
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
    <div className="flex h-screen bg-[#120714] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-[256px]">
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
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
          
          {/* Action buttons - shown on completion */}
          {currentStage === 'completed' && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                className="bg-white/5 border border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate('/onramp')}
              >
                Buy More
              </Button>
              
              <Button
                variant="default"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                onClick={() => navigate('/')}
              >
                Return Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
