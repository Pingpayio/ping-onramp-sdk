import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePopupConnection } from "./internal/communication/usePopupConnection";

import {
  useOneClickSupportedTokens,
  useOnrampFlow,
  useOnrampResult,
  useOnrampTarget,
  useSetNearIntentsDisplayInfo,
  useSetOneClickFullQuoteResponse,
  useSetOneClickSupportedTokens,
  useWalletState
} from "./state/hooks";

import {
  fetch1ClickSupportedTokens,
  find1ClickAsset,
  requestSwapQuote,
  type OneClickToken,
  type QuoteRequestParams,
} from "./lib/one-click-api";

import type { OnrampURLParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

import { ConnectWalletView } from "./components/steps/connect-wallet-view";
import { ErrorView } from "./components/steps/error-view";
import type { FormValues } from "./components/steps/form-entry-view";
import { FormEntryView } from "./components/steps/form-entry-view";
import { LoadingView } from "./components/steps/loading-view";
import { ProcessingOnramp } from "./components/steps/processsing-onramp-view";
import type { OnrampCallbackParams } from "./routes/_layout/onramp-callback";

const ONE_CLICK_REFERRAL_ID = "pingpay.near";

function App() {
  const { connection } = usePopupConnection();
  const { step, goToStep, error, setFlowError } = useOnrampFlow();
  const router = useRouter();
  console.log("App component render. Current step:", step);

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
        goToStep(devStep as any);
      }
    }
  }, [goToStep]);

  const [walletStateValue] = useWalletState();
  const [onrampResultValue] = useOnrampResult();
  const [onrampTargetValue] = useOnrampTarget();

  const setOneClickSupportedTokens = useSetOneClickSupportedTokens();
  const [oneClickSupportedTokens] = useOneClickSupportedTokens();
  const setOneClickFullQuoteResponse = useSetOneClickFullQuoteResponse();

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
    setNearIntentsDisplayInfo({ message: "Fetching token data..." });

    try {
      let currentSupportedTokens = oneClickSupportedTokens;
      if (!currentSupportedTokens) {
        currentSupportedTokens = await fetch1ClickSupportedTokens();
        setOneClickSupportedTokens(currentSupportedTokens);
      }

      setNearIntentsDisplayInfo({ message: "Finding assets for swap..." });

      const originAsset1Click: OneClickToken | undefined = find1ClickAsset(
        currentSupportedTokens,
        data.selectedAsset, // e.g., "USDC" - asset to buy on Coinbase
        "base" // e.g., "base"
      );

      const destinationAsset1Click: OneClickToken | undefined = find1ClickAsset(
        currentSupportedTokens,
        onrampTargetValue.asset, // e.g., "USDC" - final asset on target chain
        onrampTargetValue.chain // e.g., "NEAR"
      );

      if (!originAsset1Click || !destinationAsset1Click) {
        setFlowError(
          "Could not find required assets for the swap in 1Click service.",
          "initiating-onramp-service"
        );
        return;
      }

      // Convert fiat amount to smallest unit of origin asset
      // This assumes data.selectedAsset (e.g. USDC) has a known price relative to data.selectedCurrency (e.g. USD)
      // For simplicity, if selectedAsset is USDC and currency is USD, amount is 1:1
      // A proper price feed or conversion logic would be needed for other assets/currencies
      const amountInSmallestUnit = BigInt(
        Math.floor(parseFloat(data.amount) * 10 ** originAsset1Click.decimals)
      ).toString();

      const quoteDeadline = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now

      const quoteParams: QuoteRequestParams = {
        originAsset: originAsset1Click.assetId,
        destinationAsset: destinationAsset1Click.assetId,
        amount: amountInSmallestUnit,
        recipient: data.nearWalletAddress, // Final recipient on NEAR
        refundTo: userEvmAddress,
        refundType: "ORIGIN_CHAIN",
        depositType: "ORIGIN_CHAIN",
        recipientType: "DESTINATION_CHAIN", // As we are sending to a NEAR chain address
        swapType: "EXACT_INPUT",
        slippageTolerance: 100, // 1%
        deadline: quoteDeadline,
        dry: false,
        referral: ONE_CLICK_REFERRAL_ID,
      };

      setNearIntentsDisplayInfo({ message: "Requesting swap quote..." });
      const quoteResponse = await requestSwapQuote(quoteParams);
      setOneClickFullQuoteResponse(quoteResponse);

      const depositAddressForCoinbase = quoteResponse.quote.depositAddress;
      const depositNetworkForCoinbase = originAsset1Click.blockchain; // Should match COINBASE_DEPOSIT_NETWORK

      // Get ping_sdk_opener_origin from the current URL
      const currentUrlParams = new URLSearchParams(window.location.search);
      const openerOrigin = currentUrlParams.get("ping_sdk_opener_origin");

      const params: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: onrampTargetValue.chain,
        asset: onrampTargetValue.asset,
        amount: data.amount,
        recipient: data.nearWalletAddress,
      };

      const callbackUrlParams = new URLSearchParams(params);

      if (openerOrigin) {
        callbackUrlParams.set("ping_sdk_opener_origin", openerOrigin);
      }

      const redirectUrl = `${
        window.location.origin
      }/onramp-callback?${callbackUrlParams.toString()}`;

      // Log the manual callback URL for testing
      // console.log("Manually navigable /onramp-callback URL for testing:", redirectUrl); // No longer navigating via URL

      const onrampParamsForCoinbase: OnrampURLParams = {
        asset: data.selectedAsset, // Asset Coinbase user buys (e.g. USDC)
        amount: data.amount,
        network: depositNetworkForCoinbase, // Network Coinbase deposits to (e.g. base)
        address: depositAddressForCoinbase, // 1Click's deposit address
        partnerUserId: userEvmAddress,
        redirectUrl: redirectUrl,
        paymentCurrency: data.selectedCurrency,
        paymentMethod: data.paymentMethod.toUpperCase(),
        enableGuestCheckout: true,
      };

      const coinbaseOnrampURL = generateOnrampURL(onrampParamsForCoinbase); // THIS SHOULD BE WHERE WE REDIRECT

      // Prepare callback data for router navigation
      const callbackParams: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: onrampTargetValue.chain,
        asset: onrampTargetValue.asset,
        amount: data.amount,
        recipient: data.nearWalletAddress,
      };
      if (openerOrigin) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (callbackParams as any).ping_sdk_opener_origin = openerOrigin;
      }

      // Report onramp initiation to the parent application
      await connection.remoteHandle().call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click)",
        details: {
          url: import.meta.env.PROD ? coinbaseOnrampURL : "ROUTER_NAVIGATION:USING_TANSTACK_ROUTER",
          manualCallbackUrl: redirectUrl,
          originalCoinbaseOnrampURL: coinbaseOnrampURL,
          callbackParams: callbackParams,
          depositAddress: {
            address: depositAddressForCoinbase,
            network: depositNetworkForCoinbase,
          },
          quote: quoteResponse,
        },
      });

      if (import.meta.env.PROD) {
        // In production: Redirect to Coinbase Onramp URL
        console.log("Production mode: Redirecting to Coinbase Onramp URL");
        window.location.href = coinbaseOnrampURL;
      } else {
        // In development: Use router to navigate to the onramp-callback route
        console.log(
          "Development mode: Navigating to onramp-callback with params:",
          callbackParams
        );
        router.navigate({
          to: "/onramp-callback",
          search: callbackParams,
        });
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
    const isWalletConnected = !!(walletStateValue && walletStateValue.address);

    switch (step) {
      case "loading":
        if (isWalletConnected) {
          // wallet is connected, go to form-entry
          goToStep("form-entry");
        } else {
          // If still 'loading' and wallet is not connected (walletStateValue is null),
          // show 'connect-wallet'.
          goToStep("connect-wallet");
        }
        break;

      case "connect-wallet":
        if (isWalletConnected) {
          // Wallet successfully connected (either automatically or via user action on this screen)
          goToStep("form-entry");
        }
        // If not connected, remain in "connect-wallet" for user interaction.
        break;

      case "form-entry":
        if (!isWalletConnected) {
          // If wallet disconnects while on the form, go back to "connect-wallet".
          goToStep("connect-wallet");
        }
        break;
      default:
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
      case "signing-transaction":
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
        const exhaustiveCheck: never = step;
        setFlowError(`Unknown step: ${exhaustiveCheck}`);
        return <ErrorView error={`Unknown step: ${exhaustiveCheck}`} />;
      }
    }
  };

  return renderStepContent();
}

export default App;
