
import { useState, useEffect } from 'react';

export const useOnrampState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>("NEAR");
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('100');
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

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

  const handleCardNumberChange = (cardNum: string) => {
    setCardNumber(cardNum);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
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

  return {
    currentStep,
    selectedAsset,
    open,
    selectedOnramp,
    walletAddress,
    amount,
    isWalletAddressValid,
    cardNumber,
    selectedCurrency,
    steps,
    handleAssetSelect,
    handleOnrampSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCardNumberChange,
    handleCurrencySelect,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,
    setOpen
  };
};
