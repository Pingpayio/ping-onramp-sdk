import { useEffect } from "react";
import type { OnrampResult } from "../../src/internal/communication/messages";
import { usePopupChannel } from './internal/communication/channel';

import {
  useInitialData,
  useOnrampFlow,
  useOnrampProcessResult,
  useSetOnrampProcessResult,
  useSetOnrampTarget,
  useWallet
} from "./state/hooks";

import type { SdkToPopupMessages } from "../../src/internal/communication/messages";
import type { OnrampURLParams as RampUtilParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

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

type AppOnrampURLParams = RampUtilParams;

type InitialDataType = {
  nearIntentsDepositAddress?: string;
  partnerWalletAddress?: string;
  coinbaseAppId?: string;
  [key: string]: unknown;
};

type AppFormValues = FormEntryFormValues;

function App() {
  const { channel } = usePopupChannel(); // Use the typed-channel hook
  const { step, goToStep, error, setFlowError } = useOnrampFlow();
  const setOnrampTarget = useSetOnrampTarget();

  const [walletStateValue] = useWallet();
  const [onrampProcessResultValue] = useOnrampProcessResult();
  const setOnrampProcessResultAtom = useSetOnrampProcessResult();

  const [initialOnrampDataValueFromAtom, setInitialDataAtomFromUseInitialData] =
    useInitialData();

  useEffect(() => {
    if (channel) {
      // Send popup-ready using typed-channel
      // The payload for 'popup-ready' is an optional empty object as per src/internal/communication/messages.ts
      channel.emit('popup-ready', undefined);
      console.log('[App.tsx] Emitted popup-ready via typed-channel');

      // Listen for initiate-onramp-flow using typed-channel
      const cleanupInitiate = channel.on('initiate-onramp-flow', (payload: SdkToPopupMessages['initiate-onramp-flow']) => {
        console.log('[App.tsx] Received initiate-onramp-flow from SDK via typed-channel:', payload);
        if (payload) { // Payload is required for initiate-onramp-flow
          setOnrampTarget(payload.target);
          setInitialDataAtomFromUseInitialData(
            payload.initialData as InitialDataType
          );
          goToStep("form-entry");
          channel.emit('flow-started', payload); // Send flow-started back with the same payload
        }
      });

      // Add other listeners as needed, e.g., for 'sdk-closed-popup'
      // const cleanupSdkClosed = channel.on('sdk-closed-popup', () => {
      //   console.log('[App.tsx] SDK indicated popup should close.');
      //   window.close(); // Or other cleanup
      // });

      return () => {
        cleanupInitiate(); // Cleanup listener
        // cleanupSdkClosed();
      };
    }
  }, [channel, goToStep, setOnrampTarget, setInitialDataAtomFromUseInitialData]);

  const handleFormSubmit = async (data: AppFormValues) => {
    if (!channel) {
      console.error("[App.tsx] Channel not available for form submission.");
      setFlowError("Communication channel not available.", "form-entry");
      return;
    }

    channel.emit("form-data-submitted", { formData: data });

    const typedInitialData =
      initialOnrampDataValueFromAtom as InitialDataType | null;

    const partnerUserId =
      walletStateValue?.address ||
      (typedInitialData?.partnerWalletAddress as string | undefined) ||
      "0xPartnerWalletPlaceholder";
    const nearIntentsDepositAddress =
      (typedInitialData?.nearIntentsDepositAddress as string | undefined) ||
      "nearIntentsDepositPlaceholder.base";
    const coinbaseAppId = typedInitialData?.coinbaseAppId
      ? String(typedInitialData.coinbaseAppId)
      : undefined;

    if (!partnerUserId || !nearIntentsDepositAddress || !coinbaseAppId) {
      const errorMsg =
        "Missing critical information: EVM wallet, deposit address, or Coinbase App ID.";
      setFlowError(errorMsg, "form-entry");
      channel.emit("process-failed", { error: errorMsg, step: "form-entry" });
      return;
    }

    goToStep("initiating-onramp-service");

    try {
      const redirectUrl = window.location.origin + "/onramp-callback";

      const onrampParams: AppOnrampURLParams = {
        appId: coinbaseAppId,
        asset: data.selectedAsset,
        amount: data.amount,
        network: nearIntentsDepositAddress.split(".")[1] || "base",
        address: nearIntentsDepositAddress.split(".")[0],
        partnerUserId: partnerUserId,
        redirectUrl: redirectUrl,
        paymentCurrency: data.selectedCurrency,
        paymentMethod: data.paymentMethod.toUpperCase(),
        enableGuestCheckout: true,
      };

      const coinbaseOnrampURL = generateOnrampURL(onrampParams);

      if (coinbaseOnrampURL.startsWith("error:")) {
        setFlowError(coinbaseOnrampURL, "initiating-onramp-service");
        channel.emit("process-failed", {
            error: coinbaseOnrampURL,
            step: "initiating-onramp-service",
          });
        return;
      }

      channel.emit("onramp-initiated", {
          serviceName: "Coinbase Onramp",
          details: { url: coinbaseOnrampURL },
        });

      console.log("Redirecting to Coinbase Onramp:", coinbaseOnrampURL);
      // window.top.location.href = coinbaseOnrampURL; // This redirection needs careful review

      goToStep("processing-transaction");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setFlowError(
        errorMsg || "Failed to initiate onramp.",
        "initiating-onramp-service"
      );
      channel.emit("process-failed", { error: errorMsg, step: "initiating-onramp-service" });
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
          if (channel) {
            channel.emit("process-complete", { result: resultPayload });
          }
          goToStep("complete");
        } else if (status === "failure") {
          const errorMsg = urlParams.get("error") || "Onramp failed.";
          setFlowError(errorMsg, "processing-transaction");
          if (channel) {
            channel.emit("process-failed", { error: errorMsg, step: "processing-transaction" });
          }
        }
        // window.history.replaceState({}, document.title, window.location.pathname.split('?')[0]);
      }
    };

    handleCallback();
  }, [channel, goToStep, setFlowError, setOnrampProcessResultAtom]);

  useEffect(() => {
    if (channel) {
      channel.emit("step-changed", { step });
    }
  }, [channel, step]);

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
      {renderStepContent()}
    </PopupLayout>
  );
}

export default App;
