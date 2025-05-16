
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet-context';
import { toast } from '@/components/ui/use-toast';
import { useTransactionProgress, TransactionStage } from '../hooks/use-transaction-progress';
import { useSearchParams } from 'react-router-dom';
import {
  generateDepositAddress,
  assetNetworkAdapter,
  IntentsUserId,
  SupportedChainName,
  type BaseTokenInfo,
  type UnifiedTokenInfo,
} from 'near-intents-sdk';

import { processNearIntentWithdrawal } from '@/lib/ping-onramp-sdk';
import { useTokenList } from './use-token-list';
import { LIST_TOKENS } from '@/utils/tokens';


export const useOnrampState = () => {
  const { isConnected, walletAddress: connectedWalletAddress, signMessageAsync } = useWallet() as unknown as { isConnected: boolean; walletAddress: string | null; signMessageAsync: (message: string) => Promise<string>; };
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string | null>("USDC"); // Default to USDC
  const [open, setOpen] = useState(false);
  const [selectedOnramp, setSelectedOnramp] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('10'); // Fiat amount
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [walletAddressError, setWalletAddressError] = useState(false);

  const [nearIntentsDepositAddress, setNearIntentsDepositAddress] = useState<string | null>(null); // EVM deposit address
  const [nearIntentsDisplayInfo, setNearIntentsDisplayInfo] = useState<{ message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string }>({});

  const {
    currentStage: currentIntentStage,
    progress: intentProgress,
    error: intentError,
    setStage: setIntentStage,
    setError: setIntentError,
  } = useTransactionProgress({ initialStage: 'confirming_evm_deposit' });

  const [searchParams, setSearchParams] = useSearchParams();
  const masterTokenList = useTokenList(LIST_TOKENS);

  const steps = ["Select Asset", "Transaction"];

  useEffect(() => {
    if (connectedWalletAddress) {
      const fetchDepositAddress = async () => {
        try {
          const chain = assetNetworkAdapter['base' as SupportedChainName];
          if (!chain) {
            console.error("Unsupported chain for deposit address generation: base");
            setIntentError("Internal config error: Unsupported EVM chain.");
            return;
          }
          const intentsUserId = connectedWalletAddress.toLowerCase() as IntentsUserId;
          const depositAddr = await generateDepositAddress(intentsUserId, chain);
          setNearIntentsDepositAddress(depositAddr);
        } catch (err) {
          console.error("Failed to generate NEAR Intents deposit address:", err);
          setIntentError("Failed to prepare for NEAR transaction. Please try again.");
        }
      };
      fetchDepositAddress();
    } else {
      setNearIntentsDepositAddress(null);
    }
  }, [connectedWalletAddress, setIntentError]);

  useEffect(() => {
    const intentAction = searchParams.get("intentAction");
    if (intentAction === "withdrawNear" && connectedWalletAddress && signMessageAsync && masterTokenList.length > 0) {
      processNearIntentWithdrawal({
        urlParams: searchParams,
        connectedWalletAddress,
        signMessageAsync,
        fiatAmount: amount, // Use the current amount state
        setIntentStage,
        setIntentError,
        setNearIntentsDisplayInfo,
        setCurrentStepForPage: setCurrentStep,
        toastFn: toast,
        masterTokenList,
      });
      
      // Attempt to clear processed search params to prevent re-triggering on refresh
      // This might cause a re-render; test carefully.
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("intentAction");
      newSearchParams.delete("asset");
      newSearchParams.delete("amount");
      newSearchParams.delete("recipient");
      setSearchParams(newSearchParams, { replace: true });

    }
  }, [searchParams, setSearchParams, connectedWalletAddress, signMessageAsync, masterTokenList, amount, setIntentStage, setIntentError, setCurrentStep, toast]);


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
    const isValidNear = address.trim().endsWith('.near') || /^[0-9a-fA-F]{64}$/.test(address.trim());
    setIsWalletAddressValid(isValidNear);
    if (address.trim() !== '') {
      setWalletAddressError(!isValidNear);
    } else {
      setWalletAddressError(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleContinue = () => {
    if (!isConnected) {
      toast({ title: "Wallet Not Connected", description: "Please connect your wallet to continue.", variant: "destructive" });
      return;
    }

    if (!recipientAddress.trim() || !isWalletAddressValid) {
      setWalletAddressError(true);
      toast({ title: "Invalid NEAR Address", description: "Please enter a valid NEAR recipient address (e.g., alice.near or a 64-character hex ID).", variant: "destructive" });
      return;
    }
    if (!nearIntentsDepositAddress) {
      toast({ title: "Processing Error", description: "Unable to get deposit address for NEAR transaction. Please wait or try again.", variant: "destructive" });
      return;
    }
    if (parseFloat(amount) < 1) { // Example minimum
        toast({ title: "Amount Too Low", description: "Minimum amount is $1.", variant: "destructive" });
        return;
    }

    setWalletAddressError(false);
    // Construct the onramp URL
    // This needs to be your actual onramp provider's URL generation logic
    // Example: Coinbase Onramp URL
    // const onrampProviderUrl = `https://pay.coinbase.com/buy?appId=YOUR_APP_ID&destinationWallets=[{"address":"${nearIntentsDepositAddress}","assets":["USDC"],"blockchains":["base"]}]&partnerUserId=${connectedWalletAddress}&presetCryptoAmount=${amount}&redirectUrl=${encodeURIComponent(window.location.origin + window.location.pathname + `?intentAction=withdrawNear&asset=${selectedAsset}&amount=${amount}&recipient=${recipientAddress}`)}`;
    
    // SIMULATED Onramp URL - REPLACE WITH ACTUAL
    const redirectUrlForIntent = `${window.location.origin}${window.location.pathname}?intentAction=withdrawNear&asset=${selectedAsset}&amount=${amount}&recipient=${recipientAddress}`; // Use unified recipientAddress
    const onrampProviderUrl = `https://onramp.example.com/pay?asset=USDC&network=base&amount=${amount}&address=${nearIntentsDepositAddress}&partnerUserId=${connectedWalletAddress}&redirectUrl=${encodeURIComponent(redirectUrlForIntent)}`;
    
    toast({ title: "Redirecting to Onramp", description: "You will be redirected to complete your purchase." });
    console.log("Redirecting to onramp provider:", onrampProviderUrl);
    window.location.href = onrampProviderUrl; // Redirect to onramp provider
  };

  const handleBack = () => {
    // If currentStep is 1 (TransactionProgress), going back means resetting the intent state
    // and going to step 0 (AssetSelection).
    if (currentStep === 1) {
      setIntentStage('confirming_evm_deposit'); // Reset intent stage
      setNearIntentsDisplayInfo({});
      setIntentError(null);
      // Potentially clear searchParams related to intents if they are still there
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    if (currentStep === 0) {
      if (!isConnected) return false;
      // Conditions for NEAR intents flow
      return !!selectedAsset &&
             recipientAddress.trim() !== '' &&
             isWalletAddressValid &&
             parseFloat(amount) >= 1 && // Example minimum
             !!nearIntentsDepositAddress;
    }
    // Cannot continue from transaction progress step (step 1) using this button
    // as it's an automated flow or has its own controls.
    return false;
  };

  const handleStepClick = (stepIndex: number) => {
    // Prevent navigation if an intent is actively processing (currentStep is 1)
    // unless the intent is completed or failed.
    if (currentStep === 1 && !['intent_completed', 'intent_failed'].includes(currentIntentStage)) {
        return;
    }

    if (stepIndex <= currentStep || (stepIndex === 1 && canContinue())) { // Simplified condition
      setCurrentStep(stepIndex);
    }
  };

  return {
    currentStep,
    selectedAsset,
    open,
    setOpen,
    selectedOnramp, 
    walletAddress: recipientAddress, // This is the target NEAR address
    amount,
    isWalletAddressValid, // Validity of the target NEAR address
    selectedCurrency,
    steps,
    walletAddressError,
    
    // Event Handlers
    handleAssetSelect,
    handleOnrampSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCurrencySelect,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,

    nearIntentsDepositAddress, // EVM deposit address
    currentIntentStage,
    intentProgress,
    intentError,
    nearIntentsDisplayInfo,
    setIntentStage, 
    // initiateNearIntentProcessing is no longer part of this hook's direct return
  };
};
