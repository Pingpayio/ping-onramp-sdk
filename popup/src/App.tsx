import { useEffect } from "react";
import type { OnrampResult } from "../../src/internal/communication/messages";
import { usePopupConnection } from "./internal/communication/usePopupConnection";

import {
  useOnrampFlow,
  useOnrampProcessResult,
  useSetOnrampProcessResult,
  useWallet,
} from "./state/hooks";

import { generateNearIntentsDepositAddress } from "./utils/near-intents";
import type { OnrampURLParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

import ErrorBoundary from "./components/ErrorBoundary";
import PopupLayout from "./components/layout/popup-layout";
import CompletionView from "./components/steps/completion-view";
import ConnectingWalletView from "./components/steps/connecting-wallet-view";
import ErrorView from "./components/steps/error-view";
import type { FormValues as FormEntryFormValues } from "./components/steps/form-entry-view";
import FormEntryView from "./components/steps/form-entry-view";
import InitiatingOnrampView from "./components/steps/initiating-onramp-view";
import LoadingView from "./components/steps/loading-view";
import ProcessingTransactionView from "./components/steps/processing-transaction-view";
import SigningTransactionView from "./components/steps/signing-transaction-view";

export type InitialDataType = {
  nearIntentsDepositAddress?: string;
  partnerWalletAddress?: string;
  coinbaseAppId?: string;
  [key: string]: unknown;
};

type AppFormValues = FormEntryFormValues;

function App() {
  const { connection } = usePopupConnection();
  const { step, goToStep, error, setFlowError } = useOnrampFlow();

  const [walletStateValue] = useWallet();
  const [onrampProcessResultValue] = useOnrampProcessResult();
  const setOnrampProcessResultAtom = useSetOnrampProcessResult();

  const handleFormSubmit = async (data: AppFormValues) => {
    if (!connection) {
      console.error("[App.tsx] Connection not available for form submission.");
      setFlowError("Communication connection not available.", "form-entry");
      return;
    }

    connection
      .remoteHandle()
      .call("reportFormDataSubmitted", { formData: data })
      .catch((e: unknown) =>
        console.error("App.tsx: Error calling reportFormDataSubmitted", e)
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
          console.error("App.tsx: Error reporting missing EVM address", e)
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
        genError
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
            e
          )
        );

      return;
    }

    // Now that we have the generatedNearIntentsDepositAddress, proceed with Onramp URL
    try {
      const redirectUrl = window.location.origin + "/onramp-callback";

      const depositAddressForCoinbase =
        generatedNearIntentsDepositAddress.address;
      const depositNetworkForCoinbase =
        generatedNearIntentsDepositAddress.network;

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
                e
              )
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
          console.error("App.tsx: Error calling reportOnrampInitiated", e)
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
        "initiating-onramp-service"
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
            err
          )
        );
    }
  };

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("status");
      const transactionId = urlParams.get("transactionId");

      if (window.location.pathname === "/onramp-callback") {
        if (status === "success" && transactionId) {
          const resultPayload: OnrampResult = {
            success: true,
            message: "Onramp successful",
            data: { transactionId, service: "Coinbase Onramp" },
          };
          setOnrampProcessResultAtom(resultPayload);
          if (connection) {
            connection
              .remoteHandle()
              .call("reportProcessComplete", { result: resultPayload })
              .catch((e: unknown) =>
                console.error("App.tsx: Error calling reportProcessComplete", e)
              );
          }
          goToStep("complete");
        } else if (status === "failure") {
          const errorMsg = urlParams.get("error") || "Onramp failed.";
          setFlowError(errorMsg, "processing-transaction");
          if (connection) {
            connection
              .remoteHandle()
              .call("reportProcessFailed", {
                error: errorMsg,
                step: "processing-transaction",
              })
              .catch((e: unknown) =>
                console.error(
                  "App.tsx: Error calling reportProcessFailed for callback failure",
                  e
                )
              );
          }
        }
        // window.history.replaceState({}, document.title, window.location.pathname.split('?')[0]);
      }
    };

    handleCallback();
  }, [connection, goToStep, setFlowError, setOnrampProcessResultAtom]);

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

  // The beforeunload listener is now primarily managed within usePopupConnection.
  // If additional App-specific logic is needed on unload, it could be added here,
  // but ensure it doesn't conflict with the one in the hook.

  const renderStepContent = () => {
    switch (step) {
      case "loading":
        return <LoadingView />;
      case "form-entry":
        return <FormEntryView onSubmit={handleFormSubmit} />;
      case "connecting-wallet":
        return <ConnectingWalletView />;
      case "initiating-onramp-service":
        return <InitiatingOnrampView />;
      case "signing-transaction":
        return <SigningTransactionView />;
      case "processing-transaction":
        return <ProcessingTransactionView />;
      case "complete":
        return <CompletionView result={onrampProcessResultValue} />;
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
    <PopupLayout title={`Onramp - Step: ${step.replace(/-/g, " ")}`}>
      <ErrorBoundary>{renderStepContent()}</ErrorBoundary>
    </PopupLayout>
  );
}

export default App;
