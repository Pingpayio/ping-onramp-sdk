
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import StepProgress from '@/components/StepProgress';
import { ArrowLeft } from 'lucide-react';
import AssetSelection from '@/components/onramp/asset-selection';
import WalletConnectionStep from '@/components/onramp/WalletConnectionStep';
import OnrampMethodSelection from '@/components/onramp/OnrampMethodSelection';
import PaymentCompletion from '@/components/onramp/PaymentCompletion';
import { useIsMobile } from '@/hooks/use-mobile';

const OnrampPage = () => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('100');

  const steps = ["Select Asset", "Connect Wallet", "Payment Details", "Complete Payment"];

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setOpen(false);
  };

  const handleOnrampSelect = (provider: string) => {
    setSelectedOnramp(provider);
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
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

  // For step 2 (Payment Details), automatically set the provider to "coinbase"
  useEffect(() => {
    if (currentStep === 2 && !selectedOnramp) {
      setSelectedOnramp("coinbase");
    }
  }, [currentStep, selectedOnramp]);

  const canContinue = () => {
    switch (currentStep) {
      case 0: return !!selectedAsset;
      case 1: return !!walletAddress;
      case 2: return !!selectedOnramp;
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AssetSelection
            selectedAsset={selectedAsset}
            amount={amount}
            onAssetSelect={handleAssetSelect}
            onAmountChange={handleAmountChange}
            open={open}
            setOpen={setOpen}
          />
        );
      case 1:
        return (
          <WalletConnectionStep
            onConnect={handleWalletConnect}
          />
        );
      case 2:
        return (
          <OnrampMethodSelection
            selectedOnramp={selectedOnramp}
            onOnrampSelect={handleOnrampSelect}
            amount={amount}
            selectedAsset={selectedAsset}
            walletAddress={walletAddress}
          />
        );
      case 3:
        return (
          <PaymentCompletion
            amount={amount}
            selectedAsset={selectedAsset}
            walletAddress={walletAddress}
            selectedOnramp={selectedOnramp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ping-50">
      <div className={`container mx-auto px-4 py-8 md:py-12 ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-ping-600 text-white font-bold text-lg md:text-xl h-8 w-8 md:h-10 md:w-10 rounded-md flex items-center justify-center mr-2">P</div>
            <span className="text-lg md:text-xl font-bold tracking-tight">Pingpay</span>
          </Link>
        </header>

        <main>
          <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
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
                  Home
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
        </main>
      </div>
    </div>
  );
};

export default OnrampPage;
