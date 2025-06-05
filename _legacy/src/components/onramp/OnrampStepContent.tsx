import React from "react";
import AssetSelection from "@/components/onramp/asset-selection";
import TransactionProgress from "@/components/onramp/TransactionProgress";
import OnrampNavigation from "@/components/onramp/OnrampNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IntentProgress } from "@/types/onramp";

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
  handleBack: () => void;
  handleContinue: () => void;
  canContinue: () => boolean;
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
  walletAddressError?: boolean;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;

  nearIntentsDepositAddress: string | null;
  intentProgress?: IntentProgress;
  errorMessage?: string | null;
  nearIntentsDisplayInfo?: {
    message?: string;
    amountIn?: number;
    amountOut?: number;
    explorerUrl?: string;
    error?: string;
  };
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
  handleBack,
  handleContinue,
  canContinue,
  selectedCurrency = "USD",
  onCurrencySelect,
  walletAddressError = false,
  nearIntentsDepositAddress,
  intentProgress,
  errorMessage,
  nearIntentsDisplayInfo,
  isWalletAddressValid,
  paymentMethod,
  onPaymentMethodChange,
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
            nearIntentsDepositAddress={nearIntentsDepositAddress}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
          />
        );
      case 1:
        // TransactionProgress will now use intent-specific props
        return (
          <div className="flex flex-col items-center h-full">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-4 w-full">
              <h2 className="text-lg md:text-xl font-medium text-white">
                Processing NEAR Intent
              </h2>
            </div>

            <TransactionProgress
              asset={selectedAsset}
              amount={amount}
              walletAddress={walletAddress}
              intentProgress={intentProgress}
              error={errorMessage}
              displayInfo={nearIntentsDisplayInfo}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentlyProcessing =
    currentStep === 1 &&
    intentProgress &&
    !["form", "none", "done", "error"].includes(intentProgress);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pb-1">
        {renderCurrentStep()}
      </div>

      <div className="mt-auto pt-4">
        <OnrampNavigation
          currentStep={currentStep}
          steps={steps}
          handleBack={handleBack}
          handleContinue={handleContinue}
          canContinue={canContinue}
          isProcessingTransaction={isCurrentlyProcessing}
        />
      </div>
    </div>
  );
};
export default OnrampStepContent;
