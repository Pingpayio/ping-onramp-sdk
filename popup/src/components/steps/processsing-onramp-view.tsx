import type { OnrampResult } from "../../../../src/internal/communication/messages";
import { Progress } from "../ui/progress";
import Header from "../header";
import { FaClock } from "react-icons/fa";
import { StepInfoBox, type StepBox } from "../step-info-box";

export interface ProcessingOnrampProps {
  step: number;
  result?: OnrampResult | null;
  stepBoxes?: StepBox[];
  details?: {
    amount?: string;
    asset?: string;
    network?: string;
    recipient?: string;
    received?: string;
    fee?: string;
  };
}

export function ProcessingOnramp({
  step,
  //   result,
  stepBoxes,
  details,
}: ProcessingOnrampProps) {
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // Default transaction details
  const defaultDetails = {
    amount: "$100 USD",
    asset: "NEAR",
    network: "NEAR",
    recipient: "jayythew.near",
    received: "",
    fee: "",
  };

  // Default step-specific info box data
  const defaultStepBoxes: StepBox[] = [
    {
      icon: <FaClock className="text-yellow-400 text-xl" />,
      title: "Waiting for Deposit",
      desc: "Waiting for the 100 NEAR Onramp deposit to the NEAR Intents Network.",
      color: "border-[#FFFFFF2E]",
    },
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <rect
            width="28"
            height="28"
            rx="8"
            fill="#A18AFF"
            fillOpacity="0.12"
          />
          <path
            d="M8.5 10.5A2.5 2.5 0 0 1 11 8h6a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 17 20h-6a2.5 2.5 0 0 1-2.5-2.5v-7Z"
            stroke="#A18AFF"
            strokeWidth="1.5"
          />
          <path
            d="M11.5 13.5h5M11.5 16h5"
            stroke="#A18AFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Signing Intent Message",
      desc: "Sign the message in your wallet to send 100 NEAR to the desired recipient address.",
      color: "border-[#A18AFF]",
    },
    {
      icon: <FaClock className="text-yellow-400 text-xl" />,
      title: "Processing Transaction",
      desc: "Processing your transaction on the NEAR Intents Network. This may take a few moments.",
      color: "border-[#FFFFFF2E]",
    },
    {
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <rect
            width="28"
            height="28"
            rx="8"
            fill="#34D399"
            fillOpacity="0.12"
          />
          <path
            d="M10.5 14.5l2 2 5-5"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Transaction Complete",
      desc: "Onramp Complete! Your funds have been delivered.",
      color: "border-[#34D399]",
    },
  ];

  const usedStepBoxes = stepBoxes || defaultStepBoxes;
  const usedDetails = { ...defaultDetails, ...details };
  const box = usedStepBoxes[Math.min(step, usedStepBoxes.length - 1)];

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
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      {/* Step-specific info box */}
      <StepInfoBox box={box} />
      {/* Transaction Details */}
      <div className="w-full flex flex-col gap-2 bg-[#232228] border border-[#FFFFFF2E] rounded-lg p-4">
        <span className="font-semibold text-gray-100 mb-2">
          Transaction Details
        </span>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Onramp Amount:</span>
            <span className="text-gray-100">{usedDetails.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Asset:</span>
            <span className="text-gray-100">{usedDetails.asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-gray-100">{usedDetails.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Recipient:</span>
            <span className="text-gray-100">{usedDetails.recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Received:</span>
            <span className="text-gray-100">{usedDetails.received}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Fee:</span>
            <span className="text-gray-100">{usedDetails.fee}</span>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 mt-6">
        <button className="flex-1 py-4! h-auto! px-8! rounded-full! bg-white text-[#3D315E] font-semibold hover:bg-gray-200 transition-all duration-300 ease-in-out text-base!">
          Return Home
        </button>
        <button className="flex-1 py-4! h-auto! px-8! rounded-full! bg-[#AB9FF2] text-[#3D315E] font-semibold hover:bg-[#8B6DF6] transition-all duration-300 ease-in-out text-base!">
          View on Explorer
        </button>
      </div>
    </div>
  );
}
