
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import StepProgress from '@/components/StepProgress';
import OnrampCard from '@/components/OnrampCard';
import ConnectWallet from '@/components/ConnectWallet';
import { ArrowLeft, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const OnrampPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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
      name: "Tether USD",
      symbol: "USDT",
      logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029",
    },
    {
      name: "DAI",
      symbol: "DAI",
      logoUrl: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=029",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029",
    },
    {
      name: "Ripple",
      symbol: "XRP",
      logoUrl: "https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=029",
    },
    {
      name: "Solana",
      symbol: "SOL",
      logoUrl: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      logoUrl: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=029",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      logoUrl: "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=029",
    },
  ];

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
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Asset</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center justify-between w-full border border-input rounded-md p-3 bg-background text-left text-sm font-normal"
                    role="combobox"
                    aria-expanded={open}
                  >
                    {selectedAsset ? (
                      <div className="flex items-center">
                        <img 
                          src={assets.find(a => a.symbol === selectedAsset)?.logoUrl} 
                          alt={selectedAsset} 
                          className="h-6 w-6 mr-2" 
                        />
                        <span>{assets.find(a => a.symbol === selectedAsset)?.name}</span>
                        <span className="ml-2 text-muted-foreground">{selectedAsset}</span>
                      </div>
                    ) : (
                      "Select an asset"
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search for an asset..." />
                    <CommandList>
                      <CommandEmpty>No asset found.</CommandEmpty>
                      <CommandGroup>
                        {assets.map((asset) => (
                          <CommandItem
                            key={asset.symbol}
                            value={asset.name}
                            onSelect={() => handleAssetSelect(asset.symbol)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center">
                              <img src={asset.logoUrl} alt={asset.name} className="h-6 w-6 mr-2" />
                              <span>{asset.name}</span>
                              <span className="ml-2 text-muted-foreground">{asset.symbol}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
