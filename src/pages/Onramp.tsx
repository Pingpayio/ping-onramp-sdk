
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import StepProgress from '@/components/StepProgress';
import { ArrowLeft } from 'lucide-react';
import AssetSelection from '@/components/onramp/asset-selection';
import OnrampMethodSelection from '@/components/onramp/OnrampMethodSelection';
import PaymentCompletion from '@/components/onramp/PaymentCompletion';
import { useIsMobile } from '@/hooks/use-mobile';

const OnrampPage = () => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('100');
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);

  // Updated steps array - removed "Connect Wallet"
  const steps = ["Select Asset", "Payment Details", "Complete Payment"];

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setOpen(false);
  };

  const handleOnrampSelect = (provider: string) => {
    setSelectedOnramp(provider);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    
    // Validate wallet address
    const isNearAddress = address.trim().endsWith('.near');
    const isStandardAddress = address.length >= 42;
    setIsWalletAddressValid(isNearAddress || isStandardAddress);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // For step 1 (Payment Details), set the default provider to "apple" instead of "coinbase"
  useEffect(() => {
    if (currentStep === 1 && !selectedOnramp) {
      setSelectedOnramp("apple");
    }
  }, [currentStep, selectedOnramp]);

  const canContinue = () => {
    switch (currentStep) {
      case 0: 
        // Make sure all fields in step 1 are filled and wallet address is valid
        return !!selectedAsset && 
               isWalletAddressValid && 
               parseFloat(amount) >= 10; // Ensure minimum amount is met
      case 1: return !!selectedOnramp;
      default: return true;
    }
  };

  // Handle navigation through step clicking
  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to steps that have been completed or the current step
    if (stepIndex <= currentStep || (stepIndex === 1 && !!selectedAsset && isWalletAddressValid && parseFloat(amount) >= 10)) {
      setCurrentStep(stepIndex);
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between pt-4 mt-auto">
        {currentStep > 0 ? (
          <Button
            variant="outline"
            onClick={handleBack}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        ) : (
          <Link to="/">
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
        )}
        
        {currentStep < steps.length - 1 && (
          <Button
            variant="gradient"
            onClick={handleContinue}
            disabled={!canContinue()}
            withArrow
            className={isMobile ? "w-1/2" : ""}
          >
            Continue
          </Button>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <AssetSelection
              selectedAsset={selectedAsset}
              amount={amount}
              onAssetSelect={handleAssetSelect}
              onAmountChange={handleAmountChange}
              open={open}
              setOpen={setOpen}
              walletAddress={walletAddress}
              onWalletAddressChange={handleWalletAddressChange}
            />
            {renderNavigationButtons()}
          </>
        );
      case 1:
        return (
          <>
            <OnrampMethodSelection
              selectedOnramp={selectedOnramp}
              onOnrampSelect={handleOnrampSelect}
              amount={amount}
              selectedAsset={selectedAsset}
              walletAddress={walletAddress}
            />
            {renderNavigationButtons()}
          </>
        );
      case 2:
        return (
          <>
            <PaymentCompletion
              amount={amount}
              selectedAsset={selectedAsset}
              walletAddress={walletAddress}
              selectedOnramp={selectedOnramp}
            />
            {renderNavigationButtons()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-white to-ping-50 flex flex-col overflow-hidden">
      <div className={`container mx-auto px-3 py-3 flex flex-col h-full ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
        <header className="flex justify-between items-center mb-2">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
              alt="Ping Logo" 
              className="h-7 md:h-8" 
            />
          </Link>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-2">
            <StepProgress 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
              allowNavigation={true}
            />
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-3 mb-2 flex-1 overflow-auto">
            {renderStepContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnrampPage;
