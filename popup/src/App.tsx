import { useEffect, useState } from "react";
import type { OnrampResult } from "../../src/internal/communication/messages";
import { usePopupConnection } from "./internal/communication/usePopupConnection";

import { useSignMessage } from "wagmi";
import {
  useOnrampFlow,
  useOnrampResult,
  useSetNearIntentsDisplayInfo,
  useSetOnrampResult,
  useSetProcessingSubStep,
  useWalletState,
} from "./state/hooks";

import { processNearIntentWithdrawal } from "./utils/intents-withdraw";
import { generateNearIntentsDepositAddress } from "./utils/near-intents";
import type { OnrampURLParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

import PopupLayout from "./components/layout/popup-layout";
import CompletionView from "./components/steps/completion-view";
import ConnectWalletView from "./components/steps/connect-wallet-view";
import ConnectingWalletView from "./components/steps/connecting-wallet-view";
import ErrorView from "./components/steps/error-view";
import type { FormValues } from "./components/steps/form-entry-view";
import FormEntryView from "./components/steps/form-entry-view";
import InitiatingOnrampView from "./components/steps/initiating-onramp-view";
import LoadingView from "./components/steps/loading-view";
import ProcessingTransactionView from "./components/steps/processing-transaction-view";
import SigningTransactionView from "./components/steps/signing-transaction-view";
import type { CallbackParams, IntentProgress } from "./types/onramp";
import { ProcessingOnramp } from "./components/processsing-onramp";

function App() {
  const { connection } = usePopupConnection();
  const { step, goToStep, error, setFlowError } = useOnrampFlow();

  // Dev mode for testing components
  const [isDevMode, setIsDevMode] = useState(false);

  // Check for dev mode in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get("devMode") === "true";
    const devStep = urlParams.get("step");

    setIsDevMode(devMode);

    // If in dev mode and a step is specified, override the current step
    if (devMode && devStep) {
      // Check if the step is valid
      const validSteps = [
        "loading",
        "connect-wallet",
        "form-entry",
        "connecting-wallet",
        "initiating-onramp-service",
        "signing-transaction",
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

  // Hooks for the new intent processing flow
  const setProcessingSubStep = useSetProcessingSubStep();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();
  const { signMessageAsync, error: signMessageError } = useSignMessage();

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
      console.error("[App.tsx] Connection not available for form submission.");
      setFlowError("Communication connection not available.", "form-entry");
      return;
    }

    connection
      .remoteHandle()
      .call("reportFormDataSubmitted", { formData: data })
      .catch((e: unknown) =>
        console.error("App.tsx: Error calling reportFormDataSubmitted", e),
      );

    // Get user's EVM address (partnerUserId)
    const partnerUserId = walletStateValue?.address;

    // Validate essential preliminary data (EVM address, App ID)
    if (!partnerUserId) {
      const errorMsg =
        "EVM wallet address not available. Please connect your wallet.";
      setFlowError(errorMsg, "form-entry");
      connection
        .remoteHandle()
        .call("reportProcessFailed", { error: errorMsg, step: "form-entry" })
        .catch((e: unknown) =>
          console.error("App.tsx: Error reporting missing EVM address", e),
        );

      return;
    }

    goToStep("initiating-onramp-service"); // Indicate process is starting

    let generatedNearIntentsDepositAddress: {
      address: string;
      network: string;
    };
    try {
      // Generate NEAR Intents deposit address. Defaulting to "base" chain.
      generatedNearIntentsDepositAddress =
        await generateNearIntentsDepositAddress(partnerUserId);
      console.log("generated, ", generatedNearIntentsDepositAddress);
    } catch (genError) {
      console.error(
        "App.tsx: Failed to generate NEAR Intents deposit address:",
        genError,
      );
      const errorMsg =
        genError instanceof Error
          ? genError.message
          : "Failed to prepare deposit address.";
      setFlowError(errorMsg, "initiating-onramp-service");
      connection
        .remoteHandle()
        .call("reportProcessFailed", {
          error: errorMsg,
          step: "initiating-onramp-service",
        })
        .catch((e: unknown) =>
          console.error(
            "App.tsx: Error reporting deposit address generation failure",
            e,
          ),
        );

      return;
    }

    try {
      const callbackUrlParams = new URLSearchParams({
        type: "intents",
        action: "withdraw",
        network: "near",
        asset: "USDC",
        amount: data.amount,
        recipient: data.nearWalletAddress || "",
      });

      const redirectUrl = `${
        window.location.origin
      }/onramp-callback?${callbackUrlParams.toString()}`;

      const depositAddressForCoinbase =
        generatedNearIntentsDepositAddress.address;
      const depositNetworkForCoinbase = "base";
      // generatedNearIntentsDepositAddress.network;

      const onrampParams: OnrampURLParams = {
        asset: data.selectedAsset,
        amount: data.amount,
        network: depositNetworkForCoinbase,
        address: depositAddressForCoinbase,
        partnerUserId: partnerUserId,
        redirectUrl: redirectUrl,
        paymentCurrency: data.selectedCurrency,
        paymentMethod: data.paymentMethod.toUpperCase(),
        enableGuestCheckout: true,
      };

      let coinbaseOnrampURL: string;

      try {
        coinbaseOnrampURL = generateOnrampURL(onrampParams);
        console.log("onramp", coinbaseOnrampURL);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setFlowError(e.message, "initiating-onramp-service");
          connection
            .remoteHandle()
            .call("reportProcessFailed", {
              error: e.message,
              step: "initiating-onramp-service",
            })
            .catch((e: unknown) =>
              console.error(
                "App.tsx: Error calling reportProcessFailed for Coinbase URL error",
                e,
              ),
            );
        }
        return;
      }

      connection
        .remoteHandle()
        .call("reportOnrampInitiated", {
          serviceName: "Coinbase Onramp",
          details: {
            url: coinbaseOnrampURL,
            depositAddress: generatedNearIntentsDepositAddress,
          },
        })
        .catch((e: unknown) =>
          console.error("App.tsx: Error calling reportOnrampInitiated", e),
        );

      console.log("Redirecting to Coinbase Onramp:", coinbaseOnrampURL);
      if (window.top) {
        window.top.location.href = coinbaseOnrampURL;
      } else {
        // Fallback if window.top is not available (e.g. if not in an iframe, though less likely for a popup)
        window.location.href = coinbaseOnrampURL;
      }

      goToStep("processing-transaction");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setFlowError(
        errorMsg || "Failed to initiate onramp.",
        "initiating-onramp-service",
      );
      connection
        ?.remoteHandle()
        .call("reportProcessFailed", {
          error: errorMsg,
          step: "initiating-onramp-service",
        })
        .catch((err: unknown) =>
          console.error(
            "App.tsx: Error calling reportProcessFailed for general catch block",
            err,
          ),
        );
    }
  };

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      const action = urlParams.get("action");
      const asset = urlParams.get("asset");
      const amount = urlParams.get("amount");
      const recipient = urlParams.get("recipient");
      const network = urlParams.get("network");

      if (window.location.pathname === "/onramp-callback") {
        // Check for NEAR Intent withdrawal callback
        if (
          type === "intents" &&
          action === "withdraw" &&
          network === "near" && // from URL
          asset === "USDC" && // from URL, should match hardcoded
          amount &&
          recipient &&
          walletStateValue?.address && // EVM address
          connection // Ensure connection is available for signMessage
        ) {
          goToStep("processing-transaction"); // Or a more specific step like "processing-bridge"
          setProcessingSubStep("depositing"); // Initial sub-step

          const requiredCallbackParams: Required<CallbackParams> = {
            type: "intents",
            action: "withdraw",
            network: "near",
            asset: "USDC",
            amount: "10",
            recipient: "efiz.near",
          };

          const handleSignMessage = async (args: {
            message: string;
          }): Promise<`0x${string}`> => {
            if (!walletStateValue?.address) {
              const errMsg = "EVM address not available for signing.";
              setFlowError(errMsg, "processing-transaction");
              setProcessingSubStep("error");
              throw new Error(errMsg);
            }
            if (!connection) {
              const errMsg = "Connection not available for signing.";
              setFlowError(errMsg, "processing-transaction");
              setProcessingSubStep("error");
              throw new Error(errMsg);
            }
            // Sign message directly using wagmi's useSignMessage
            if (!signMessageAsync) {
              const errMsg =
                "signMessageAsync is not available. Ensure WalletProvider is set up correctly.";
              setFlowError(errMsg, "processing-transaction");
              setProcessingSubStep("error");
              throw new Error(errMsg);
            }
            try {
              // The account should be implicitly handled by wagmi if connected
              const signature = await signMessageAsync({
                message: args.message,
              });
              return signature;
            } catch (signError: unknown) {
              console.error("App.tsx: Error signing message", signError);
              const errMsg =
                signMessageError?.message ||
                (signError instanceof Error
                  ? signError.message
                  : "Failed to sign message.");
              setFlowError(errMsg, "processing-transaction");
              setProcessingSubStep("error");
              throw new Error(errMsg);
            }
          };

          // Process the NEAR intent withdrawal
          processNearIntentWithdrawal({
            callbackParams: requiredCallbackParams,
            userEvmAddress: walletStateValue.address!,
            signMessageAsync: handleSignMessage,
            updateProgress: (newSubStep: IntentProgress) => {
              setProcessingSubStep(newSubStep);
              if (newSubStep === "done") goToStep("complete");
              if (newSubStep === "error")
                setFlowError(
                  "Bridge processing error.",
                  "processing-transaction",
                );
            },
            updateErrorMessage: (msg: string | null) =>
              setFlowError(
                msg || "Unknown bridge error",
                "processing-transaction",
              ),
            updateDisplayInfo: setNearIntentsDisplayInfo,
          });

          // Clean up URL params
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("type");
          newUrl.searchParams.delete("action");
          newUrl.searchParams.delete("network");
          newUrl.searchParams.delete("asset");
          newUrl.searchParams.delete("amount");
          newUrl.searchParams.delete("recipient");
          window.history.replaceState(
            {},
            document.title,
            newUrl.pathname + newUrl.search,
          );
        } else {
          // Handle original Coinbase Onramp callback if not an intent
          const status = urlParams.get("status");
          const transactionId = urlParams.get("transactionId");
          if (status === "success" && transactionId) {
            const resultPayload: OnrampResult = {
              success: true,
              message: "Onramp successful",
              data: { transactionId, service: "Coinbase Onramp" }, // Assuming this is still Coinbase
            };
            setOnrampResultAtom(resultPayload);
            connection
              ?.remoteHandle()
              .call("reportProcessComplete", { result: resultPayload })
              .catch((e: unknown) =>
                console.error(
                  "App.tsx: Error calling reportProcessComplete",
                  e,
                ),
              );
            goToStep("complete");
          } else if (status === "failure") {
            const errorMsg = urlParams.get("error") || "Onramp failed.";
            setFlowError(errorMsg, "processing-transaction");
            connection
              ?.remoteHandle()
              .call("reportProcessFailed", {
                error: errorMsg,
                step: "processing-transaction",
              })
              .catch((e: unknown) =>
                console.error(
                  "App.tsx: Error calling reportProcessFailed for callback failure",
                  e,
                ),
              );
          }
        }
      }
    };

    handleCallback();
  }, [
    connection,
    goToStep,
    setFlowError,
    setOnrampResultAtom,
    walletStateValue,
    setProcessingSubStep,
    setNearIntentsDisplayInfo,
    signMessageAsync,
    signMessageError,
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
          console.error("App.tsx: Error calling reportStepChanged", e),
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
      case "connecting-wallet":
        return <ConnectingWalletView />;
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

  return (
    <PopupLayout>
      {renderStepContent()}
      {isDevMode}
    </PopupLayout>
  );
}

export default App;
