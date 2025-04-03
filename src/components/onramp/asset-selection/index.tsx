
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
    <div className="flex flex-col items-center">
      {/* 1. Title section - reduced margin */}
      <h2 className="text-lg md:text-xl font-semibold mb-1 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
      </h2>
      
      {/* 2. Amount input with estimated value */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Moved NetworkBadge above the selection cards and reduced spacing */}
      {selectedAsset && <NetworkBadge selectedAsset={selectedAsset} />}
      
      {/* Selection cards with tighter spacing */}
      <div className="w-full space-y-1.5 mt-1">
        {/* 4. Asset Selection Card */}
        <div className="rounded-lg border p-2.5 md:p-3.5 hover:shadow-sm transition-shadow">
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
      
      {/* 7. Minimum amount text */}
      <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-auto pt-1">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
