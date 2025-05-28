
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
  nearIntentsDepositAddress: string | null;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
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
  selectedCurrency = 'USD',
  onCurrencySelect, 
  walletAddressError = false,
  nearIntentsDepositAddress,
  paymentMethod,
  onPaymentMethodChange
}: AssetSelectionProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');

  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    const calculated = calculateEstimatedAmount(selectedAsset, amount);
    setEstimatedAmount(calculated);
  }, [selectedAsset, amount]);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex items-center gap-2 mb-4 w-full">
        <DollarSign className="h-5 w-5 text-white" />
        <h2 className="text-xl font-medium text-white">
          {selectedAsset ? `Buy ${selectedAsset}` : 'Buy Crypto'}
        </h2>
      </div>
      
      <AmountInput 
        amount={amount} 
        onAmountChange={onAmountChange} 
        selectedAsset={selectedAsset} 
        estimatedAmount={estimatedAmount}
        selectedCurrency={selectedCurrency} // Pass down
        onCurrencySelect={onCurrencySelect} // Pass down
      />
      
      <div className="w-full space-y-3 mt-0 mobile-stacked-form">
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">Select Asset</label>
          <div className="rounded-lg hover:shadow-sm transition-shadow h-[42px] flex items-center">
            <AssetSelector selectedAsset={selectedAsset} onAssetSelect={onAssetSelect} open={open} setOpen={setOpen} />
          </div>
        </div>
        
        <NetworkBadge selectedAsset={selectedAsset} />
        
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2">NEAR Recipient Address (e.g., alice.near)</label>
          <WalletAddressInput
            walletAddress={walletAddress}
            onWalletAddressChange={onWalletAddressChange}
            placeholder="Enter .near recipient address"
            isError={walletAddressError}
            errorMessage="Please enter a valid NEAR recipient address (e.g. alice.near or 64-char hex)"
          />
          <p className="text-xs text-white/50 mt-1 px-1">
            Funds will be on-ramped and then bridged to this NEAR address.
          </p>
        </div>
        
        <PaymentMethod selectedMethod={paymentMethod} onMethodSelect={onPaymentMethodChange} />
        
        <NearIntentsField depositAddress={nearIntentsDepositAddress} />
      </div>
    </div>
  );
};

export default AssetSelection;
