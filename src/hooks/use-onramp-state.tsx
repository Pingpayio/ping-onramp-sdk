
import { useState, useEffect } from 'react';
import { useWallet } from './use-wallet-context';
import { toast } from '@/components/ui/use-toast';

export const useOnrampState = () => {
  const { isConnected, walletAddress: connectedWalletAddress } = useWallet();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>("NEAR");
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('100');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  // Updated steps array - removed intermediate steps
  const steps = ["Select Asset", "Transaction"];

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setOpen(false);
  };

  const handleOnrampSelect = (provider: string) => {
    setSelectedOnramp(provider);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setRecipientAddress(address);
    
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
    // Check if wallet is connected before allowing progress from step 0
    if (currentStep === 0 && !isConnected) {
      return; // Don't proceed if wallet is not connected
    }
    
    // Explicitly check for recipient address before proceeding from step 0
    if (currentStep === 0 && (recipientAddress.trim() === '' || !isWalletAddressValid)) {
      return; // Don't proceed if no recipient address or invalid address
    }

    // If on first step, go directly to transaction progress step
    if (currentStep === 0) {
      setIsProcessingTransaction(true);
      // Set default payment provider
      if (!selectedOnramp) {
        setSelectedOnramp("apple");
      }
      setCurrentStep(1); // Move to transaction step
      
      toast({
        title: "Processing Payment",
        description: "Your transaction is being processed...",
      });
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // If processing transaction, cancel it
      if (isProcessingTransaction) {
        setIsProcessingTransaction(false);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0: 
        // Ensure recipient address is provided and valid before allowing to continue
        return !!selectedAsset && 
               recipientAddress.trim() !== '' && // Require a non-empty recipient address
               isWalletAddressValid && 
               parseFloat(amount) >= 10 && 
               isConnected; // Must have wallet connected
      default: return false; // Can't continue beyond transaction screen
    }
  };

  // Handle navigation through step clicking
  const handleStepClick = (stepIndex: number) => {
    // Don't allow navigation while transaction is processing
    if (isProcessingTransaction) return;
    
    // Only allow navigation to steps that have been completed or the current step
    if (stepIndex <= currentStep || 
        (stepIndex === 1 && 
         !!selectedAsset && 
         recipientAddress.trim() !== '' && 
         isWalletAddressValid && 
         parseFloat(amount) >= 10 &&
         isConnected)) {
      setCurrentStep(stepIndex);
    }
  };

  return {
    currentStep,
    selectedAsset,
    open,
    selectedOnramp,
    walletAddress: recipientAddress, // Use the user-entered recipient address
    amount,
    isWalletAddressValid,
    cardNumber,
    selectedCurrency,
    steps,
    isProcessingTransaction,
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
