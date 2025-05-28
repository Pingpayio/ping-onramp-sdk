
import React from 'react';
import { calculateEstimatedAmount } from '@/components/onramp/asset-selection/PriceCalculator';

interface TransactionSummaryProps {
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
}

const TransactionSummary = ({
  amount,
  selectedAsset,
  walletAddress
}: TransactionSummaryProps) => {
  // Get estimated amount of tokens using the existing PriceCalculator
  const estimatedAmount = calculateEstimatedAmount(selectedAsset, amount);

  return (
    <div className="bg-secondary p-4 rounded-md mb-6">
      <p className="font-medium mb-2">Transaction Details:</p>
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">Amount:</span>
        <span>${amount} USD</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">Asset:</span>
        <span>{selectedAsset}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-muted-foreground">Estimated {selectedAsset}:</span>
        <span>{estimatedAmount} {selectedAsset}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Recipient:</span>
        <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">{walletAddress}</span>
      </div>
    </div>
  );
};

export default TransactionSummary;
