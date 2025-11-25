import type { StatusResponseData } from "@/lib/one-click-api";
import { useAtom } from "jotai";
import {
  nearIntentsDisplayInfoAtom,
  oneClickStatusAtom,
  type NearIntentsDisplayInfo,
} from "@/state/atoms";
import type { OnrampResult } from "@pingpay/onramp-types";
import { FaCheckCircle, FaClock, FaRegClock, FaSpinner } from "react-icons/fa";
import Header from "../header";
import { StepInfoBox, type StepBox } from "../step-info-box";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export interface ProcessingOnrampProps {
  step: number;
  result?: OnrampResult | null;
}

const getDisplayInfoForStatus = (
  oneClickStatus?: StatusResponseData | null,
  nearIntentsDisplayInfo?: NearIntentsDisplayInfo,
): {
  progress: number;
  box: StepBox;
  detailsForDisplay: Record<string, string | undefined>;
} => {
  let progress = 10;
  let box: StepBox = {
    icon: <FaSpinner className="animate-spin text-blue-400 text-[32px]" />,
    title: "Initiating...",
    desc: nearIntentsDisplayInfo?.message || "Preparing your onramp and swap.",
    color: "border-blue-400",
  };
  const detailsForDisplay: Record<string, string | undefined> = {
    statusMessage: nearIntentsDisplayInfo?.message,
    explorerLink: nearIntentsDisplayInfo?.explorerUrl,
  };

  if (oneClickStatus) {
    detailsForDisplay.amountIn =
      oneClickStatus.quoteResponse.quote.amountInFormatted;
    detailsForDisplay.amountOut =
      oneClickStatus.quoteResponse.quote.amountOutFormatted;
    detailsForDisplay.originAsset =
      oneClickStatus.quoteResponse.quoteRequest.originAsset; // This is assetId
    detailsForDisplay.destinationAsset =
      oneClickStatus.quoteResponse.quoteRequest.destinationAsset; // This is assetId
    detailsForDisplay.recipient =
      oneClickStatus.quoteResponse.quoteRequest.recipient;
    detailsForDisplay.depositAddress =
      oneClickStatus.quoteResponse.quote.depositAddress;

    switch (oneClickStatus.status) {
      case "PENDING_DEPOSIT":
        progress = 25;
        box = {
          icon: <FaRegClock className="text-indigo-400 text-[32px]" />,
          title: "Pending Onramp Deposit",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Waiting for funds to be deposited by Onramp to the 1Click address.",
          color: "border-indigo-400",
        };
        break;
      case "KNOWN_DEPOSIT_TX":
        progress = 50;
        box = {
          icon: (
            <FaSpinner className="animate-spin text-blue-400 text-[32px]" />
          ),
          title: "Processing Deposit",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Deposit detected. 1Click is now processing the swap.",
          color: "border-blue-400",
        };
        break;
      case "PROCESSING":
        progress = 75;
        box = {
          icon: (
            <FaSpinner className="animate-spin text-indigo-400 text-[32px]" />
          ),
          title: "Swap in Progress",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Your swap is being processed by 1Click. This may take a few moments.",
          color: "border-indigo-400",
        };
        break;
      case "SUCCESS":
        progress = 100;
        box = {
          icon: <FaCheckCircle className="text-green-400 text-[32px]" />,
          title: "Transaction Complete",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Swap successful! Your funds have been delivered.",
          color: "border-green-400",
        };
        // Use Near Intents explorer URL (set by polling hook) or construct from depositAddress
        detailsForDisplay.explorerLink =
          nearIntentsDisplayInfo?.explorerUrl ||
          (oneClickStatus.quoteResponse.quote.depositAddress
            ? `https://explorer.near-intents.org/transactions/${oneClickStatus.quoteResponse.quote.depositAddress}`
            : undefined);
        break;
      case "REFUNDED":
      case "FAILED":
      case "EXPIRED":
        progress = 100; // Or a specific error progress
        box = {
          icon: <FaClock className="text-red-400 text-[32px]" />, // Consider a specific error icon
          title: `Swap ${oneClickStatus.status}`,
          desc:
            nearIntentsDisplayInfo?.message ||
            `The swap ${oneClickStatus.status.toLowerCase()}. Please check details or contact support.`,
          color: "border-red-400",
        };
        break;
      default:
        // For unhandled or initial states before status is known
        box.desc =
          nearIntentsDisplayInfo?.message || "Waiting for status updates...";
    }
  } else if (nearIntentsDisplayInfo?.message) {
    // If no 1Click status yet, but we have a message from App.tsx (e.g., "Requesting quote...")
    box.desc = nearIntentsDisplayInfo.message;
  }

  return { progress, box, detailsForDisplay };
};

export function ProcessingOnramp({ step, result }: ProcessingOnrampProps) {
  const [oneClickStatus] = useAtom(oneClickStatusAtom);
  const [nearIntentsDisplayInfo] = useAtom(nearIntentsDisplayInfoAtom);

  // Determine overall progress and current display based on App.tsx step and 1Click status
  let displayProgress = 10;
  let displayBox: StepBox;
  let transactionDetails: Record<string, string | undefined> = {};

  if (step === 3 && result) {
    displayProgress = 100;
    displayBox = {
      icon: <FaCheckCircle className="text-green-400 text-[32px]" />,
      title: "Transaction Complete",
      desc: "Onramp and swap successful!",
      color: "border-green-400",
    };
    // Transaction details from NearIntentsDisplayInfo and result
    transactionDetails.explorerLink = nearIntentsDisplayInfo.explorerUrl;
    transactionDetails.amountIn = nearIntentsDisplayInfo.amountIn?.toString();
    transactionDetails.amountOut = nearIntentsDisplayInfo.amountOut?.toString();
    transactionDetails.asset = result.asset;
    transactionDetails.network = result.network;
    transactionDetails.recipient = result.recipient;
  } else if (step === 0) {
    // "initiating-onramp-service"
    displayProgress = 15;
    displayBox = {
      icon: <FaSpinner className="animate-spin text-blue-400 text-[32px]" />,
      title: "Initiating Onramp",
      desc: nearIntentsDisplayInfo.message || "Preparing your onramp...",
      color: "border-blue-400",
    };
    transactionDetails.statusMessage = nearIntentsDisplayInfo.message;
  } else if (step === 2) {
    // "processing-transaction" - main 1Click polling phase
    const statusDerivedInfo = getDisplayInfoForStatus(
      oneClickStatus,
      nearIntentsDisplayInfo,
    );
    displayProgress = statusDerivedInfo.progress;
    displayBox = statusDerivedInfo.box;
    transactionDetails = {
      ...transactionDetails,
      ...statusDerivedInfo.detailsForDisplay,
    };
  } else {
    // Default/fallback or other steps
    displayBox = {
      icon: <FaSpinner className="animate-spin text-gray-400 text-[32px]" />,
      title: "Processing...",
      desc: nearIntentsDisplayInfo.message || "Please wait.",
      color: "border-gray-400",
    };
    transactionDetails.statusMessage = nearIntentsDisplayInfo.message;
  }

  return (
    <div className="flex flex-col items-center h-full">
      <Header title="Processing Onramp" />
      <div className="w-full mt-4 mb-4">
        <div className="flex flex-col gap-2.5 bg-[#303030] border border-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-white">
              Transaction Progress
            </span>
            <span className="text-base font-medium text-white">
              {Math.round(displayProgress)}%
            </span>
          </div>
          <Progress value={displayProgress} className="h-2" />
        </div>
      </div>

      <StepInfoBox box={displayBox} />

      <div className="w-full flex flex-col gap-2 bg-[#303030] border border-white/20 rounded-lg p-4 mt-4">
        <span className="font-semibold text-sm text-gray-100">
          Transaction Details
        </span>
        <div className="flex flex-col gap-1 text-sm">
          {transactionDetails.statusMessage && !oneClickStatus?.status && (
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-gray-100">
                {transactionDetails.statusMessage}
              </span>
            </div>
          )}
          {transactionDetails.originAsset && (
            <div className="flex justify-between">
              <span className="text-gray-400">From Asset ID:</span>
              <span className="text-gray-100 truncate max-w-[180px]">
                {transactionDetails.originAsset}
              </span>
            </div>
          )}
          {transactionDetails.amountIn && (
            <div className="flex justify-between">
              <span className="text-gray-400">Amount In:</span>
              <span className="text-gray-100">
                {transactionDetails.amountIn}
              </span>
            </div>
          )}
          {transactionDetails.destinationAsset && (
            <div className="flex justify-between">
              <span className="text-gray-400">To Asset ID:</span>
              <span className="text-gray-100 truncate max-w-[180px]">
                {transactionDetails.destinationAsset}
              </span>
            </div>
          )}
          {transactionDetails.amountOut && (
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Amount Out:</span>
              <span className="text-gray-100">
                {transactionDetails.amountOut}
              </span>
            </div>
          )}
          {transactionDetails.depositAddress && (
            <div className="flex justify-between">
              <span className="text-gray-400">Deposit Address:</span>
              <span className="text-gray-100">
                {transactionDetails.depositAddress}
              </span>
            </div>
          )}
          {transactionDetails.recipient && (
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient:</span>
              <span className="text-gray-100 truncate max-w-[180px]">
                {transactionDetails.recipient}
              </span>
            </div>
          )}
          {transactionDetails.transactionId && (
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-gray-100 truncate max-w-[180px]">
                {transactionDetails.transactionId}
              </span>
            </div>
          )}
          {transactionDetails.service && (
            <div className="flex justify-between">
              <span className="text-gray-400">Service:</span>
              <span className="text-gray-100">
                {transactionDetails.service}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-white/60 py-2">
        {step === 3 && result
          ? "Transaction complete, you can now close this window."
          : "Do not close this window, transaction is being processed."}
      </p>

      {transactionDetails.explorerLink && (
        <div className="flex w-full gap-4 mt-6">
          <Button
            className="flex-1 w-full px-8 h-[58px] rounded-full bg-[#AB9FF2] text-[#3D315E] font-semibold hover:bg-[#8B6DF6] transition-all duration-300 ease-in-out text-base disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              transactionDetails.explorerLink &&
              window.open(transactionDetails.explorerLink, "_blank")
            }
            disabled={!transactionDetails.explorerLink}
          >
            View on Explorer
          </Button>
        </div>
      )}
    </div>
  );
}
