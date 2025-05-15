import React from 'react';
import AssetSelection from '@/components/onramp/asset-selection';
import OnrampMethodSelection from '@/components/onramp/OnrampMethodSelection';
import PaymentCompletion from '@/components/onramp/PaymentCompletion';
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
  onCurrencySelect
}: OnrampStepContentProps) => {
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AssetSelection
            selectedAsset={selectedAsset}
            amount={amount}
            onAssetSelect={onAssetSelect}
            onAmountChange={onAmountChange}
            open={open}
            setOpen={setOpen}
            walletAddress={walletAddress}
            onWalletAddressChange={onWalletAddressChange}
            selectedCurrency={selectedCurrency}
            onCurrencySelect={onCurrencySelect}
          />
        );
      case 1:
        return (
          <OnrampMethodSelection
            selectedOnramp={selectedOnramp}
            onOnrampSelect={onOnrampSelect}
            amount={amount}
            selectedAsset={selectedAsset}
            walletAddress={walletAddress}
            onCardNumberChange={onCardNumberChange}
          />
        );
      case 2:
        return (
          <PaymentCompletion
            amount={amount}
            selectedAsset={selectedAsset}
            walletAddress={walletAddress}
            selectedOnramp={selectedOnramp}
            cardNumber={cardNumber}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content section with adjusted spacing to prevent scrolling */}
      <div className="flex-grow overflow-auto min-h-0 pb-1">
        {renderCurrentStep()}
      </div>
      
      {/* Keeping navigation buttons position fixed */}
      <div className="mt-auto pt-4">
        <OnrampNavigation
          currentStep={currentStep}
          steps={steps}
          handleBack={handleBack}
          handleContinue={handleContinue}
          canContinue={canContinue}
        />
      </div>
    </div>
  );
};

export default OnrampStepContent;
