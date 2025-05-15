
import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import AssetSelector from './AssetSelector';
import AmountInput from './AmountInput';
import NetworkBadge from './NetworkBadge';
import PaymentMethod from './PaymentMethod';
import WalletAddressInput from './WalletAddressInput';
import NearIntentsField from './NearIntentsField';
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
  walletAddressError?: boolean;
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
  onCurrencySelect = () => {},
  walletAddressError = false
}: AssetSelectionProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');

  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    const calculated = calculateEstimatedAmount(selectedAsset, amount);
    setEstimatedAmount(calculated);
  }, [selectedAsset, amount]);

  return (
    <div className="flex flex-col items-center h-full">
      {/* 1. Title section - "Buy Crypto" - better spacing */}
      <div className="flex items-center gap-2 mb-4 w-full">
        <DollarSign className="h-5 w-5 text-white" />
        <h2 className="text-xl font-medium text-white">
          {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
        </h2>
      </div>
      
      {/* 2 & 3. Amount input with estimated value - better spacing */}
      <AmountInput amount={amount} onAmountChange={onAmountChange} selectedAsset={selectedAsset} estimatedAmount={estimatedAmount} />
      
      {/* Selection cards with improved spacing throughout */}
      <div className="w-full space-y-3 mt-0">
        {/* 4. Asset Selection Card */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Select Asset</label>
          <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
            <AssetSelector selectedAsset={selectedAsset} onAssetSelect={onAssetSelect} open={open} setOpen={setOpen} />
          </div>
        </div>
        
        {/* NetworkBadge with better spacing */}
        <NetworkBadge selectedAsset={selectedAsset} />
        
        {/* 5. Wallet Address Input */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Recipient Address (e.g. alice.near)</label>
          <WalletAddressInput 
            walletAddress={walletAddress} 
            onWalletAddressChange={onWalletAddressChange} 
            placeholder="Enter recipient address" 
            isError={walletAddressError}
            errorMessage="Please enter a valid recipient address"
          />
        </div>
        
        {/* Payment Method Card */}
        <PaymentMethod />
        
        {/* NEAR Intents Deposit Address */}
        <NearIntentsField />
      </div>
    </div>
  );
};

export default AssetSelection;
