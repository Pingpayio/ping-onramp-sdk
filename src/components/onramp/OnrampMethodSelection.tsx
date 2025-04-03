
import React from 'react';
import OnrampCard from '@/components/OnrampCard';

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
  selectedOnramp,
  onOnrampSelect,
  amount,
  selectedAsset,
  walletAddress
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose Onramp Method</h2>
      <p className="text-muted-foreground mb-6">Select your preferred payment method</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <OnrampCard
          title="Credit/Debit Card"
          description="Quick and easy, usually processed within minutes. 2-3% transaction fee may apply."
          icon="card"
          provider="Coinbase"
          isSelected={selectedOnramp === "coinbase"}
          onClick={() => onOnrampSelect("coinbase")}
        />
        <OnrampCard
          title="Bank Transfer"
          description="Lower fees but slower processing time (1-3 business days)."
          icon="wallet"
          provider="MoonPay"
          isSelected={selectedOnramp === "moonpay"}
          onClick={() => onOnrampSelect("moonpay")}
        />
      </div>
      
      <div className="bg-secondary p-4 rounded-md mb-6">
        <p className="font-medium mb-2">Transaction Details:</p>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Amount:</span>
          <span>${amount}.00 USD</span>
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
          <span className="text-sm">{walletAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default OnrampMethodSelection;
