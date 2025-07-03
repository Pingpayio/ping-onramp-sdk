import type { OnrampQuoteResponse } from "@pingpay/onramp-types";
import { Logo } from "./logo";
import { Button } from "./ui/button";

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: OnrampQuoteResponse;
  asset: string;
}

export function RateModal({ isOpen, onClose, quote, asset }: RateModalProps) {
  if (!isOpen) return null;

  const { fees, swapQuote } = quote;
  const {
    maxSlippage,
    networkFee,
    providerFee,
    pingpayFee,
    totalFee,
    swapFee,
  } = fees;
  const exchangeRate = (1 / parseFloat(swapQuote.quote.amountOutUsd)).toFixed(
    2,
  );
  const route = "via 1Click";

  return (
    <div className="fixed flex-col inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="w-full max-w-full h-full bg-[#1E1E1E] rounded-lg">
        {/* Header */}

        <div className="relative w-full px-4 pt-4">
          <div className="flex items-center justify-between">
            <a
              href="https://pingpay.io"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Logo />
            </a>
            <h3 className=" font-bold text-[24px]">Onramp Rate</h3>
            <Button
              onClick={onClose}
              className="p-0! hover:border-0! border-0!"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.1836 1.14453L1.18359 13.1445M1.18359 1.14453L13.1836 13.1445"
                  stroke="#AF9EF9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content Card */}
        <div className="p-4">
          <div className="border border-white/[0.18] rounded-[8px] bg-white/5 p-4">
            <h3 className="font-medium text-white mb-3">Breakdown</h3>

            <div className="space-y-3">
              {/* Pricing Rate */}
              <div className="flex text-sm justify-between items-center">
                <span className=" text-white/60">Pricing Rate</span>
                <span className="text-white">
                  1 {asset} ≈ {exchangeRate} USD
                </span>
                {/* TODO: need asset price */}
              </div>

              {/* Max Slippage */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Max Slippage</span>
                <span className="text-white">{maxSlippage}</span>
              </div>

              {/* Route */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Route</span>
                <span className="text-white">{route}</span>
              </div>

              {/* Separator */}
              <div className="h-px bg-white/10 my-3"></div>

              {/* Network Fee */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Network Fee</span>
                <span className="text-white">${networkFee}</span>
              </div>

              {/* Coinbase Fee */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Provider Fee</span>
                <span className="text-white">${providerFee}</span>
              </div>

              {/* Swap Fee */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Swap Fee</span>
                <span className="text-white">${swapFee}</span>
              </div>

              {/* Pingpay Fee */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white/60">Pingpay Fee</span>
                <span className="text-white">${pingpayFee}</span>
              </div>

              {/* Total Fee */}
              <div className="flex text-sm justify-between items-center">
                <span className="text-white">Total Fees</span>
                <span className="text-white">${totalFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
