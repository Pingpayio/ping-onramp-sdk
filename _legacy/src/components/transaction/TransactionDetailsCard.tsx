import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionDetailsCardProps {
  amount?: string;
  asset?: string;
  walletAddress?: string;
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  amount,
  asset,
  walletAddress,
}) => {
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardContent className="p-5">
        <h4 className="text-white font-medium mb-2">Transaction Details</h4>
        <div className="space-y-2 text-sm">
          {amount && (
            <div className="flex justify-between">
              <span className="text-white/60">Amount:</span>
              <span className="text-white">${amount} USD</span>
            </div>
          )}
          {asset && (
            <div className="flex justify-between">
              <span className="text-white/60">Asset:</span>
              <span className="text-white">{asset}</span>
            </div>
          )}
          {walletAddress && (
            <div className="flex justify-between">
              <span className="text-white/60">Recipient:</span>
              <span className="text-white/80 text-right max-w-[200px] break-all">
                {walletAddress}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailsCard;
