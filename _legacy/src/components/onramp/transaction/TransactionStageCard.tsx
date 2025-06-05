import React from "react";
import {
  CheckCircle2,
  CircleX,
  Clock,
  ArrowRight,
  Wallet,
  Link,
  Loader2,
  SearchCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntentProgress } from "@/types/onramp";

interface TransactionStageCardProps {
  intentProgress?: IntentProgress;
  onboardingTxHash?: string;
  swapTxHash?: string;
  finalTxHash?: string;
  asset?: string | null;
  amount?: string;
  walletAddress?: string;
  displayInfo?: {
    message?: string;
    amountIn?: number;
    amountOut?: number;
    explorerUrl?: string;
    error?: string;
  };
  error?: string | null;
}

export const TransactionStageCard: React.FC<TransactionStageCardProps> = ({
  intentProgress = "none",
  onboardingTxHash,
  finalTxHash,
  asset,
  amount,
  walletAddress,
  displayInfo,
  error,
}) => {
  const getStageConfig = () => {
    if (intentProgress === "error" || error) {
      return {
        icon: <CircleX className="h-8 w-8 text-red-500" />,
        color: "bg-white/5 border-red-500/30",
        textColor: "text-white",
      };
    }
    switch (intentProgress) {
      case "none":
      case "form":
        return {
          icon: <Clock className="h-8 w-8 text-gray-500" />,
          color: "bg-white/5 border-gray-200/20",
          textColor: "text-white",
        };
      case "generating_url":
        return {
          icon: <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />,
          color: "bg-white/5 border-blue-200/20",
          textColor: "text-white",
        };
      case "redirecting_coinbase":
        return {
          icon: <ArrowRight className="h-8 w-8 text-blue-400" />,
          color: "bg-white/5 border-blue-200/20",
          textColor: "text-white",
        };
      case "depositing":
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          color: "bg-white/5 border-yellow-500/30",
          textColor: "text-white",
        };
      case "querying":
        return {
          icon: <SearchCheck className="h-8 w-8 text-sky-400" />,
          color: "bg-white/5 border-sky-400/30",
          textColor: "text-white",
        };
      case "signing":
        return {
          icon: <Wallet className="h-8 w-8 text-[#AF9EF9]" />,
          color: "bg-white/5 border-[#AF9EF9]/30",
          textColor: "text-white",
        };
      case "withdrawing":
        return {
          icon: <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />,
          color: "bg-white/5 border-purple-400/30",
          textColor: "text-white",
        };
      case "done":
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          color: "bg-white/5 border-green-500/30",
          textColor: "text-white",
        };
      default:
        return {
          icon: <Clock className="h-8 w-8 text-gray-500" />,
          color: "bg-white/5 border-gray-200/20",
          textColor: "text-white",
        };
    }
  };

  const config = getStageConfig();

  const stageLabels: Record<IntentProgress, string> = {
    none: "Initializing",
    form: "Ready",
    generating_url: "Generating Onramp URL",
    redirecting_coinbase: "Redirecting to Coinbase",
    depositing: "Confirming Deposit",
    querying: "Querying Routes",
    signing: "Awaiting Signature",
    withdrawing: "Processing Withdrawal",
    done: "Transaction Complete",
    error: "Transaction Failed",
  };

  const getStageDescription = () => {
    if (error) return error;
    if (displayInfo?.error) return displayInfo.error;
    if (displayInfo?.message && intentProgress !== "error")
      return displayInfo.message;

    const assetDisplay = asset || "asset";
    const amountInDisplay =
      displayInfo?.amountIn?.toFixed(2) || amount || "specified amount";
    const recipientDisplay = walletAddress
      ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
      : "recipient";

    switch (intentProgress) {
      case "none":
        return "Initializing onramp process...";
      case "form":
        return "Please fill out the form to proceed.";
      case "generating_url":
        return "Preparing your secure onramp link...";
      case "redirecting_coinbase":
        return "Redirecting you to Coinbase to complete your purchase.";
      case "depositing":
        return `Waiting for your ${amountInDisplay} ${selectedCurrencySymbol(assetDisplay)} deposit from Coinbase.`;
      case "querying":
        return `Finding the best bridge rates for your ${assetDisplay}.`;
      case "signing":
        return `Please sign the transaction in your wallet to bridge ${assetDisplay} to ${recipientDisplay}.`;
      case "withdrawing":
        return `Processing your ${assetDisplay} bridge to NEAR. This may take a few moments.`;
      case "done": {
        const outAmount = displayInfo?.amountOut
          ? `${displayInfo.amountOut.toFixed(Math.min(6, assetDecimalPlaces(assetDisplay)))} ${assetDisplay}`
          : `${assetDisplay}`;
        return `Successfully sent ${outAmount} to ${recipientDisplay}.`;
      }
      case "error":
        return (
          error ||
          displayInfo?.error ||
          "The transaction could not be completed."
        );
      default:
        return "Processing your transaction...";
    }
  };

  const selectedCurrencySymbol = (assetSymbol: string | null) => {
    if (assetSymbol === "USDC") return "USDC";
    return "USD";
  };

  const assetDecimalPlaces = (assetSymbol: string | null) => {
    if (assetSymbol === "USDC") return 6;
    return 2;
  };

  const renderTransactionHash = () => {
    let txHashToDisplay = "";
    let label = "";
    let explorerBaseUrl = "";

    if (intentProgress === "done" && displayInfo?.explorerUrl) {
      txHashToDisplay = displayInfo.explorerUrl;
      label = "NEAR Transaction:";
    } else if (intentProgress === "done" && finalTxHash) {
      txHashToDisplay = finalTxHash;
      label = "NEAR Transaction:";
      explorerBaseUrl = "https://nearblocks.io/txns/";
    } else if (intentProgress === "depositing" && onboardingTxHash) {
      txHashToDisplay = onboardingTxHash;
      label = "EVM Deposit Tx:";
      explorerBaseUrl = "https://basescan.org/tx/";
    }

    if (txHashToDisplay) {
      const isFullUrl =
        txHashToDisplay.startsWith("http://") ||
        txHashToDisplay.startsWith("https://");
      const url = isFullUrl
        ? txHashToDisplay
        : explorerBaseUrl + txHashToDisplay;

      return (
        <div className="mt-2">
          <p className="text-xs text-white/60 mb-1">{label}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 p-2 rounded text-xs font-mono break-all text-[#AF9EF9] hover:underline flex items-center gap-1"
          >
            View on Explorer <Link size={12} />
          </a>
        </div>
      );
    }
    return null;
  };

  if (intentProgress === "form" || intentProgress === "none") {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-5 transition-all duration-500 ease-in-out",
        config.color,
      )}
    >
      <div className="flex items-start">
        <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-medium mb-1 text-lg", config.textColor)}>
            {stageLabels[intentProgress]}
          </h3>
          <p className="text-sm text-white/60">{getStageDescription()}</p>

          {renderTransactionHash()}
        </div>
      </div>
    </div>
  );
};

export default TransactionStageCard;
