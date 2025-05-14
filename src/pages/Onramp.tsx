
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import OnrampHeader from '@/components/onramp/OnrampHeader';
import OnrampStepContent from '@/components/onramp/OnrampStepContent';
import { useOnrampState } from '@/hooks/use-onramp-state';
import SidebarNav from '@/components/SidebarNav';

const OnrampPage = () => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    selectedAsset,
    open,
    selectedOnramp,
    walletAddress,
    amount,
    cardNumber,
    steps,
    handleAssetSelect,
    handleOnrampSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCardNumberChange,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,
    setOpen
  } = useOnrampState();

  return (
    <div className="flex h-screen bg-[#121212] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-[256px]">
        <div className="px-[56px] py-[40px] flex flex-col h-full">
          <OnrampHeader />

          <main className="flex-1 flex gap-6 overflow-hidden mt-4">
            {/* Left container - Onramp container (existing) */}
            <div className="bg-white/5 rounded-xl shadow-sm p-3 flex-1 overflow-hidden flex flex-col max-w-[640px]">
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
                cardNumber={cardNumber}
                onCardNumberChange={handleCardNumberChange}
              />
            </div>
            
            {/* Right container - New additional container */}
            <div className="bg-white/5 rounded-xl shadow-sm p-6 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-xl font-medium text-white mb-4">Transaction Information</h3>
              <div className="text-white/70 space-y-3">
                <p>This area can contain supplementary information related to your transaction.</p>
                <p>You might want to include:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Transaction history</li>
                  <li>Market data</li>
                  <li>Asset information</li>
                  <li>Support resources</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OnrampPage;
