import React from 'react';
import AssetSelection from '@/components/onramp/asset-selection';
import TransactionProgress from '@/components/onramp/TransactionProgress';
import OnrampNavigation from '@/components/onramp/OnrampNavigation';
interface OnrampStepContentProps {
  currentStep: number;
  steps: string[];
  selectedAsset: string | null;
  amount: string;
  onAssetSelect: (symbol: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  handleBack: () => void;
  handleContinue: () => void;
  canContinue: () => boolean;
  cardNumber?: string;
  onCardNumberChange?: (cardNumber: string) => void;
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
  isProcessingTransaction?: boolean;
  walletAddressError?: boolean;
}
const OnrampStepContent = ({
  currentStep,
  steps,
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen,
  walletAddress,
  onWalletAddressChange,
  selectedOnramp,
  onOnrampSelect,
  handleBack,
  handleContinue,
  canContinue,
  cardNumber = '',
  onCardNumberChange,
  selectedCurrency = 'USD',
  onCurrencySelect,
  isProcessingTransaction = false,
  walletAddressError = false
}: OnrampStepContentProps) => {
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <AssetSelection selectedAsset={selectedAsset} amount={amount} onAssetSelect={onAssetSelect} onAmountChange={onAmountChange} open={open} setOpen={setOpen} walletAddress={walletAddress} onWalletAddressChange={onWalletAddressChange} selectedCurrency={selectedCurrency} onCurrencySelect={onCurrencySelect} walletAddressError={walletAddressError} />;
      case 1:
        return <div className="flex flex-col items-center h-full">
            {/* Title section - same as in AssetSelection */}
            <div className="flex items-center gap-2 mb-4 w-full">
              <h2 className="text-xl font-medium text-white">Processing Your Transaction</h2>
            </div>
            
            {/* Transaction progress container with same height as asset selection form */}
            <TransactionProgress asset={selectedAsset} amount={amount} walletAddress={walletAddress} />
          </div>;
      default:
        return null;
    }
  };
  return <div className="flex flex-col h-full">
      {/* Content section with adjusted spacing for consistent appearance */}
      <div className="flex-grow overflow-auto pb-1">
        {renderCurrentStep()}
      </div>
      
      {/* Navigation buttons with consistent styling */}
      
    </div>;
};
export default OnrampStepContent;