
import { useState, useEffect } from 'react';
import { useWallet } from './use-wallet-context';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

export const useOnrampState = () => {
  const { isConnected, walletAddress: connectedWalletAddress } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>("NEAR");
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>("coinbase");
  const [amount, setAmount] = useState<string>('100');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  // Updated steps array - removed Payment Details and Complete Payment
  const steps = ["Select Asset", "Transaction"];

  // Check URL parameters for Coinbase redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionStatus = queryParams.get('status');
    
    // If we have a status parameter, we've returned from Coinbase
    if (transactionStatus) {
      if (transactionStatus === 'success') {
        // Move to transaction step
        setCurrentStep(1);
        setIsProcessingTransaction(true);
        toast({
          title: "Payment Successful",
          description: "Your payment was processed successfully. Initiating transaction...",
        });
      } else if (transactionStatus === 'canceled') {
        // Stay on first step
        toast({
          title: "Payment Canceled",
          description: "Your payment was canceled. Please try again.",
        });
      }
      
      // Remove query parameters from URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setOpen(false);
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

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  // Generate Coinbase redirect URL
  const generateCoinbaseRedirectUrl = () => {
    // In a real implementation, this would be the actual Coinbase URL with proper params
    const baseUrl = 'https://pay.coinbase.com/buy';
    const appReturnUrl = `${window.location.origin}${window.location.pathname}?status=success`;
    const cancelUrl = `${window.location.origin}${window.location.pathname}?status=canceled`;
    
    // Creating mock URL - in production this would use Coinbase's actual parameters
    const redirectUrl = `${baseUrl}?asset=${selectedAsset}&amount=${amount}&currency=${selectedCurrency}&wallet=${recipientAddress}&appReturnUrl=${encodeURIComponent(appReturnUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`;
    
    return redirectUrl;
  };

  const redirectToCoinbase = () => {
    const redirectUrl = generateCoinbaseRedirectUrl();
    
    // Log for debugging in development
    console.log("Redirecting to:", redirectUrl);
    
    // In production, use actual redirect to Coinbase
    // For development, simulate redirect and return
    if (process.env.NODE_ENV === 'production') {
      window.location.href = redirectUrl;
    } else {
      // For development/demo, simulate redirect and immediate return with success
      toast({
        title: "Redirecting to Coinbase",
        description: "In production, you would be redirected to Coinbase Pay.",
      });
      
      // Simulate redirect and return after a delay
      setTimeout(() => {
        navigate(`${location.pathname}?status=success`, { replace: true });
      }, 1500);
    }
  };

  const handleContinue = () => {
    // Check if wallet is connected before allowing progress
    if (currentStep === 0 && !isConnected) {
      return; // Don't proceed if wallet is not connected
    }
    
    // Explicitly check for recipient address before proceeding from step 0
    if (currentStep === 0 && (recipientAddress.trim() === '' || !isWalletAddressValid)) {
      return; // Don't proceed if no recipient address or invalid address
    }

    if (currentStep === 0) {
      // Instead of going to next step, redirect to Coinbase
      redirectToCoinbase();
      return;
    }
    
    // If on transaction step and transaction is complete, we're done
    if (currentStep === 1 && !isProcessingTransaction) {
      // Transaction is done, no more steps
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // If processing transaction, cancel it
      if (isProcessingTransaction) {
        setIsProcessingTransaction(false);
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0: 
        // Ensure recipient address is provided and valid before allowing to continue
        return !!selectedAsset && 
               recipientAddress.trim() !== '' && 
               isWalletAddressValid && 
               parseFloat(amount) >= 10 && 
               isConnected;
      case 1: return !isProcessingTransaction; // Can't continue if already processing
      default: return true;
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
    walletAddress: recipientAddress,
    amount,
    isWalletAddressValid,
    selectedCurrency,
    steps,
    isProcessingTransaction,
    handleAssetSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCurrencySelect,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,
    setOpen,
    redirectToCoinbase
  };
};
