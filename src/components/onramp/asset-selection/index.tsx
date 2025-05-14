
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
      {/* 1. Title section - "Buy Crypto" - reduced margin-bottom */}
      <div className="flex items-center gap-2 mb-2 w-full">
        <DollarSign className="h-5 w-5 text-white" />
        <h2 className="text-xl font-medium text-white">
          {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
        </h2>
      </div>
      
      {/* 2 & 3. Amount input with estimated value - reduced spacing */}
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
        selectedAsset={selectedAsset}
        estimatedAmount={estimatedAmount}
      />
      
      {/* Selection cards with reduced spacing throughout */}
      <div className="w-full space-y-3 mt-1">
        {/* 4. Asset Selection Card with reduced label spacing */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">Select Asset</label>
          <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
            <AssetSelector
              selectedAsset={selectedAsset}
              onAssetSelect={onAssetSelect}
              open={open}
              setOpen={setOpen}
            />
          </div>
        </div>
        
        {/* NetworkBadge with reduced spacing */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* 5. Wallet Address Input with reduced label spacing */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">Recipient Address (e.g. alice.near)</label>
          <WalletAddressInput 
            walletAddress={walletAddress}
            onWalletAddressChange={onWalletAddressChange}
            placeholder="Enter recipient address"
          />
        </div>
        
        {/* 6. Payment Currency dropdown with reduced label spacing */}
        <PaymentCurrency 
          selectedCurrency={selectedCurrency} 
          onCurrencySelect={onCurrencySelect}
        />
        
        {/* 7. Payment Method Card with reduced label spacing */}
        <PaymentMethod />
      </div>
      
      {/* 8. Minimum amount text - positioned with less padding */}
      <p className="text-xs md:text-sm text-muted-foreground mt-auto pt-1">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
