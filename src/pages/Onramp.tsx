
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import StepProgress from '@/components/StepProgress';
import CryptoAsset from '@/components/CryptoAsset';
import OnrampCard from '@/components/OnrampCard';
import ConnectWallet from '@/components/ConnectWallet';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const OnrampPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('100');

  const steps = ["Select Asset", "Connect Wallet", "Choose Onramp", "Complete Payment"];

  const assets = [
    {
      name: "NEAR Protocol",
      symbol: "NEAR",
      logoUrl: "https://cryptologos.cc/logos/near-protocol-near-logo.svg?v=029",
    },
    {
      name: "Aurora",
      symbol: "AURORA",
      logoUrl: "https://cryptologos.cc/logos/aurora-aoa-logo.svg?v=029",
    },
    {
      name: "Octopus Network",
      symbol: "OCT",
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11846.png",
    },
    {
      name: "Ref Finance",
      symbol: "REF",
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11808.png",
    },
  ];

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
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
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select Asset</h2>
            <p className="text-muted-foreground mb-6">Choose the asset you want to purchase</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {assets.map((asset) => (
                <CryptoAsset
                  key={asset.symbol}
                  name={asset.name}
                  symbol={asset.symbol}
                  logoUrl={asset.logoUrl}
                  isSelected={asset.symbol === selectedAsset}
                  onClick={() => handleAssetSelect(asset.symbol)}
                />
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="10"
                className="w-full border border-input rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ping-500"
                placeholder="Enter amount"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Minimum amount: $10.00
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to receive your purchased assets
            </p>
            
            <ConnectWallet onConnect={handleWalletConnect} />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Choose Onramp Method</h2>
            <p className="text-muted-foreground mb-6">Select your preferred payment method</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <OnrampCard
                title="Credit/Debit Card"
                description="Quick and easy, usually processed within minutes. 2-3% transaction fee may apply."
                icon="card"
                provider="Coinbase"
                isSelected={selectedOnramp === "coinbase"}
                onClick={() => handleOnrampSelect("coinbase")}
              />
              <OnrampCard
                title="Bank Transfer"
                description="Lower fees but slower processing time (1-3 business days)."
                icon="wallet"
                provider="MoonPay"
                isSelected={selectedOnramp === "moonpay"}
                onClick={() => handleOnrampSelect("moonpay")}
              />
            </div>
            
            <div className="bg-secondary p-4 rounded-md mb-6">
              <p className="font-medium mb-2">Transaction Details:</p>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span>${amount}.00 USD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Asset:</span>
                <span>{selectedAsset}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Estimated {selectedAsset}:</span>
                <span>{(parseFloat(amount) / 8.12).toFixed(2)} {selectedAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="text-sm">{walletAddress}</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
            <p className="text-muted-foreground mb-6">
              You'll be redirected to {selectedOnramp === "coinbase" ? "Coinbase" : "MoonPay"} to complete your payment
            </p>
            
            <div className="bg-secondary p-4 rounded-md mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span>${amount}.00 USD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Asset:</span>
                <span>{selectedAsset}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="text-sm">{walletAddress}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/transaction">
                <Button 
                  variant="gradient" 
                  size="lg"
                  icon={<ChevronRight className="h-5 w-5" />}
                >
                  Proceed to Payment
                </Button>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ping-50">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-ping-600 text-white font-bold text-xl h-10 w-10 rounded-md flex items-center justify-center mr-2">P</div>
            <span className="text-xl font-bold tracking-tight">Pingpay</span>
          </Link>
        </header>

        <main>
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
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
