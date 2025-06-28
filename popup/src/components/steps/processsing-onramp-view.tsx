import type { OnrampResult } from "../../../../src/internal/communication/messages";
import { Progress } from "../ui/progress";
import Header from "../header";
import { FaClock, FaSpinner, FaCheckCircle } from "react-icons/fa"; // Added FaSpinner, FaCheckCircle
import { StepInfoBox, type StepBox } from "../step-info-box";
import { Button } from "../ui/button";
import {
  useNearIntentsDisplayInfo,
  useOneClickStatus,
} from "../../state/hooks"; // Added hooks
import type { StatusResponseData } from "../../lib/one-click-api";

// This 'step' prop from App.tsx now maps to broader phases:
// 0: "initiating-onramp-service" (Getting 1Click quote, redirecting to Coinbase)
// 1: (Not directly used by 1Click, was "signing-transaction") - Can be skipped or merged
// 2: "processing-transaction" (Submitting deposit to 1Click, polling status)
// 3: "complete"
export interface ProcessingOnrampProps {
  step: number; // Main step from App.tsx
  result?: OnrampResult | null; // For the "complete" step
}

// Helper to map 1Click status to a progress percentage and StepBox
const getDisplayInfoForStatus = (
  oneClickStatus?: StatusResponseData | null,
  nearIntentsDisplayInfo?: { message?: string; explorerUrl?: string },
): {
  progress: number;
  box: StepBox;
  detailsForDisplay: Record<string, string | undefined>;
} => {
  let progress = 10; // Default starting progress
  let box: StepBox = {
    icon: <FaSpinner className="animate-spin text-blue-400 text-xl" />,
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
          icon: <FaClock className="text-yellow-400 text-xl" />,
          title: "Pending Onramp Deposit",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Waiting for funds to be deposited by Coinbase to the 1Click address.",
          color: "border-yellow-400",
        };
        break;
      case "KNOWN_DEPOSIT_TX":
        progress = 50;
        box = {
          icon: <FaSpinner className="animate-spin text-blue-400 text-xl" />,
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
          icon: <FaSpinner className="animate-spin text-indigo-400 text-xl" />,
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
          icon: <FaCheckCircle className="text-green-400 text-xl" />,
          title: "Transaction Complete",
          desc:
            nearIntentsDisplayInfo?.message ||
            "Swap successful! Your funds have been delivered.",
          color: "border-green-400",
        };
        detailsForDisplay.explorerLink =
          oneClickStatus.swapDetails?.destinationChainTxHashes?.[0]
            ?.explorerUrl || nearIntentsDisplayInfo?.explorerUrl;
        break;
      case "REFUNDED":
      case "FAILED":
      case "EXPIRED":
        progress = 100; // Or a specific error progress
        box = {
          icon: <FaClock className="text-red-400 text-xl" />, // Consider a specific error icon
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

export function ProcessingOnramp({
  step, // Main step from App.tsx
  result, // For the "complete" step from OnrampResult
}: ProcessingOnrampProps) {
  const [oneClickStatus] = useOneClickStatus();
  const [nearIntentsDisplayInfo] = useNearIntentsDisplayInfo();

  // Determine overall progress and current display based on App.tsx step and 1Click status
  let displayProgress = 10;
  let displayBox: StepBox;
  let transactionDetails: Record<string, string | undefined> = {};

  if (step === 3 && result?.success) {
    // "complete" step
    displayProgress = 100;
    displayBox = {
      icon: <FaCheckCircle className="text-green-400 text-xl" />,
      title: "Transaction Complete",
      desc: result.message || "Onramp and swap successful!",
      color: "border-green-400",
    };
    transactionDetails.transactionId = result.data?.transactionId;
    transactionDetails.service = result.data?.service;
    transactionDetails.explorerLink = nearIntentsDisplayInfo.explorerUrl; // From final success in App.tsx
    transactionDetails.amountIn = nearIntentsDisplayInfo.amountIn?.toString();
    transactionDetails.amountOut = nearIntentsDisplayInfo.amountOut?.toString();
  } else if (step === 0) {
    // "initiating-onramp-service"
    displayProgress = 15;
    displayBox = {
      icon: <FaSpinner className="animate-spin text-blue-400 text-xl" />,
      title: "Initiating Onramp",
      desc:
        nearIntentsDisplayInfo.message ||
        "Preparing your onramp with Coinbase...",
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
      icon: <FaSpinner className="animate-spin text-gray-400 text-xl" />,
      title: "Processing...",
      desc: nearIntentsDisplayInfo.message || "Please wait.",
      color: "border-gray-400",
    };
    transactionDetails.statusMessage = nearIntentsDisplayInfo.message;
  }

  return (
    <div className="min-h-screen md:min-h-auto flex flex-col items-center h-full">
      <Header title="Processing Onramp" />
      <div className="w-full mt-4 mb-4">
        <div className="flex flex-col gap-2 bg-[#232228] border border-[#FFFFFF2E] rounded-lg p-4">
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

      <div className="w-full flex flex-col gap-2 bg-[#232228] border border-[#FFFFFF2E] rounded-lg p-4 mt-4">
        <span className="font-semibold text-gray-100 mb-2">
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

      {transactionDetails.explorerLink && (
        <div className="flex w-full gap-4 mt-6">
          <Button
            className="flex-1 w-full py-4! h-auto! px-8! rounded-full! bg-[#AB9FF2] text-[#3D315E] font-semibold hover:bg-[#8B6DF6] transition-all duration-300 ease-in-out text-base!"
            onClick={() =>
              window.open(transactionDetails.explorerLink, "_blank")
            }
          >
            View on Explorer
          </Button>
        </div>
      )}
    </div>
  );
}
