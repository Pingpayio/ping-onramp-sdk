
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, ArrowUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { type TransactionStage } from '@/hooks/use-transaction-progress';
import { Card, CardContent } from '@/components/ui/card';

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
  stage = 'payment',
  progress = 0,
  onboardingTxHash,
  swapTxHash,
  amount,
  asset,
  walletAddress
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
                <span className="text-white/80">{asset?.charAt(0) || '₿'}</span>
              </div>
              <p className="text-xs text-white/60 mt-1">{asset || 'Crypto'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction details card - always visible */}
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-5">
          <h4 className="text-white font-medium mb-2">Transaction Details</h4>
          <div className="space-y-2 text-sm">
            {amount && (
              <div className="flex justify-between">
                <span className="text-white/60">Amount:</span>
                <span className="text-white">${amount} USD</span>
              </div>
            )}
            {asset && (
              <div className="flex justify-between">
                <span className="text-white/60">Asset:</span>
                <span className="text-white">{asset}</span>
              </div>
            )}
            {walletAddress && (
              <div className="flex justify-between">
                <span className="text-white/60">Recipient:</span>
                <span className="text-white/80 text-right max-w-[200px] break-all">
                  {walletAddress}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion message - only shown when completed */}
      {stage === 'completed' && (
        <div className="text-center py-4">
          <h3 className="text-2xl font-semibold text-white mb-1">
            {amount} {asset}
          </h3>
          <p className="text-white/60">Successfully delivered to your wallet</p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
