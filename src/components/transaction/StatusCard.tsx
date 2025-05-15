
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { type TransactionStage } from '@/hooks/use-transaction-progress';

interface StatusCardProps {
  status: 'pending' | 'completed' | 'failed';
  title: string;
  description: string;
  txHash?: string;
  stage?: TransactionStage;
  onboardingTxHash?: string;
  swapTxHash?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  description,
  txHash,
  stage = 'payment',
  onboardingTxHash,
  swapTxHash
}) => {
  // Define status configurations with fallback to 'pending' if status is invalid
  const statusConfig = {
    pending: {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: 'bg-white/5 border-white/20',
      textColor: 'text-white'
    },
    completed: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      color: 'bg-white/5 border-white/20',
      textColor: 'text-white'
    },
    failed: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      color: 'bg-white/5 border-white/20',
      textColor: 'text-white'
    }
  };

  // Ensure the status is valid, fallback to 'pending' if not
  const validStatus: 'pending' | 'completed' | 'failed' = 
    statusConfig.hasOwnProperty(status) ? status : 'pending';
  const config = statusConfig[validStatus];

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

  // Stage-specific descriptions
  const stageDescriptions = {
    deposit: 'Waiting for deposit to NEAR Intents',
    querying: 'Please wait while we query the best rates',
    signing: 'Please sign the transaction in your wallet',
    sending: 'Your assets are being transferred',
    payment: 'Your payment is being processed. This should only take a moment.',
    swap: 'Converting your funds through NEAR Intents protocol for best rates.',
    completed: 'Your transaction has been completed successfully!',
    failed: 'There was an issue processing your transaction.'
  };

  // Determine if we should show transaction hash information for this stage
  const showTxDetails = () => {
    if ((stage === 'payment' || stage === 'deposit') && onboardingTxHash) {
      return {
        label: 'Payment Transaction:',
        hash: onboardingTxHash
      };
    } else if ((stage === 'swap' || stage === 'sending') && swapTxHash) {
      return {
        label: 'Swap Transaction:',
        hash: swapTxHash
      };
    } else if (stage === 'completed' && txHash) {
      return {
        label: 'Transaction Hash:',
        hash: txHash
      };
    }
    return null;
  };

  const txDetails = showTxDetails();

  return (
    <div className={cn("border rounded-lg p-5 min-h-[160px]", config.color)}>
      <div className="flex items-start">
        {/* Icon container with consistent size and position */}
        <div className="mr-3 mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-base mb-1 text-white">
            {stage && stageLabels[stage] || title}
          </h3>
          <p className="text-sm text-white/60 min-h-[40px]">
            {stage && stageDescriptions[stage] || description}
          </p>
          
          {/* Transaction hash information with consistent styling */}
          {txDetails && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">{txDetails.label}</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {txDetails.hash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
