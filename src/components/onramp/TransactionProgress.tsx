
import React from 'react';
import { useTransactionProgress, TransactionStage } from '@/hooks/use-transaction-progress';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Generate mock transaction hashes
  const generateTxHash = (prefix: string) => {
    const baseHash = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    return `${prefix}${baseHash.substring(prefix.length)}`;
  };

  const onboardingTxHash = generateTxHash('0x7a');
  const swapTxHash = generateTxHash('0x8b');
  const finalTxHash = generateTxHash('0x9c');

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
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
              {stageLabels[currentStage]}
            </h3>
            <p className="text-sm text-white/60">
              {stageDescriptions[currentStage]}
            </p>
            
            {/* Show appropriate transaction hash based on stage */}
            {currentStage === 'payment' && (
              <div className="mt-3">
                <p className="text-xs text-white/60 mb-1">Payment Transaction:</p>
                <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                  {onboardingTxHash}
                </div>
              </div>
            )}
            
            {currentStage === 'swap' && (
              <div className="mt-3">
                <p className="text-xs text-white/60 mb-1">Swap Transaction:</p>
                <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                  {swapTxHash}
                </div>
              </div>
            )}
            
            {currentStage === 'completed' && (
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
      
      {/* NEAR Intents swap visual (shown during swap stage) */}
      {currentStage === 'swap' && (
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
                <span className="text-white/80">{asset?.charAt(0)}</span>
              </div>
              <p className="text-xs text-white/60 mt-1">{asset || 'Crypto'}</p>
            </div>
          </div>
        </div>
      )}

      {currentStage === 'completed' && (
        <div className="flex justify-center mt-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white mb-1">
              {amount} {asset}
            </div>
            <p className="text-white/60">Successfully delivered to your wallet</p>
          </div>
        </div>
      )}

      {/* Transaction details */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <h4 className="text-white/80 text-sm font-medium mb-2">Transaction Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Amount:</span>
            <span className="text-white/80">${amount} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Asset:</span>
            <span className="text-white/80">{asset || 'NEAR'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Recipient:</span>
            <span className="text-white/80 break-all text-right max-w-[200px]">{walletAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionProgress;
