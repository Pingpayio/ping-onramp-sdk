
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
    <div className="flex flex-col items-center">
      {/* Title section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Select Asset'}
      </h2>
      
      {/* Amount input with estimated value */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Selection cards for asset, network and payment method */}
      <div className="w-full space-y-3 mt-4 md:mt-6">
        {/* Network Badge */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* Asset Selection Card */}
        <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
          <AssetSelector
            selectedAsset={selectedAsset}
            onAssetSelect={onAssetSelect}
            open={open}
            setOpen={setOpen}
          />
        </div>
        
        {/* Payment Method Card */}
        <PaymentMethod />
      </div>
      
      <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
