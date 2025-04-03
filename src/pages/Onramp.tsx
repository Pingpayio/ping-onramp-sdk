
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StepProgress from '@/components/StepProgress';
import OnrampHeader from '@/components/onramp/OnrampHeader';
import OnrampStepContent from '@/components/onramp/OnrampStepContent';
import { useOnrampState } from '@/hooks/use-onramp-state';

const OnrampPage = () => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    selectedAsset,
    open,
    selectedOnramp,
    walletAddress,
    amount,
    steps,
    handleAssetSelect,
    handleOnrampSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,
    setOpen
  } = useOnrampState();

  return (
    <div className="h-screen bg-gradient-to-b from-white to-ping-50 flex flex-col overflow-hidden">
      <div className={`container mx-auto px-3 py-3 flex flex-col h-full ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
        <OnrampHeader />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-2">
            <StepProgress 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
              allowNavigation={true}
            />
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-3 flex-1 overflow-hidden flex flex-col">
            <OnrampStepContent
              currentStep={currentStep}
              steps={steps}
              selectedAsset={selectedAsset}
              amount={amount}
              onAssetSelect={handleAssetSelect}
              onAmountChange={handleAmountChange}
              open={open}
              setOpen={setOpen}
              walletAddress={walletAddress}
              onWalletAddressChange={handleWalletAddressChange}
              selectedOnramp={selectedOnramp}
              onOnrampSelect={handleOnrampSelect}
              handleBack={handleBack}
              handleContinue={handleContinue}
              canContinue={canContinue}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnrampPage;
