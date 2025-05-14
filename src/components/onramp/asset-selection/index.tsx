
import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import AssetSelector from './AssetSelector';
import AmountInput from './AmountInput';
import NetworkBadge from './NetworkBadge';
import PaymentMethod from './PaymentMethod';
import PaymentCurrency from './PaymentCurrency';
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
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
}

const AssetSelection = ({
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen,
  walletAddress,
  onWalletAddressChange,
  selectedCurrency = "USD",
  onCurrencySelect = () => {}
}: AssetSelectionProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
  
  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    const calculated = calculateEstimatedAmount(selectedAsset, amount);
    setEstimatedAmount(calculated);
  }, [selectedAsset, amount]);

  return (
    <div className="flex flex-col items-center h-full">
      {/* 1. Title section - "Buy Crypto" - styled to match Onramp History */}
      <div className="flex items-center gap-2 mb-4 w-full">
        <DollarSign className="h-5 w-5 text-white" />
        <h2 className="text-xl font-medium text-white">
          {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
        </h2>
      </div>
      
      {/* 2 & 3. Amount input with estimated value - REDUCED spacing */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Selection cards with titles above each component */}
      <div className="w-full space-y-4 mt-2">
        {/* 4. Asset Selection Card with title */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Select Asset</label>
          <div className="rounded-lg p-2 md:p-3 hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center">
            <AssetSelector
              selectedAsset={selectedAsset}
              onAssetSelect={onAssetSelect}
              open={open}
              setOpen={setOpen}
            />
          </div>
        </div>
        
        {/* NetworkBadge moved here - between Asset Selection and Wallet Address */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* 5. Wallet Address Input with title */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Recipient Address (e.g. alice.near)</label>
          <WalletAddressInput 
            walletAddress={walletAddress}
            onWalletAddressChange={onWalletAddressChange}
            placeholder="Enter recipient address"
          />
        </div>
        
        {/* 6. Payment Currency dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Payment Currency</label>
          <PaymentCurrency 
            selectedCurrency={selectedCurrency} 
            onCurrencySelect={onCurrencySelect}
          />
        </div>
        
        {/* 7. Payment Method Card with title */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Payment Method</label>
          <PaymentMethod />
        </div>
      </div>
      
      {/* 8. Minimum amount text - better positioned */}
      <p className="text-xs md:text-sm text-muted-foreground mt-auto pt-2">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
