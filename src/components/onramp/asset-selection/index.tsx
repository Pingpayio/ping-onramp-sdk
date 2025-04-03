
import React, { useState, useEffect } from 'react';
import AssetSelector from './AssetSelector';
import AmountInput from './AmountInput';
import NetworkBadge from './NetworkBadge';
import PaymentMethod from './PaymentMethod';
import { calculateEstimatedAmount } from './PriceCalculator';

interface AssetSelectionProps {
  selectedAsset: string | null;
  amount: string;
  onAssetSelect: (symbol: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AssetSelection = ({
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen
}: AssetSelectionProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
  
  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    const calculated = calculateEstimatedAmount(selectedAsset, amount);
    setEstimatedAmount(calculated);
  }, [selectedAsset, amount]);

  return (
    <div className="flex flex-col">
      {/* 1. Title section - Buy Crypto */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
      </h2>
      
      {/* 2. USD Input Field */}
      {/* 3. Corresponding Asset Number (when asset is selected) */}
      <div className="mb-4">
        <AmountInput 
          amount={amount}
          onAmountChange={onAmountChange}
          selectedAsset={selectedAsset}
          estimatedAmount={estimatedAmount}
        />
      </div>
      
      {/* 4. Select an Asset */}
      <div className="w-full mb-4">
        {/* Network Badge */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* Asset Selection Card */}
        <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow mt-2">
          <AssetSelector
            selectedAsset={selectedAsset}
            onAssetSelect={onAssetSelect}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </div>
      
      {/* 5. Payment Method Card (Pay with) - moved down and will be rendered in Onramp.tsx */}
      <div className="w-full mb-4">
        <PaymentMethod />
      </div>
      
      {/* 6. Minimum amount text */}
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
