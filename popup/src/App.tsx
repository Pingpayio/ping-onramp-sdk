import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { usePopupConnection } from "./internal/communication/usePopupConnection";

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

import { ConnectWalletView } from "./components/steps/connect-wallet-view";
import { ErrorView } from "./components/steps/error-view";
import type { FormValues } from "./components/steps/form-entry-view";
import { FormEntryView } from "./components/steps/form-entry-view";
import { LoadingView } from "./components/steps/loading-view";
import { ProcessingOnramp } from "./components/steps/processsing-onramp-view";

const ONE_CLICK_REFERRAL_ID = "pingpay.near";

// Temporary atom for the hacked flow. TODO: Move to atoms.ts if this pattern is kept.
const hackedFlowDepositAddressAtom = atom<string | null>(null);

function App() {
  const { connection } = usePopupConnection();
  const { step, goToStep, error, setFlowError } = useOnrampFlow();
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
  const setOnrampResultAtom = useSetOnrampResult();
  const [onrampTargetValue] = useOnrampTarget(); // Get the target asset

  // 1Click specific state setters/getters
  const setOneClickSupportedTokens = useSetOneClickSupportedTokens();
  const [oneClickSupportedTokens] = useOneClickSupportedTokens();
  const setOneClickFullQuoteResponse = useSetOneClickFullQuoteResponse();
  const setOneClickStatus = useSetOneClickStatus();

  // Hooks that might be repurposed or removed if not directly applicable to 1Click UI updates
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo(); // For displaying amounts, etc.
  const [hackedFlowAddress, setHackedFlowAddress] = useAtom(hackedFlowDepositAddressAtom);

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

      const callbackUrlParams = new URLSearchParams({
        type: "intents",
        action: "withdraw",
        oneClickDepositAddress: depositAddressForCoinbase,
        targetNetwork: onrampTargetValue.chain,
        targetAssetSymbol: onrampTargetValue.asset,
        fiatAmount: data.amount,
        nearRecipient: data.nearWalletAddress,
      });

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

      const coinbaseOnrampURL = generateOnrampURL(onrampParamsForCoinbase); // Still generate for potential non-navigational use or logging

      // For the hacked flow, send placeholder URLs to prevent external navigation,
      // but include the data that would have been in the callback URL.
      const simulatedCallbackData = {
        type: "intents",
        action: "withdraw",
        oneClickDepositAddress: depositAddressForCoinbase,
        targetNetwork: onrampTargetValue.chain,
        targetAssetSymbol: onrampTargetValue.asset,
        fiatAmount: data.amount,
        nearRecipient: data.nearWalletAddress,
      };
      if (openerOrigin) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (simulatedCallbackData as any).ping_sdk_opener_origin = openerOrigin;
      }

      connection.remoteHandle().call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click) - HACKED FLOW",
          details: {
            url: "HACK_FLOW:NAVIGATION_PREVENTED", // Placeholder to prevent navigation
            manualCallbackUrl: "HACK_FLOW:NAVIGATION_PREVENTED", // Placeholder
            originalCoinbaseOnrampURL: coinbaseOnrampURL, // Keep original for logging if needed
            originalRedirectUrl: redirectUrl, // Keep original for logging if needed
            simulatedCallbackParams: simulatedCallbackData, // Data that would have been in callback
            depositAddress: {
              address: depositAddressForCoinbase,
              network: depositNetworkForCoinbase,
            },
            quote: quoteResponse,
          },
        });

      // --- HACK: Bypass navigation and directly trigger processing ---
      console.log("HACK: Bypassing navigation, setting hackedFlowAddress:", depositAddressForCoinbase);
      setHackedFlowAddress(depositAddressForCoinbase);
      goToStep("processing-transaction");
      setNearIntentsDisplayInfo({ message: "Processing transaction (direct)..." });
      // The useEffect below will now pick up hackedFlowAddress and call pollStatus.

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
    const POLLING_INTERVAL = 5000; // 5 seconds
    let pollingTimer: NodeJS.Timeout | undefined;

    const pollStatus = async (depositAddress: string) => {
      try {
        const statusResponse = await getSwapStatus(depositAddress);
        setOneClickStatus(statusResponse);
        const destTxHash = statusResponse.swapDetails?.destinationChainTxHashes?.[0]?.hash;
        // Construct the explorer URL if a destination transaction hash is available
        const explorerLink = destTxHash
          ? `https://nearblocks.io/txns/${destTxHash}`
          : statusResponse.swapDetails?.destinationChainTxHashes?.[0]?.explorerUrl; // Fallback to existing explorerUrl

        setNearIntentsDisplayInfo({
          message: `Swap status: ${statusResponse.status}`,
          amountIn: parseFloat(
            statusResponse.quoteResponse.quote.amountInFormatted
          ),
          amountOut: parseFloat(
            statusResponse.quoteResponse.quote.amountOutFormatted
          ),
          explorerUrl: explorerLink,
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
            // Continue polling
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
        // Retry polling after a delay
        pollingTimer = setTimeout(
          () => pollStatus(depositAddress),
          POLLING_INTERVAL * 2
        ); // Longer delay on error
      }
    };

    // This useEffect now handles both URL-based callbacks and the hacked direct flow
    const handleCallbackLogic = async () => {
      // Check for hacked flow first
      if (hackedFlowAddress) {
        console.log("HACKED FLOW: useEffect detected active hack with address:", hackedFlowAddress);
        setNearIntentsDisplayInfo({
          message: "Verifying deposit status with 1Click (direct flow)...",
        });
        pollStatus(hackedFlowAddress);
        setHackedFlowAddress(null); // Reset hack state after use
        return; // Skip normal URL callback logic
      }

      // Original handleCallback logic for URL-based callbacks
      console.log("handleCallback triggered. Pathname:", window.location.pathname, "Search:", window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      console.log("handleCallback: type from URL:", type);
      const oneClickDepositAddress = urlParams.get("oneClickDepositAddress");
      console.log("handleCallback: oneClickDepositAddress from URL:", oneClickDepositAddress);
      const coinbaseStatus = urlParams.get("status");
      const coinbaseTransactionId = urlParams.get("transactionId");

      if (window.location.pathname === "/onramp-callback") {
        // Clean up URL params first
        // const newUrl = new URL(window.location.href);
        // urlParams.forEach((_, key) => newUrl.searchParams.delete(key));
        // window.history.replaceState(
        //   {},
        //   document.title,
        //   newUrl.pathname + newUrl.search
        // );

        if (type === "intents" && oneClickDepositAddress) {
          console.log("going");
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
              // Start polling
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
            // Coinbase callback might not have status=success, or missing txId.
            // This could happen if user closes Coinbase popup early.
            // We might still try to poll if we have a depositAddress,
            // assuming funds *might* have been sent.
            // Or, treat as an error/uncertain state.
            console.warn(
              "Coinbase callback status not 'success' or transactionId missing, but 1Click deposit address present.",
              { coinbaseStatus, coinbaseTransactionId }
            );
            setNearIntentsDisplayInfo({
              message: "Verifying deposit status with 1Click...",
            });
            // Attempt to poll anyway, 1Click might have detected the deposit via other means
            // or it might timeout if no deposit is found.
            pollStatus(oneClickDepositAddress);
          }
        }
        console.log("some other thing");
      }
    };

    handleCallbackLogic(); // Renamed and now handles both flows

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
    hackedFlowAddress, // Added dependency
    setHackedFlowAddress, // Added dependency
  ]);

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
