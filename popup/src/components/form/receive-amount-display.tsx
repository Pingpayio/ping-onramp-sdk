import type { TargetAsset } from "@pingpay/onramp-sdk";
import type { OnrampQuoteResponse } from "@pingpay/onramp-types";
import { useState } from "react";
import LoadingSpinner from "../loading-spinner";
import { RateModal } from "../rate-modal";

interface ReceiveAmountDisplayProps {
  estimatedReceiveAmount?: string;
  isQuoteLoading: boolean;
  quoteError?: string;
  depositAmount: string;
  quote?: OnrampQuoteResponse;
  onrampTarget: TargetAsset;
  onAssetClick?: () => void;
}

export function ReceiveAmountDisplay({
  estimatedReceiveAmount,
  isQuoteLoading,
  quoteError,
  depositAmount,
  quote,
  onrampTarget,
  onAssetClick,
}: ReceiveAmountDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate dynamic exchange rate
  const calculateExchangeRate = () => {
    if (
      !estimatedReceiveAmount ||
      !depositAmount ||
      quoteError ||
      isQuoteLoading
    ) {
      return null;
    }

    const receiveAmountFloat = parseFloat(estimatedReceiveAmount);
    const depositAmountFloat = parseFloat(depositAmount);

    if (receiveAmountFloat > 0 && depositAmountFloat > 0) {
      const rate = receiveAmountFloat / depositAmountFloat;
      return rate.toFixed(4); // Show 4 decimal places for precision
    }

    return null;
  };

  const exchangeRate = calculateExchangeRate();

  return (
    <div className="w-full border gap-2 flex flex-col border-white/[0.18] rounded-[8px] bg-white/5">
      <div className="w-full p-4 gap-2 flex flex-col">
        <p>You Receive (Estimated)</p>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            {isQuoteLoading ? (
              <LoadingSpinner size="xs" inline={true} />
            ) : (
              <p className="font-bold border-none text-[24px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                {quoteError
                  ? "-"
                  : estimatedReceiveAmount
                    ? parseFloat(estimatedReceiveAmount).toFixed(6)
                    : "-"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onAssetClick}
            className="border gap-2 border-white/[0.18]! px-3! py-2! flex items-center rounded-full! bg-white/[0.08]! hover:bg-white/5! cursor-pointer transition-colors"
          >
            <img
              src={
                onrampTarget.asset.toLowerCase() === "wnear"
                  ? "/near-logo-green.png"
                  : onrampTarget.asset.toLowerCase() === "sui"
                    ? "/sui-logo.svg" // Note: This file needs to be added to the public directory
                    : "/usd-coin-usdc-logo.svg"
              }
              alt={`${onrampTarget.asset} Logo`}
              width="20px"
              height="20px"
              className="rounded-full"
            />
            <span className="text-white font-normal">{onrampTarget.asset}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="6"
              viewBox="0 0 11 6"
              fill="none"
            >
              <path
                d="M1.36963 1L5.36963 5L9.36963 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="h-[2px] -mt-1 -mb-2 w-full bg-white/5" />
      <div className="flex items-center justify-between ">
        <div className="py-2 px-4">
          <p className="text-[#FFFFFF99] text-xs">
            {exchangeRate ? (
              <>
                Rate:{" "}
                <button
                  className="px-0! hover:border-0! border-0! hover:underline hover:underline-offset-2 text-[#AB9FF2] inline-block cursor-pointer hover:text-[#AF9EF9] transition-colors"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  type="button"
                >
                  1 USD ≈ {exchangeRate} {onrampTarget.asset}
                </button>
              </>
            ) : (
              <>
                Rate: <span className="text-[#FFFFFF99]">-</span>
              </>
            )}
          </p>
        </div>
        <div className="py-2 gap-1 px-4 flex shrink-0 items-center justify-end text-[#FFFFFF99] text-xs">
          <p>Network:</p>
          <img
            src={
              onrampTarget.chain.toLowerCase() === "near"
                ? "/near-logo-green.png"
                : onrampTarget.chain.toLowerCase() === "sui"
                  ? "/sui-logo.svg" // Note: This file needs to be added to the public directory
                  : "/near-logo-green.png" // Fallback to NEAR logo if unknown
            }
            alt={`${onrampTarget.chain} Protocol Logo`}
            className="w-4 h-4 rounded-full"
          />
          <span>{onrampTarget.chain}</span>
        </div>
      </div>

      {quote && (
        <RateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          quote={quote}
          asset={onrampTarget.asset}
        />
      )}
    </div>
  );
}
