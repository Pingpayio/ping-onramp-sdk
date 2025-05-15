
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
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700'
    },
    completed: {
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    failed: {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700'
    }
  };

  // Ensure the status is valid, fallback to 'pending' if not
  const validStatus: 'pending' | 'completed' | 'failed' = 
    statusConfig.hasOwnProperty(status) ? status : 'pending';
  const config = statusConfig[validStatus];

  const stageLabels = {
    payment: 'Processing Payment',
    swap: 'Executing NEAR Intents Swap',
    completed: 'Transaction Complete',
    failed: 'Transaction Failed'
  };

  // Stage-specific descriptions
  const stageDescriptions = {
    payment: 'Your payment is being processed. This should only take a moment.',
    swap: 'Converting your funds through NEAR Intents protocol for best rates.',
    completed: 'Your transaction has been completed successfully!',
    failed: 'There was an issue processing your transaction.'
  };

  return (
    <div className={cn("border rounded-lg p-5 bg-white/5 border-white/20")}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">{config.icon}</div>
        <div>
          <h3 className="font-medium mb-1 text-white">
            {stage && stageLabels[stage] || title}
          </h3>
          <p className="text-sm text-white/60">
            {stage && stageDescriptions[stage] || description}
          </p>
          
          {/* Show appropriate transaction hash based on stage */}
          {stage === 'payment' && onboardingTxHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Payment Transaction:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {onboardingTxHash}
              </div>
            </div>
          )}
          
          {stage === 'swap' && swapTxHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Swap Transaction:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {swapTxHash}
              </div>
            </div>
          )}
          
          {stage === 'completed' && txHash && (
            <div className="mt-3">
              <p className="text-xs text-white/60 mb-1">Transaction Hash:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {txHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
