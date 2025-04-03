
import React, { useState, useEffect } from 'react';
import AssetSelector from './AssetSelector';
import AmountInput from './AmountInput';
import NetworkBadge from './NetworkBadge';
import PaymentMethod from './PaymentMethod';
import WalletAddressInput from './WalletAddressInput';
import { calculateEstimatedAmount } from './PriceCalculator';

interface AssetSelectionProps {
  selectedAsset: string | null;
  amount: string;
  onAssetSelect: (symbol: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssetSelection = ({
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen,
  walletAddress,
  onWalletAddressChange
}: AssetSelectionProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
  
  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    const calculated = calculateEstimatedAmount(selectedAsset, amount);
    setEstimatedAmount(calculated);
  }, [selectedAsset, amount]);

  return (
    <div className="flex flex-col items-center space-y-1">
      {/* 1. Title section - "Buy Crypto" - reduced margin */}
      <h2 className="text-lg font-semibold mb-1 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
      </h2>
      
      {/* 2 & 3. Amount input with estimated value */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Selection cards with reduced spacing between items */}
      <div className="w-full space-y-1 mt-0.5">
        {/* Network Badge moved above asset selection with reduced spacing */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* 4. Asset Selection Card with reduced padding */}
        <div className="rounded-lg border p-2 hover:shadow-sm transition-shadow">
          <AssetSelector
            selectedAsset={selectedAsset}
            onAssetSelect={onAssetSelect}
            open={open}
            setOpen={setOpen}
          />
        </div>
        
        {/* 5. Wallet Address Input */}
        <WalletAddressInput 
          walletAddress={walletAddress}
          onWalletAddressChange={onWalletAddressChange}
        />
        
        {/* 6. Payment Method Card */}
        <PaymentMethod />
      </div>
      
      {/* 7. Minimum amount text - increased top margin to push it closer to the bottom buttons */}
      <p className="text-xs text-muted-foreground mt-2 pt-1">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
