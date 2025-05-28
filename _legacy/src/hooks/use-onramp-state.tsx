import {
  assetNetworkAdapter,
  generateDepositAddress,
  IntentsUserId,
  SupportedChainName,
} from "near-intents-sdk";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { processNearIntentWithdrawal } from "@/lib/ping-onramp-sdk";
import { LIST_TOKENS } from "@/utils/tokens";
import { toast } from "sonner";
import { useTokenList } from "./use-token-list";
import { useAccount, useSignMessage } from "wagmi";
import { generateOnrampURL } from "@/utils/rampUtils";
import type { IntentProgress, CallbackParams } from "@/types/onramp";

export const useOnrampState = () => {
  const {
    isConnected,
    address: evmAddress,
  } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string>("USDC");
  const [open, setOpen] = useState(false);
  const [fiatAmount, setFiatAmount] = useState<string>("10");
  const [nearRecipientAddress, setNearRecipientAddress] = useState<string>("");
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [nearIntentsDepositAddress, setNearIntentsDepositAddress] = useState<string | null>(null);

  const [intentProgressActual, setIntentProgressActual] = useState<IntentProgress>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nearIntentsDisplayInfo, setNearIntentsDisplayInfo] = useState<{
    message?: string;
    amountIn?: number;
    amountOut?: number;
    explorerUrl?: string;
  }>({});

  const [searchParams, setSearchParams] = useSearchParams();
  const masterTokenList = useTokenList(LIST_TOKENS);

  const steps = ["Select Asset", "Transaction"];

  useEffect(() => {
    if (evmAddress) {
      const fetchDepositAddress = async () => {
        try {
          setIntentProgressActual("generating_url");
          const chain = assetNetworkAdapter["base" as SupportedChainName];
          if (!chain) {
            console.error("Unsupported chain for deposit address generation: base");
            setErrorMessage("Internal config error: Unsupported EVM chain.");
            setIntentProgressActual("error");
            return;
          }
          const intentsUserId = evmAddress.toLowerCase() as IntentsUserId;
          const depositAddr = await generateDepositAddress(intentsUserId, chain);
          setNearIntentsDepositAddress(depositAddr);
          if (intentProgressActual === "generating_url") {
            setIntentProgressActual("form");
          }
        } catch (err) {
          console.error("Failed to generate NEAR Intents deposit address:", err);
          setErrorMessage("Failed to prepare for NEAR transaction. Please try again.");
          setIntentProgressActual("error");
        }
      };
      fetchDepositAddress();
    } else {
      setNearIntentsDepositAddress(null);
      if (intentProgressActual !== "form" && intentProgressActual !== "none" && currentStep === 0) {
        setIntentProgressActual("form");
      }
    }
  }, [evmAddress, intentProgressActual]);

  useEffect(() => {
    const params: CallbackParams = {
      type: searchParams.get('type') ?? undefined,
      action: searchParams.get('action') ?? undefined,
      network: searchParams.get('network') ?? undefined,
      asset: searchParams.get('asset') ?? undefined,
      amount: searchParams.get('amount') ?? undefined,
      recipient: searchParams.get('recipient') ?? undefined,
    };

    if (
      params.type === 'intents' &&
      params.action === 'withdraw' &&
      params.network === 'near' &&
      params.asset === 'USDC' &&
      params.amount &&
      params.recipient &&
      evmAddress &&
      signMessageAsync &&
      masterTokenList.length > 0
    ) {
      setCurrentStep(1);
      setIntentProgressActual("depositing");

      const requiredCallbackParams: Required<CallbackParams> = {
        type: params.type,
        action: params.action,
        network: params.network,
        asset: params.asset,
        amount: params.amount,
        recipient: params.recipient,
      };

      const handleSignMessage = async (args: { message: string }): Promise<`0x${string}`> => {
        if (!evmAddress) {
          const errMsg = "EVM address not available for signing.";
          setErrorMessage(errMsg);
          setIntentProgressActual("error");
          throw new Error(errMsg);
        }
        return signMessageAsync({ account: evmAddress, message: args.message });
      };

      processNearIntentWithdrawal({
        callbackParams: requiredCallbackParams,
        userEvmAddress: evmAddress,
        signMessageAsync: handleSignMessage,
        tokenList: masterTokenList,
        updateProgress: setIntentProgressActual,
        updateErrorMessage: setErrorMessage,
        updateDisplayInfo: setNearIntentsDisplayInfo,
        toastFn: toast,
      });

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('type');
      newSearchParams.delete('action');
      newSearchParams.delete('network');
      newSearchParams.delete('asset');
      newSearchParams.delete('amount');
      newSearchParams.delete('recipient');
      setSearchParams(newSearchParams, { replace: true });
    } else if (!params.type && !params.action) {
        if (currentStep === 0 && intentProgressActual !== "error") {
             setIntentProgressActual("form");
        }
    }
  }, [
    searchParams,
    setSearchParams,
    evmAddress,
    signMessageAsync,
    masterTokenList,
    setCurrentStep,
    intentProgressActual, 
    currentStep,
  ]);


  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setOpen(false);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressInput = e.target.value;
    setNearRecipientAddress(addressInput);
    const isValidNear =
      addressInput.trim().endsWith(".near") ||
      /^[0-9a-fA-F]{64}$/.test(addressInput.trim());
    setIsWalletAddressValid(isValidNear);
    if (addressInput.trim() !== "") {
      setWalletAddressError(!isValidNear);
    } else {
      setWalletAddressError(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiatAmount(e.target.value);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handlePaymentMethod = (method: string) => {
    setPaymentMethod(method);
  }

  const handleContinue = async () => {
    if (!isConnected || !evmAddress) {
      toast("Wallet Not Connected", { description: "Please connect your EVM wallet to continue." });
      return;
    }
    if (!nearRecipientAddress.trim() || !isWalletAddressValid) {
      setWalletAddressError(true);
      toast("Invalid NEAR Address", { description: "Please enter a valid NEAR recipient address." });
      return;
    }
    if (!nearIntentsDepositAddress) {
      toast("Processing Error", { description: "Deposit address not ready. Please wait or reconnect wallet." });
      setIntentProgressActual("error");
      setErrorMessage("Deposit address generation failed or pending.");
      return;
    }
    const numericFiatAmount = parseFloat(fiatAmount);
    if (isNaN(numericFiatAmount) || numericFiatAmount < 1) {
      toast("Amount Too Low", { description: "Minimum onramp amount is $1." });
      return;
    }

    setWalletAddressError(false);
    setIntentProgressActual("generating_url");
    setErrorMessage(null);

    const callbackUrlParams = new URLSearchParams({
      type: "intents",
      action: "withdraw",
      network: "near",
      asset: "USDC",
      amount: fiatAmount,
      recipient: nearRecipientAddress,
    });
    const redirectUrl = `${window.location.origin}${window.location.pathname}?${callbackUrlParams.toString()}`;
    try {
      const onrampProviderUrl = generateOnrampURL({
        asset: "USDC",
        amount: fiatAmount,
        network: "base",
        address: nearIntentsDepositAddress,
        partnerUserId: evmAddress,
        redirectUrl: redirectUrl,
        paymentCurrency: selectedCurrency,
        paymentMethod: paymentMethod
      });

      if (onrampProviderUrl === "error:missing_app_id") {
        toast("Configuration Error", { description: "Coinbase App ID is missing." });
        setIntentProgressActual("error");
        setErrorMessage("Coinbase integration is not configured correctly.");
        return;
      }

      setIntentProgressActual("redirecting_coinbase");
      toast("Redirecting to Coinbase", { description: "You will be redirected to complete your purchase." });
      console.log("Redirecting to Coinbase Onramp:", onrampProviderUrl);
      window.location.href = onrampProviderUrl;
    } catch (error) {
      console.error("Failed to generate Coinbase Onramp URL:", error);
      toast("Error", { description: "Could not prepare redirection to Coinbase." });
      setIntentProgressActual("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate Coinbase URL.");
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setIntentProgressActual("form");
      setErrorMessage(null);
      setNearIntentsDisplayInfo({});
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if (currentStep -1 === 0) {
        setIntentProgressActual("form");
    }
  };

  const canContinueToOnramp = () => {
    if (currentStep === 0 && intentProgressActual === "form") {
      if (!isConnected || !evmAddress) return false;
      return (
        selectedAsset === "USDC" &&
        nearRecipientAddress.trim() !== "" &&
        isWalletAddressValid &&
        parseFloat(fiatAmount) >= 1 &&
        !!nearIntentsDepositAddress
      );
    }
    return false;
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0 && currentStep === 1) {
        if (!["signing", "withdrawing"].includes(intentProgressActual)) {
            setCurrentStep(0);
            setIntentProgressActual("form");
            setErrorMessage(null);
            setNearIntentsDisplayInfo({});
        }
        return;
    }
    if (stepIndex > currentStep && !canContinueToOnramp()) {
        return;
    }
    if (stepIndex <= currentStep) {
         setCurrentStep(stepIndex);
         if(stepIndex === 0) setIntentProgressActual("form");
    }
  };
  
  const isLoading = intentProgressActual !== "form" && intentProgressActual !== "done" && intentProgressActual !== "error" && intentProgressActual !== "none";


  return {
    currentStep,
    selectedAsset,
    open,
    setOpen,
    walletAddress: nearRecipientAddress,
    amount: fiatAmount,
    isWalletAddressValid,
    selectedCurrency,
    steps,
    walletAddressError,
    errorMessage,
    isLoading,
    paymentMethod,

    // Event Handlers
    handleAssetSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCurrencySelect,
    handleContinue,
    handleBack,
    canContinue: canContinueToOnramp,
    handleStepClick,
    handlePaymentMethod,

    // NEAR Intents specific state
    nearIntentsDepositAddress,
    intentProgress: intentProgressActual,
    nearIntentsDisplayInfo,
  };
};
