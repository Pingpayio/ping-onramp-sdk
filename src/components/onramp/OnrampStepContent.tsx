import React from 'react';
import AssetSelection from '@/components/onramp/asset-selection';
import TransactionProgress from '@/components/onramp/TransactionProgress';
import OnrampNavigation from '@/components/onramp/OnrampNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionStage } from '@/hooks/use-transaction-progress';
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
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
  walletAddressError?: boolean;

  nearIntentsDepositAddress: string | null;
  currentIntentStage?: TransactionStage;
  intentProgress?: number;
  intentError?: string | null;
  nearIntentsDisplayInfo?: { message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string };
  isWalletAddressValid?: boolean;
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
  selectedCurrency = 'USD',
  onCurrencySelect,
  walletAddressError = false,
  nearIntentsDepositAddress,
  currentIntentStage,
  intentProgress,
  intentError,
  nearIntentsDisplayInfo,
  isWalletAddressValid,
}: OnrampStepContentProps) => {
  const isMobile = useIsMobile();

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
            walletAddressError={walletAddressError}
            nearIntentsDepositAddress={nearIntentsDepositAddress} // Pass down
          />
        );
      case 1:
        // TransactionProgress will now use intent-specific props
        return <div className="flex flex-col items-center h-full">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-4 w-full">
              <h2 className="text-lg md:text-xl font-medium text-white">Processing NEAR Intent</h2>
            </div>
            
            <TransactionProgress
              asset={selectedAsset} // e.g., "USDC"
              amount={amount} // Fiat amount
              walletAddress={walletAddress} // Target NEAR recipient
              currentStage={currentIntentStage}
              progress={intentProgress}
              error={intentError}
              displayInfo={nearIntentsDisplayInfo}
              // TODO: TransactionProgress might need setIntentStage if it has retry logic
            />
          </div>;
      default:
        return null;
    }
  };

  return <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pb-1">
        {renderCurrentStep()}
      </div>
      
      <div className="mt-auto pt-4">
        {/* isProcessingTransaction is now determined by whether it's step 1 (TransactionProgress step) */}
        <OnrampNavigation
          currentStep={currentStep}
          steps={steps}
          handleBack={handleBack}
          handleContinue={handleContinue}
          canContinue={canContinue}
          isProcessingTransaction={currentStep === 1 && !['intent_completed', 'intent_failed'].includes(currentIntentStage || '')}
        />
      </div>
    </div>;
};
export default OnrampStepContent;
