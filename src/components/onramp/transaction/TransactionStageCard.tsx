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
  displayInfo?: { message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string };
  error?: string | null;
}

export const TransactionStageCard: React.FC<TransactionStageCardProps> = ({
  currentStage,
  onboardingTxHash,
  swapTxHash,
  finalTxHash,
  asset,
  amount,
  walletAddress,
  displayInfo,
  error
}) => {
  const getStageConfig = () => {
    if (error || currentStage === 'intent_failed') {
      return {
        icon: <CircleX className="h-8 w-8 text-red-500" />,
        color: 'bg-white/5 border-red-200/20',
        textColor: 'text-white'
      };
    }
    switch (currentStage) {
      case 'confirming_evm_deposit': 
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          color: 'bg-white/5 border-yellow-200/20',
          textColor: 'text-white'
        };
      case 'quoting_bridge_swap':
        return {
          icon: <ArrowRight className="h-8 w-8 text-blue-400" />,
          color: 'bg-white/5 border-blue-200/20',
          textColor: 'text-white'
        };
      case 'awaiting_intent_signature': 
        return {
          icon: <Wallet className="h-8 w-8 text-[#AF9EF9]" />,
          color: 'bg-white/5 border-[#AF9EF9]/20',
          textColor: 'text-white'
        };
      case 'publishing_intent':
      case 'awaiting_intent_settlement':
        return {
          icon: <ArrowRight className="h-8 w-8 text-blue-400 rotate-45" />,
          color: 'bg-white/5 border-blue-200/20',
          textColor: 'text-white'
        };
      case 'intent_completed':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          color: 'bg-white/5 border-green-200/20',
          textColor: 'text-white'
        };
      default: // Fallback for any other stages or undefined
        return {
          icon: <Clock className="h-8 w-8 text-gray-500" />,
          color: 'bg-white/5 border-gray-200/20',
          textColor: 'text-white'
        };
    }
  };

  const config = getStageConfig();

  const stageLabels: Record<TransactionStage, string> = {
    confirming_evm_deposit: 'Confirming EVM Deposit',
    quoting_bridge_swap: 'Quoting Bridge Swap',
    awaiting_intent_signature: 'Awaiting Intent Signature',
    publishing_intent: 'Publishing Intent',
    awaiting_intent_settlement: 'Awaiting Intent Settlement',
    intent_completed: 'Intent Completed',
    intent_failed: 'Intent Failed',
  };

  const getStageDescription = () => {
    if (error) return error; 
    if (displayInfo?.error) return displayInfo.error; 
    if (displayInfo?.message) return displayInfo.message;

    const assetDisplay = asset || 'asset';
    const amountDisplay = displayInfo?.amountIn || amount || 'specified amount';
    const recipientDisplay = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'recipient';


    switch (currentStage) {
      case 'confirming_evm_deposit':
        return `Waiting for your ${amountDisplay} ${assetDisplay} deposit to the EVM address.`;
      case 'quoting_bridge_swap':
        return `Getting quotes to bridge your ${assetDisplay} to NEAR.`;
      case 'awaiting_intent_signature':
        return `Please sign the intent in your wallet to proceed with bridging to ${recipientDisplay}.`;
      case 'publishing_intent':
        return `Publishing your signed intent to the NEAR network.`;
      case 'awaiting_intent_settlement':
        return `Intent published. Awaiting settlement on NEAR. This may take a few moments.`;
      case 'intent_completed': {
        const outAmount = displayInfo?.amountOut ? `${displayInfo.amountOut.toFixed(4)} ${assetDisplay}` : `${amountDisplay} ${assetDisplay}`;
        return `Successfully bridged and sent ${outAmount} to ${recipientDisplay}.`;
      }
      case 'intent_failed':
        return 'The NEAR intent process could not be completed.';
      default:
        return 'Processing your transaction...';
    }
  };

  const renderTransactionHash = () => {
    let txHashToDisplay = '';
    let label = '';

    if (currentStage === 'intent_completed' && (finalTxHash || displayInfo?.explorerUrl)) {
      txHashToDisplay = finalTxHash || displayInfo?.explorerUrl || '';
      label = 'NEAR Transaction:';
    } else if (currentStage === 'confirming_evm_deposit' && (onboardingTxHash || displayInfo?.explorerUrl)) {
      // Assuming explorerUrl in displayInfo at this stage is for the EVM deposit
      txHashToDisplay = onboardingTxHash || displayInfo?.explorerUrl || '';
      label = 'EVM Deposit Tx:';
    }
    // Add other stages if specific hashes are available, e.g., swapTxHash for 'awaiting_intent_settlement'

    if (txHashToDisplay) {
      // Basic check if it's a URL
      const isUrl = txHashToDisplay.startsWith('http://') || txHashToDisplay.startsWith('https://');
      return (
        <div className="mt-2">
          <p className="text-xs text-white/60 mb-1">{label}</p>
          {isUrl ? (
            <a 
              href={txHashToDisplay} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white/5 p-2 rounded text-xs font-mono break-all text-[#AF9EF9] hover:underline flex items-center gap-1"
            >
              View on Explorer <Link size={12} />
            </a>
          ) : (
            <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
              {txHashToDisplay}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "border rounded-lg p-5 transition-all duration-500 ease-in-out", 
      config.color
    )}>
      <div className="flex items-start">
        <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center">{config.icon}</div>
        <div className="flex-1">
          <h3 className={cn("font-medium mb-1 text-lg", config.textColor)}>
            {stageLabels[currentStage]}
          </h3>
          <p className="text-sm text-white/60">
            {getStageDescription()}
          </p>
          
          {renderTransactionHash()}
        </div>
      </div>
    </div>
  );
};

export default TransactionStageCard;
