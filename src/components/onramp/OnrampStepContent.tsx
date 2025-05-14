
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
  canContinue: () => boolean; // Ensuring this is typed as a function
  cardNumber?: string;
  onCardNumberChange?: (cardNumber: string) => void;
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
  onCardNumberChange
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
      <div className="flex-grow overflow-auto">
        {renderCurrentStep()}
      </div>
      <OnrampNavigation
        currentStep={currentStep}
        steps={steps}
        handleBack={handleBack}
        handleContinue={handleContinue}
        canContinue={canContinue}
      />
    </div>
  );
};

export default OnrampStepContent;
