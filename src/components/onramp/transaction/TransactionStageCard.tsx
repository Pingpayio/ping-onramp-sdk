import React from 'react';
import { TransactionStage } from '@/hooks/use-transaction-progress';
import { CheckCircle2, CircleX, Clock, ArrowRight, Wallet, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionStageCardProps {
  currentStage: TransactionStage;
  onboardingTxHash?: string;
  swapTxHash?: string;
  finalTxHash?: string;
  asset?: string | null;
  amount?: string;
  walletAddress?: string;
}

export const TransactionStageCard: React.FC<TransactionStageCardProps> = ({
  currentStage,
  onboardingTxHash,
  swapTxHash,
  finalTxHash,
  asset,
  amount,
  walletAddress
}) => {
  // Define status configurations based on transaction stage
  const getStageConfig = () => {
    switch (currentStage) {
      case 'deposit':
      case 'payment':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          color: 'bg-white/5 border-yellow-200/20',
          textColor: 'text-white'
        };
      case 'querying':
        return {
          icon: <ArrowRight className="h-8 w-8 text-blue-400" />,
          color: 'bg-white/5 border-blue-200/20',
          textColor: 'text-white'
        };
      case 'signing':
        return {
          icon: <Wallet className="h-8 w-8 text-[#AF9EF9]" />,
          color: 'bg-white/5 border-[#AF9EF9]/20',
          textColor: 'text-white'
        };
      case 'sending':
      case 'swap':
        return {
          icon: <ArrowRight className="h-8 w-8 text-blue-400 rotate-45" />,
          color: 'bg-white/5 border-blue-200/20',
          textColor: 'text-white'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          color: 'bg-white/5 border-green-200/20',
          textColor: 'text-white'
        };
      case 'failed':
        return {
          icon: <CircleX className="h-8 w-8 text-red-500" />,
          color: 'bg-white/5 border-red-200/20',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          color: 'bg-white/5 border-yellow-200/20',
          textColor: 'text-white'
        };
    }
  };

  const config = getStageConfig();

  const stageLabels = {
    deposit: 'Waiting for Deposit',
    querying: 'Querying Quotes on NEAR Intents',
    signing: 'Signing Intent Message',
    sending: 'Sending to Recipient',
    payment: 'Processing Payment',
    swap: 'Executing NEAR Intents Swap',
    completed: 'Transaction Complete',
    failed: 'Transaction Failed'
  };

  const getStageDescription = () => {
    const assetDisplay = asset || 'tokens';
    
    switch (currentStage) {
      case 'deposit':
        return `Waiting for ${amount} ${assetDisplay} onramp deposit to NEAR Intents`;
      case 'payment':
        return `Your payment is being processed. This should only take a moment.`;
      case 'querying':
        return `Please wait while we query quotes for ${amount} ${assetDisplay} on NEAR Intents`;
      case 'signing':
        return `Please sign the message in your wallet to send ${amount} ${assetDisplay} to the recipient address with a small network fee`;
      case 'sending':
        return `${amount} ${assetDisplay} is being sent to the recipient address ${walletAddress?.substring(0, 10)}...`;
      case 'swap':
        return `Converting your funds through NEAR Intents protocol for best rates.`;
      case 'completed':
        return `Successfully sent ${amount} ${assetDisplay} to the recipient address`;
      case 'failed':
        return 'There was an issue processing your transaction.';
      default:
        return 'Processing your transaction';
    }
  };

  const renderTransactionHash = () => {
    if ((currentStage === 'deposit' || currentStage === 'payment') && onboardingTxHash) {
      return (
        <div className="mt-2">
          <p className="text-xs text-white/60 mb-1">Deposit Transaction:</p>
          <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
            {onboardingTxHash}
          </div>
        </div>
      );
    } else if (currentStage === 'completed' && finalTxHash) {
      return (
        <div className="mt-2">
          <p className="text-xs text-white/60 mb-1">Transaction Hash:</p>
          <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
            {finalTxHash}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={cn(
      "border rounded-lg p-5 transition-all duration-500 ease-in-out min-h-[180px]", 
      config.color
    )}>
      <div className="flex items-start">
        <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center">{config.icon}</div>
        <div className="flex-1">
          <h3 className={cn("font-medium mb-1 text-lg", config.textColor)}>
            {stageLabels[currentStage]}
          </h3>
          <p className="text-sm text-white/60 min-h-[40px]">
            {getStageDescription()}
          </p>
          
          {renderTransactionHash()}
        </div>
      </div>
    </div>
  );
};

export default TransactionStageCard;
