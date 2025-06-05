import TransactionActionButtons from "@/components/transaction/TransactionActionButtons";
import TransactionContainer from "@/components/transaction/TransactionContainer";
import { generateTransactionHash } from "@/components/transaction/utils/transactionUtils";
import TransactionStatus from "@/components/TransactionStatus";
import {
  TransactionStage,
  useTransactionProgress,
} from "@/hooks/use-transaction-progress";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const Transaction = () => {
  const location = useLocation();
  const { state } = location;

  const { currentStage, progress, error } = useTransactionProgress();

  // Use state data if available, otherwise use default
  const transactionData = state?.txDetails;

  // Generate transaction hashes
  const onboardingTxHash = generateTransactionHash("0x7a");
  const swapTxHash = generateTransactionHash("0x8b");
  const finalTxHash = generateTransactionHash("0x9c");

  // Show toast notifications on stage changes with consistent styling
  useEffect(() => {
    if (currentStage === "querying") {
      toast("Deposit Received", {
        description: "Now querying quotes on NEAR Intents...",
      });
    } else if (currentStage === "signing") {
      toast("Quotes Retrieved", {
        description: "Please sign the transaction message...",
      });
    } else if (currentStage === "sending") {
      toast("Transaction Signed", {
        description: "Now sending your assets...",
      });
    } else if (currentStage === "completed") {
      toast("Transaction Complete", {
        description: `Successfully delivered ${transactionData.amount} ${transactionData.asset} to your wallet.`,
      });
    }
  }, [currentStage, transactionData]);

  // Map transaction stage to status
  const getStatusFromStage = (
    stage: TransactionStage,
  ): "pending" | "completed" | "failed" => {
    switch (stage) {
      case "completed":
        return "completed";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  };

  return (
    <TransactionContainer>
      <div className="flex-1 flex items-center justify-center p-4">
        <TransactionStatus
          status={getStatusFromStage(currentStage)}
          title={
            transactionData.title || `${transactionData.asset} Transaction`
          }
          description={
            transactionData.description ||
            `Processing ${transactionData.amount} ${transactionData.asset} to ${transactionData.walletAddress}`
          }
          txHash={finalTxHash}
          stage={currentStage}
          progress={progress}
          onboardingTxHash={onboardingTxHash}
          swapTxHash={swapTxHash}
          amount={transactionData.amount}
          asset={transactionData.asset}
          walletAddress={transactionData.walletAddress}
        />
      </div>

      <TransactionActionButtons currentStage={currentStage} />
    </TransactionContainer>
  );
};

export default Transaction;
