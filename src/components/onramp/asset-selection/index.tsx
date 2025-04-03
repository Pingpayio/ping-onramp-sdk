
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
      {/* 1. Title section - "Buy Crypto" */}
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
      </h2>
      
      {/* 2 & 3. Amount input with estimated value */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Selection cards in the specified order */}
      <div className="w-full space-y-2 mt-2 md:mt-3">
        {/* Network Badge moved above asset selection */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* 4. Asset Selection Card */}
        <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
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
      <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-5">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
