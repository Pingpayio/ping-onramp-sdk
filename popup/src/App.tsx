import { useEffect } from "react";
import { useAtomValue } from "jotai"; 
import type { OnrampResult } from "../../src/internal/communication/messages";
import { usePopupConnection } from "./internal/communication/usePopupConnection";
import { optimalCoinbaseOptionAtom } from "./state/atoms"; 

import {
  useOneClickSupportedTokens,
  useOnrampFlow,
  useOnrampResult,
  useOnrampTarget,
  useSetNearIntentsDisplayInfo,
  useSetOneClickFullQuoteResponse,
  useSetOneClickStatus,
  useSetOneClickSupportedTokens,
  useSetOnrampResult,
  useWalletState,
} from "./state/hooks";

import {
  fetch1ClickSupportedTokens,
  find1ClickAsset,
  getSwapStatus,
  requestSwapQuote,
  submitDepositTransaction,
  type OneClickToken,
  type QuoteRequestParams,
} from "./lib/one-click-api";

import type { OnrampURLParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

import PopupLayout from "./components/layout/popup-layout";
import { ConnectWalletView } from "./components/steps/connect-wallet-view";
import { ErrorView } from "./components/steps/error-view";
import type { FormValues } from "./components/steps/form-entry-view";
import { FormEntryView } from "./components/steps/form-entry-view";
import { LoadingView } from "./components/steps/loading-view";
import { ProcessingOnramp } from "./components/steps/processsing-onramp-view";

// const COINBASE_DEPOSIT_NETWORK = "base"; // This is now dynamic
const ONE_CLICK_REFERRAL_ID = "pingpay.near";

function App() {
  const { connection } = usePopupConnection();
  const { step, goToStep, error, setFlowError } = useOnrampFlow();
  const optimalCoinbaseOption = useAtomValue(optimalCoinbaseOptionAtom); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get("devMode") === "true";
    const devStep = urlParams.get("step");
    if (devMode && devStep) {
      const validSteps = [
        "loading",
        "connect-wallet",
        "form-entry",
        "initiating-onramp-service",
        "processing-transaction",
        "complete",
        "error",
      ];
      if (validSteps.includes(devStep)) {
        goToStep(devStep as any); // Consider using a type assertion or type guard for devStep
      }
    }
  }, [goToStep]);

  const [walletStateValue] = useWalletState();
  const [onrampResultValue] = useOnrampResult();
  const setOnrampResultAtom = useSetOnrampResult();
  const [onrampTargetValue] = useOnrampTarget(); 

  const setOneClickSupportedTokens = useSetOneClickSupportedTokens();
  const [oneClickSupportedTokens] = useOneClickSupportedTokens();
  const setOneClickFullQuoteResponse = useSetOneClickFullQuoteResponse();
  const setOneClickStatus = useSetOneClickStatus();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();

  const handleWalletConnected = () => {
    if (step === "connect-wallet" || step === "loading") {
      goToStep("form-entry");
    }
  };

  const handleDisconnect = () => {
    goToStep("connect-wallet");
  };

  const handleFormSubmit = async (data: FormValues) => {
    if (!connection) {
      setFlowError("Communication connection not available.", "form-entry");
      return;
    }
    connection
      .remoteHandle()
      .call("reportFormDataSubmitted", { formData: data });

    const userEvmAddress = walletStateValue?.address;
    if (!userEvmAddress) {
      setFlowError(
        "EVM wallet address not available. Please connect your wallet.",
        "form-entry"
      );
      return;
    }
    if (!onrampTargetValue) {
      setFlowError("Target asset not defined.", "form-entry");
      return;
    }

    goToStep("initiating-onramp-service");
    setNearIntentsDisplayInfo({ message: "Processing your request..." });

    try {
      const fallbackNetwork = "base"; // Fallback if no optimal option
      const fallbackAsset = data.selectedAsset;
      const fallbackCurrency = data.selectedCurrency;
      const fallbackPaymentMethod = data.paymentMethod.toUpperCase();

      const depositNetworkForCoinbase = optimalCoinbaseOption?.network || fallbackNetwork; 
      const assetToBuyOnCoinbase = optimalCoinbaseOption?.asset || fallbackAsset;
      const paymentCurrencyForCoinbase = optimalCoinbaseOption?.currency || fallbackCurrency;
      const paymentMethodForCoinbase = (optimalCoinbaseOption?.paymentMethodId || data.paymentMethod).toUpperCase();


      console.log("App.tsx - Using Optimal Coinbase Option:", optimalCoinbaseOption);
      console.log("App.tsx - Effective Network:", depositNetworkForCoinbase, "Asset:", assetToBuyOnCoinbase);
      
      setNearIntentsDisplayInfo({ message: "Fetching token data..." });
      let currentSupportedTokens = oneClickSupportedTokens;
      if (!currentSupportedTokens) {
        currentSupportedTokens = await fetch1ClickSupportedTokens();
        setOneClickSupportedTokens(currentSupportedTokens);
      }

      setNearIntentsDisplayInfo({ message: "Finding assets for swap..." });

      const originAsset1Click: OneClickToken | undefined = find1ClickAsset(
        currentSupportedTokens,
        assetToBuyOnCoinbase,       
        depositNetworkForCoinbase   
      );

      const destinationAsset1Click: OneClickToken | undefined = find1ClickAsset(
        currentSupportedTokens,
        onrampTargetValue.asset, 
        onrampTargetValue.chain 
      );

      if (!originAsset1Click || !destinationAsset1Click) {
        setFlowError(
          "Could not find required assets for the swap in 1Click service.",
          "initiating-onramp-service"
        );
        return;
      }

      const amountInSmallestUnit = BigInt(
        Math.floor(parseFloat(data.amount) * 10 ** originAsset1Click.decimals)
      ).toString();

      const quoteDeadline = new Date(Date.now() + 30 * 60 * 1000).toISOString(); 

      const quoteParams: QuoteRequestParams = {
        originAsset: originAsset1Click.assetId,
        destinationAsset: destinationAsset1Click.assetId,
        amount: amountInSmallestUnit,
        recipient: data.nearWalletAddress, 
        refundTo: userEvmAddress,
        refundType: "ORIGIN_CHAIN",
        depositType: "ORIGIN_CHAIN",
        recipientType: "DESTINATION_CHAIN", 
        swapType: "EXACT_INPUT",
        slippageTolerance: 100, 
        deadline: quoteDeadline,
        dry: false,
        referral: ONE_CLICK_REFERRAL_ID,
      };

      setNearIntentsDisplayInfo({ message: "Requesting swap quote..." });
      const quoteResponse = await requestSwapQuote(quoteParams);
      setOneClickFullQuoteResponse(quoteResponse);

      const depositAddressFor1Click = quoteResponse.quote.depositAddress;
      const finalDepositNetworkForCoinbase = originAsset1Click.blockchain; 

      const callbackUrlParams = new URLSearchParams({
        type: "intents",
        action: "withdraw",
        oneClickDepositAddress: depositAddressFor1Click,
        targetNetwork: onrampTargetValue.chain,
        targetAssetSymbol: onrampTargetValue.asset,
        fiatAmount: data.amount,
        nearRecipient: data.nearWalletAddress,
      });

      const redirectUrl = `${
        window.location.origin
      }/onramp-callback?${callbackUrlParams.toString()}`;

      const onrampParamsForCoinbase: OnrampURLParams = {
        asset: assetToBuyOnCoinbase,          
        amount: data.amount,
        network: finalDepositNetworkForCoinbase, 
        address: depositAddressFor1Click,     
        partnerUserId: userEvmAddress,
        redirectUrl: redirectUrl,
        paymentCurrency: paymentCurrencyForCoinbase, 
        paymentMethod: paymentMethodForCoinbase,   
        enableGuestCheckout: true,
      };

      const coinbaseOnrampURL = generateOnrampURL(onrampParamsForCoinbase);

      connection.remoteHandle().call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click)",
        details: {
          url: coinbaseOnrampURL,
          depositAddress: { 
            address: depositAddressFor1Click,
            network: finalDepositNetworkForCoinbase, 
          },
          quote: quoteResponse,
        },
      });

      setNearIntentsDisplayInfo({
        message: "Redirecting to Coinbase Onramp...",
      });
      if (window.top) {
        window.top.location.href = coinbaseOnrampURL;
      } else {
        window.location.href = coinbaseOnrampURL;
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setFlowError(
        errorMsg || "Failed to initiate 1Click quote or Coinbase Onramp.",
        "initiating-onramp-service"
      );
      connection?.remoteHandle().call("reportProcessFailed", {
        error: errorMsg,
        step: "initiating-onramp-service",
      });
    }
  };

  useEffect(() => {
    const POLLING_INTERVAL = 5000; 
    let pollingTimer: NodeJS.Timeout | undefined;

    const pollStatus = async (depositAddress: string) => {
      try {
        const statusResponse = await getSwapStatus(depositAddress);
        setOneClickStatus(statusResponse);
        setNearIntentsDisplayInfo({
          message: `Swap status: ${statusResponse.status}`,
          amountIn: parseFloat(
            statusResponse.quoteResponse.quote.amountInFormatted
          ),
          amountOut: parseFloat(
            statusResponse.quoteResponse.quote.amountOutFormatted
          ),
          explorerUrl:
            statusResponse.swapDetails?.destinationChainTxHashes?.[0]
              ?.explorerUrl,
        });

        switch (statusResponse.status) {
          case "SUCCESS":
            goToStep("complete");
            setOnrampResultAtom({
              success: true,
              message: "1Click swap successful.",
              data: {
                service: "1Click",
                transactionId:
                  statusResponse.swapDetails?.destinationChainTxHashes?.[0]
                    ?.hash || depositAddress,
                details: statusResponse,
              },
            });
            clearTimeout(pollingTimer);
            break;
          case "REFUNDED":
          case "FAILED":
          case "EXPIRED":
            setFlowError(
              `Swap ${statusResponse.status.toLowerCase()}. Check details.`,
              "processing-transaction"
            );
            clearTimeout(pollingTimer);
            break;
          case "PENDING_DEPOSIT":
          case "KNOWN_DEPOSIT_TX":
          case "PROCESSING":
            pollingTimer = setTimeout(
              () => pollStatus(depositAddress),
              POLLING_INTERVAL
            );
            break;
          default:
            console.warn("Unhandled 1Click status:", statusResponse.status);
            clearTimeout(pollingTimer);
            setFlowError(
              `Unhandled swap status: ${statusResponse.status}`,
              "processing-transaction"
            );
        }
      } catch (pollError) {
        console.error("Error polling 1Click status:", pollError);
        setFlowError(
          `Error polling swap status: ${
            (pollError as Error).message
          }. Retrying...`,
          "processing-transaction"
        );
        pollingTimer = setTimeout(
          () => pollStatus(depositAddress),
          POLLING_INTERVAL * 2
        ); 
      }
    };

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      const oneClickDepositAddress = urlParams.get("oneClickDepositAddress");
      const coinbaseStatus = urlParams.get("status");
      const coinbaseTransactionId = urlParams.get("transactionId");

      if (window.location.pathname === "/onramp-callback") {
        const newUrl = new URL(window.location.href);
        urlParams.forEach((_, key) => newUrl.searchParams.delete(key));
        window.history.replaceState(
          {},
          document.title,
          newUrl.pathname + newUrl.search
        );

        if (type === "intents" && oneClickDepositAddress) {
          goToStep("processing-transaction");
          setNearIntentsDisplayInfo({ message: "Processing your onramp..." });

          if (coinbaseStatus === "success" && coinbaseTransactionId) {
            setNearIntentsDisplayInfo({
              message: "Submitting deposit to 1Click...",
            });
            try {
              await submitDepositTransaction({
                txHash: coinbaseTransactionId,
                depositAddress: oneClickDepositAddress,
              });
              setNearIntentsDisplayInfo({
                message: "Deposit submitted. Polling for swap status...",
              });
              pollStatus(oneClickDepositAddress);
            } catch (submitError) {
              setFlowError(
                `Failed to submit deposit to 1Click: ${
                  (submitError as Error).message
                }`,
                "processing-transaction"
              );
            }
          } else if (coinbaseStatus === "failure") {
            const errorMsg =
              urlParams.get("error") || "Coinbase onramp failed.";
            setFlowError(errorMsg, "processing-transaction");
            connection?.remoteHandle().call("reportProcessFailed", {
              error: errorMsg,
              step: "processing-transaction",
            });
          } else {
            console.warn(
              "Coinbase callback status not 'success' or transactionId missing, but 1Click deposit address present.",
              { coinbaseStatus, coinbaseTransactionId }
            );
            setNearIntentsDisplayInfo({
              message: "Verifying deposit status with 1Click...",
            });
            pollStatus(oneClickDepositAddress);
          }
        } else {
          if (coinbaseStatus === "success" && coinbaseTransactionId) {
            const resultPayload: OnrampResult = {
              success: true,
              message: "Legacy Onramp successful",
              data: {
                transactionId: coinbaseTransactionId,
                service: "Coinbase Onramp (Legacy)",
              },
            };
            setOnrampResultAtom(resultPayload);
            connection
              ?.remoteHandle()
              .call("reportProcessComplete", { result: resultPayload });
            goToStep("complete");
          } else if (coinbaseStatus === "failure") {
            const errorMsg = urlParams.get("error") || "Legacy Onramp failed.";
            setFlowError(errorMsg, "processing-transaction");
          }
        }
      }
    };

    handleCallback();

    return () => {
      if (pollingTimer) {
        clearTimeout(pollingTimer);
      }
    };
  }, [
    connection,
    goToStep,
    setFlowError,
    setOnrampResultAtom,
    setOneClickStatus,
    setNearIntentsDisplayInfo,
  ]);

  useEffect(() => {
    const isWalletConnected = !!(walletStateValue && walletStateValue.address);

    switch (step) {
      case "loading":
        if (isWalletConnected) {
          goToStep("form-entry");
        } else {
          goToStep("connect-wallet");
        }
        break;
      case "connect-wallet":
        if (isWalletConnected) {
          goToStep("form-entry");
        }
        break;
      case "form-entry":
        if (!isWalletConnected) {
          goToStep("connect-wallet");
        }
        break;
      default:
        // This default case handles any 'step' values not explicitly cased above.
        // If 'step' can only be one of the known string literals, this might be unreachable.
        // However, if 'step' type is 'string', this is a valid safeguard.
        // const exhaustiveCheck: never = step; // This line causes error if step is not 'never' here
        // setFlowError(`Unknown step: ${step}`); // Using step directly
        break;
    }
  }, [walletStateValue, step, goToStep, setFlowError]);

  useEffect(() => {
    if (connection) {
      connection
        .remoteHandle()
        .call("reportStepChanged", { step })
        .catch((e: unknown) =>
          console.error("App.tsx: Error calling reportStepChanged", e)
        );
    }
  }, [connection, step]);

  const renderStepContent = () => {
    switch (step) {
      case "loading":
        return <LoadingView />;
      case "connect-wallet":
        return <ConnectWalletView onConnected={handleWalletConnected} />;
      case "form-entry":
        return (
          <FormEntryView
            onSubmit={handleFormSubmit}
            onDisconnect={handleDisconnect}
          />
        );
      case "initiating-onramp-service":
        return <ProcessingOnramp step={0} />;
      case "signing-transaction": // This step was not in the original devMode check, but is a logical step
        return <ProcessingOnramp step={1} />;
      case "processing-transaction":
        return <ProcessingOnramp step={2} />;
      case "complete":
        return <ProcessingOnramp step={3} result={onrampResultValue} />;
      case "error":
        return (
          <ErrorView error={error} onRetry={() => goToStep("form-entry")} />
        );
      default: {
        // To satisfy exhaustive check if 'step' is a union of known strings,
        // ensure all known steps are handled or 'step' type allows for unknown values.
        // If 'step' is 'string', this default is fine.
        // For a strict union, this might indicate an unhandled step.
        // const exhaustiveCheck: never = step; // This line will error if step is not narrowed to never
        console.warn(`Unknown step encountered in renderStepContent: ${step}`);
        setFlowError(`Unknown step: ${step}`);
        return <ErrorView error={`Unknown step: ${step}`} onRetry={() => goToStep("form-entry")} />;
      }
    }
  };

  return <PopupLayout>{renderStepContent()}</PopupLayout>;
}

export default App;
