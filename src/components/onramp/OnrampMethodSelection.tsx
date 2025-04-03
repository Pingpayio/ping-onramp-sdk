
import React from 'react';
import { CreditCard } from 'lucide-react';

interface OnrampMethodSelectionProps {
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
}

// Mock prices for demonstration purposes - in a real app, these would come from an API
const mockPrices: Record<string, number> = {
  USDT: 1,
  USDC: 1,
  DAI: 1,
  BTC: 65000,
  ETH: 3500,
  NEAR: 8.12,
  SOL: 145,
  AVAX: 35,
  DOT: 8.5,
  MATIC: 0.75,
  // Add more tokens as needed
};

const OnrampMethodSelection = ({
  amount,
  selectedAsset,
  walletAddress,
  onOnrampSelect
}: OnrampMethodSelectionProps) => {
  // Calculate estimated token amount
  const getEstimatedAmount = () => {
    if (selectedAsset && amount && !isNaN(parseFloat(amount))) {
      const assetPrice = mockPrices[selectedAsset!] || 1;
      const estimatedTokens = parseFloat(amount) / assetPrice;
      
      // Format based on value - show more decimal places for higher value tokens
      if (assetPrice >= 1000) {
        return estimatedTokens.toFixed(5);
      } else if (assetPrice >= 100) {
        return estimatedTokens.toFixed(4);
      } else {
        return estimatedTokens.toFixed(2);
      }
    }
    return "0";
  };

  // Auto-select the payment method (coinbase in this case)
  React.useEffect(() => {
    onOnrampSelect("coinbase");
  }, [onOnrampSelect]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
        Payment Details
      </h2>
      <p className="text-muted-foreground mb-6 text-center">
        Review your transaction details
      </p>
      
      {/* Static payment method card */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-secondary p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-ping-600" />
          </div>
          <div>
            <p className="font-medium">Credit/Debit Card</p>
            <p className="text-sm text-muted-foreground">Processed by Coinbase</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Quick and easy payment method. Transaction usually processed within minutes. A 2-3% transaction fee may apply.
        </p>
      </div>
      
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
          <span>{getEstimatedAmount()} {selectedAsset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recipient:</span>
          <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">{walletAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default OnrampMethodSelection;
