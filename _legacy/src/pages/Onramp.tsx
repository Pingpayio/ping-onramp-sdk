import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import OnrampHeader from "@/components/onramp/OnrampHeader";
import OnrampStepContent from "@/components/onramp/OnrampStepContent";
import { useOnrampState } from "@/hooks/use-onramp-state";
import SidebarNav from "@/components/SidebarNav";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
// import { History } from 'lucide-react';

const OnrampPage = () => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    selectedAsset,
    open,
    walletAddress,
    amount,
    selectedCurrency,
    steps,
    walletAddressError,
    isWalletAddressValid,
    nearIntentsDepositAddress,
    intentProgress,
    errorMessage,
    nearIntentsDisplayInfo,
    paymentMethod,
    handleAssetSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCurrencySelect,
    handleContinue,
    handleBack,
    canContinue,
    setOpen,
    handlePaymentMethod,
  } = useOnrampState();

  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* Only show sidebar on tablet and larger */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      <div
        className={`flex-1 ${isMobile ? "ml-0 pt-[54px]" : "md:ml-[256px]"}`}
      >
        <div
          className={`px-4 pt-2 md:px-[56px] md:py-[40px] flex flex-col h-full`}
        >
          <OnrampHeader />

          <main
            className={`flex-1 flex ${isMobile || window.innerWidth < 1280 ? "flex-col" : "lg:flex-row"} gap-4 md:gap-6 mt-4 ${isMobile ? "pb-4" : ""} half-screen-optimize`}
          >
            {/* Left container - maintains consistent size across steps on desktop, full width on mobile */}
            <div className="bg-white/5 rounded-xl shadow-sm p-4 md:p-6 flex-1 flex flex-col w-full lg:max-w-[640px] lg:min-w-[640px] border border-white/[0.16]">
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
                handleBack={handleBack}
                handleContinue={handleContinue}
                canContinue={canContinue}
                selectedCurrency={selectedCurrency}
                onCurrencySelect={handleCurrencySelect}
                walletAddressError={walletAddressError}
                nearIntentsDepositAddress={nearIntentsDepositAddress}
                intentProgress={intentProgress}
                errorMessage={errorMessage}
                nearIntentsDisplayInfo={nearIntentsDisplayInfo}
                isWalletAddressValid={isWalletAddressValid}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={handlePaymentMethod}
              />
            </div>

            {/* Right container for future history or other content */}
            {/* 
            <div className="bg-white/5 rounded-xl shadow-sm p-4 md:p-6 flex flex-col w-full lg:w-[400px] lg:min-w-[400px] border border-white/[0.16]">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-white" />
                <h3 className="text-xl font-medium text-white">Onramp History</h3>
              </div>
              <div className="text-white/50 text-center py-8">
                <p>Transaction history will be shown here.</p>
              </div>
            </div>
            */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OnrampPage;
