import { useState } from "react";
import { useAtomValue } from "jotai";
import { onrampTargetAtom } from "@/state/atoms";
import type { OnrampQuoteResponse } from "@pingpay/onramp-types";
import LoadingSpinner from "../loading-spinner";
import { RateModal } from "../rate-modal";

interface ReceiveAmountDisplayProps {
  estimatedReceiveAmount?: string;
  isQuoteLoading: boolean;
  quoteError?: string;
  depositAmount: string;
  quote?: OnrampQuoteResponse;
}

export function ReceiveAmountDisplay({
  estimatedReceiveAmount,
  isQuoteLoading,
  quoteError,
  depositAmount,
  quote,
}: ReceiveAmountDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onrampTarget = useAtomValue(onrampTargetAtom);

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
          <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center rounded-full bg-white/[0.08] hover:bg-white/5">
            <img
              src={
                onrampTarget.asset === "wNEAR"
                  ? "/near-logo-green.png"
                  : "/usd-coin-usdc-logo.svg"
              }
              alt={`${onrampTarget.asset} Logo`}
              width="20px"
              height="20px"
              className="rounded-full"
            />
            <span className="text-white font-normal">
              {/* {onrampTarget.asset} */}
              NEAR
            </span>
          </div>
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
            src="/near-logo-green.png"
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
