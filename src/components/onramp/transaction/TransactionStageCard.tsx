
import React from 'react';
import { TransactionStage } from '@/hooks/use-transaction-progress';
import { CheckCircle2, Clock, AlertCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionStageCardProps {
  currentStage: TransactionStage;
  onboardingTxHash?: string;
  swapTxHash?: string;
  finalTxHash?: string;
}

export const TransactionStageCard: React.FC<TransactionStageCardProps> = ({
  currentStage,
  onboardingTxHash,
  swapTxHash,
  finalTxHash
}) => {
  // Define status configurations based on transaction stage
  const getStageConfig = () => {
    switch (currentStage) {
      case 'payment':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          color: 'bg-white/5 border-yellow-200/20',
          textColor: 'text-white/80'
        };
      case 'swap':
        return {
          icon: <ArrowUp className="h-6 w-6 text-blue-400 rotate-45" />,
          color: 'bg-white/5 border-blue-200/20',
          textColor: 'text-white/80'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          color: 'bg-white/5 border-green-200/20',
          textColor: 'text-white/80'
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          color: 'bg-white/5 border-red-200/20',
          textColor: 'text-white/80'
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          color: 'bg-white/5 border-yellow-200/20',
          textColor: 'text-white/80'
        };
    }
  };

  const config = getStageConfig();

  const stageLabels = {
    payment: 'Processing Payment',
    swap: 'Executing NEAR Intents Swap',
    completed: 'Transaction Complete',
    failed: 'Transaction Failed'
  };

  const stageDescriptions = {
    payment: 'Your payment is being processed. This should only take a moment.',
    swap: 'Converting your funds through NEAR Intents protocol for best rates.',
    completed: 'Your transaction has been completed successfully!',
    failed: 'There was an issue processing your transaction.'
  };

  return (
    <div className={cn("border rounded-lg p-5", config.color)}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">{config.icon}</div>
        <div>
          <h3 className={cn("font-medium mb-1", config.textColor)}>
            {stageLabels[currentStage]}
          </h3>
          <p className="text-sm text-white/60">
            {stageDescriptions[currentStage]}
          </p>
          
          {/* Show appropriate transaction hash based on stage */}
          {currentStage === 'payment' && onboardingTxHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Payment Transaction:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {onboardingTxHash}
              </div>
            </div>
          )}
          
          {currentStage === 'swap' && swapTxHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Swap Transaction:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {swapTxHash}
              </div>
            </div>
          )}
          
          {currentStage === 'completed' && finalTxHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Transaction Hash:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {finalTxHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStageCard;
