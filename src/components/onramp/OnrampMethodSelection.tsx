
import React from 'react';
import OnrampCard from '@/components/OnrampCard';

interface OnrampMethodSelectionProps {
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
}

const OnrampMethodSelection = ({
  selectedOnramp,
  onOnrampSelect,
  amount,
  selectedAsset,
  walletAddress
}: OnrampMethodSelectionProps) => {
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
          <span>{(parseFloat(amount) / 8.12).toFixed(2)} {selectedAsset}</span>
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
