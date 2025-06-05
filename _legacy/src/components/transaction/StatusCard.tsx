import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { type TransactionStage } from "@/hooks/use-transaction-progress";

interface StatusCardProps {
  status: "pending" | "completed" | "failed";
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
  stage = "payment",
  onboardingTxHash,
  swapTxHash,
}) => {
  // Define icon based on current stage for better consistency with TransactionStageCard
  const getStageIcon = () => {
    switch (stage) {
      case "deposit":
      case "payment":
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case "querying":
        return <ArrowRight className="h-8 w-8 text-blue-400" />;
      case "signing":
        return <Wallet className="h-8 w-8 text-[#AF9EF9]" />;
      case "sending":
      case "swap":
        return <ArrowRight className="h-8 w-8 text-blue-400 rotate-45" />;
      case "completed":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  // Get border color based on stage
  const getStageBorderColor = () => {
    switch (stage) {
      case "deposit":
      case "payment":
        return "border-yellow-200/20";
      case "querying":
        return "border-blue-200/20";
      case "signing":
        return "border-[#AF9EF9]/20";
      case "sending":
      case "swap":
        return "border-blue-200/20";
      case "completed":
        return "border-green-200/20";
      case "failed":
        return "border-red-200/20";
      default:
        return "border-yellow-200/20";
    }
  };

  const stageLabels = {
    deposit: "Waiting for Deposit",
    querying: "Querying Quotes on NEAR Intents",
    signing: "Signing Intent Message",
    sending: "Sending to Recipient",
    payment: "Processing Payment",
    swap: "Executing NEAR Intents Swap",
    completed: "Transaction Complete",
    failed: "Transaction Failed",
  };

  // Stage-specific descriptions
  const stageDescriptions = {
    deposit: "Waiting for deposit to NEAR Intents",
    querying: "Please wait while we query the best rates",
    signing: "Please sign the transaction in your wallet",
    sending: "Your assets are being transferred",
    payment: "Your payment is being processed. This should only take a moment.",
    swap: "Converting your funds through NEAR Intents protocol for best rates.",
    completed: "Your transaction has been completed successfully!",
    failed: "There was an issue processing your transaction.",
  };

  const renderTransactionHash = () => {
    if ((stage === "payment" || stage === "deposit") && onboardingTxHash) {
      return (
        <div className="mt-4">
          <p className="text-xs text-white/60 mb-1">Payment Transaction:</p>
          <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
            {onboardingTxHash}
          </div>
        </div>
      );
    } else if ((stage === "swap" || stage === "sending") && swapTxHash) {
      return (
        <div className="mt-4">
          <p className="text-xs text-white/60 mb-1">Swap Transaction:</p>
          <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
            {swapTxHash}
          </div>
        </div>
      );
    } else if (stage === "completed" && txHash) {
      return (
        <div className="mt-4">
          <p className="text-xs text-white/60 mb-1">Transaction Hash:</p>
          <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
            {txHash}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-5 bg-white/5 min-h-[180px] transition-all duration-500 ease-in-out",
        getStageBorderColor(),
      )}
    >
      <div className="flex items-start">
        <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {getStageIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-2 text-lg text-white">
            {(stage && stageLabels[stage]) || title}
          </h3>
          <p className="text-sm text-white/60 mb-2 min-h-[40px]">
            {(stage && stageDescriptions[stage]) || description}
          </p>

          {renderTransactionHash()}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
