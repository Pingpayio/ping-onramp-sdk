import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TransactionDetailsCardProps {
  amount: string;
  asset: string | null;
  walletAddress: string;
  network?: string;
  isCompleted?: boolean;
  displayInfo?: {
    message?: string;
    amountIn?: number;
    amountOut?: number;
    explorerUrl?: string;
    error?: string;
  };
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  amount,
  asset,
  walletAddress,
  network = "NEAR Protocol",
  isCompleted = false,
  displayInfo = {},
}) => {
  const [showValues, setShowValues] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => setShowValues(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowValues(false);
    }
  }, [isCompleted]);

  const onrampAmountDisplay = displayInfo.amountIn
    ? `${displayInfo.amountIn.toFixed(2)} USD`
    : `${amount} USD`;
  const assetDisplay = asset || "USDC";

  const receivedAmount = displayInfo.amountOut;

  return (
    <Card className="bg-white/5 border border-white/10 p-5">
      <h4 className="text-sm text-white mb-3">Transaction Details</h4>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Onramp Amount:</span>
          <span className="text-white">{onrampAmountDisplay}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Asset:</span>
          <span className="text-white">{assetDisplay}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Network:</span>
          <span className="text-white">{network}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Recipient:</span>
          <span className="text-white break-all text-right max-w-[200px]">
            {walletAddress}
          </span>
        </div>

        {/* Received Amount - Shown when completed */}
        <div className="flex justify-between">
          <span className="text-white/60">Received:</span>
          <span
            className={cn(
              "text-white font-semibold transition-opacity duration-500",
              showValues && receivedAmount !== undefined
                ? "opacity-100"
                : "opacity-0",
            )}
          >
            {showValues && receivedAmount !== undefined
              ? `${receivedAmount.toFixed(4)} ${assetDisplay}`
              : "--"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetailsCard;
