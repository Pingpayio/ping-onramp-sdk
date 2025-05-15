
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, ArrowUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { type TransactionStage } from '@/hooks/use-transaction-progress';

interface TransactionStatusProps {
  status: 'pending' | 'completed' | 'failed';
  title: string;
  description: string;
  txHash?: string;
  stage?: TransactionStage;
  progress?: number;
  onboardingTxHash?: string;
  swapTxHash?: string;
}

const TransactionStatus = ({
  status,
  title,
  description,
  txHash,
  stage = 'payment',
  progress = 0,
  onboardingTxHash,
  swapTxHash
}: TransactionStatusProps) => {
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
    <div className="flex flex-col space-y-4 max-w-md w-full">
      {/* Progress bar */}
      <div className="w-full bg-white/5 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Transaction Progress</span>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/10" />
      </div>
      
      {/* Current stage card */}
      <div className={cn("border rounded-lg p-5", config.color)}>
        <div className="flex items-start">
          <div className="mr-3 mt-1">{config.icon}</div>
          <div>
            <h3 className={cn("font-medium mb-1", config.textColor)}>
              {stage && stageLabels[stage] || title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {stage && stageDescriptions[stage] || description}
            </p>
            
            {/* Show appropriate transaction hash based on stage */}
            {stage === 'payment' && onboardingTxHash && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Payment Transaction:</p>
                <div className="bg-white bg-opacity-50 p-2 rounded text-xs font-mono break-all">
                  {onboardingTxHash}
                </div>
              </div>
            )}
            
            {stage === 'swap' && swapTxHash && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Swap Transaction:</p>
                <div className="bg-white bg-opacity-50 p-2 rounded text-xs font-mono break-all">
                  {swapTxHash}
                </div>
              </div>
            )}
            
            {stage === 'completed' && txHash && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
                <div className="bg-white bg-opacity-50 p-2 rounded text-xs font-mono break-all">
                  {txHash}
                </div>
              </div>
            )}
            
            {validStatus === 'pending' && (
              <div className="mt-3">
                <div className="h-2 w-full bg-yellow-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full w-1/2 animate-pulse-slow"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* NEAR Intents swap visual (shown during swap stage) */}
      {stage === 'swap' && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="w-7 h-7 rounded-full mr-2">
              <img 
                src="/lovable-uploads/d2b4af05-1771-4a52-b69a-baf672076fb9.png" 
                alt="NEAR Intents" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white font-medium">NEAR Intents Swap</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white/80">$</span>
              </div>
              <p className="text-xs text-white/60 mt-1">USD</p>
            </div>
            
            <div className="flex-1 px-2 flex items-center justify-center">
              <ArrowUp className="h-4 w-4 text-white/40 rotate-90 animate-pulse" />
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                {/* Placeholder for crypto icon */}
                <span className="text-white/80">₿</span>
              </div>
              <p className="text-xs text-white/60 mt-1">Crypto</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
