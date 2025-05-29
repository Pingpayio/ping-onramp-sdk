import { useEffect } from "react";
import type { OnrampResult } from "../../src/internal/communication/messages";
import {
  listenToSdkMessages,
  sendMessageToSdk,
} from "./internal/communication/popup-sdk-channel";
import {
  useInitialData,
  useOnrampFlow,
  useOnrampProcessResult,
  useSetOnrampProcessResult,
  useSetOnrampTarget,
  useWallet
} from "./state/hooks";

import type {
  PopupToSdkMessage,
  SdkToPopupMessage,
} from "./internal/communication/popup-sdk-channel";
import type { OnrampURLParams as RampUtilParams } from "./utils/rampUtils";
import { generateOnrampURL } from "./utils/rampUtils";

import PopupLayout from "./components/layout/popup-layout";
import CompletionView from "./components/steps/completion-view";
import ConnectingWalletView from "./components/steps/connecting-wallet-view";
import ErrorView from "./components/steps/error-view";
import type { FormValues as FormEntryFormValues } from "./components/steps/form-entry-view"; // Type-only import
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
  const { step, goToStep, error, setFlowError } = useOnrampFlow();
  const setOnrampTarget = useSetOnrampTarget();

  const [walletStateValue] = useWallet();
  const [onrampProcessResultValue] = useOnrampProcessResult();
  const setOnrampProcessResultAtom = useSetOnrampProcessResult();

  const [initialOnrampDataValueFromAtom, setInitialDataAtomFromUseInitialData] =
    useInitialData();

  useEffect(() => {
    sendMessageToSdk({
      type: "popup-ready",
      payload: undefined,
    } as PopupToSdkMessage<"popup-ready">);

    const cleanup = listenToSdkMessages((message: SdkToPopupMessage) => {
      if (message.type === "initiate-onramp-flow" && message.payload) {
        setOnrampTarget(message.payload.target);
        setInitialDataAtomFromUseInitialData(
          message.payload.initialData as InitialDataType
        );

        goToStep("form-entry");
        sendMessageToSdk({
          type: "flow-started",
          payload: message.payload,
        } as PopupToSdkMessage<"flow-started">);
      }
    });

    return cleanup;
  }, [goToStep, setOnrampTarget, setInitialDataAtomFromUseInitialData]);

  const handleFormSubmit = async (data: AppFormValues) => {
    sendMessageToSdk({
      type: "form-data-submitted",
      payload: { formData: data },
    } as PopupToSdkMessage<"form-data-submitted">);

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
      sendMessageToSdk({
        type: "process-failed",
        payload: { error: errorMsg, step: "form-entry" },
      } as PopupToSdkMessage<"process-failed">);
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
        sendMessageToSdk({
          type: "process-failed",
          payload: {
            error: coinbaseOnrampURL,
            step: "initiating-onramp-service",
          },
        } as PopupToSdkMessage<"process-failed">);
        return;
      }

      sendMessageToSdk({
        type: "onramp-initiated",
        payload: {
          serviceName: "Coinbase Onramp",
          details: { url: coinbaseOnrampURL },
        },
      } as PopupToSdkMessage<"onramp-initiated">);

      console.log("Redirecting to Coinbase Onramp:", coinbaseOnrampURL);
      // window.top.location.href = coinbaseOnrampURL;

      goToStep("processing-transaction");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setFlowError(
        errorMsg || "Failed to initiate onramp.",
        "initiating-onramp-service"
      );
      sendMessageToSdk({
        type: "process-failed",
        payload: { error: errorMsg, step: "initiating-onramp-service" },
      } as PopupToSdkMessage<"process-failed">);
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
          sendMessageToSdk({
            type: "process-complete",
            payload: { result: resultPayload },
          } as PopupToSdkMessage<"process-complete">);
          goToStep("complete");
        } else if (status === "failure") {
          const errorMsg = urlParams.get("error") || "Onramp failed.";
          setFlowError(errorMsg, "processing-transaction");
          sendMessageToSdk({
            type: "process-failed",
            payload: { error: errorMsg, step: "processing-transaction" },
          } as PopupToSdkMessage<"process-failed">);
        }
        // window.history.replaceState({}, document.title, window.location.pathname.split('?')[0]);
      }
    };

    handleCallback();
  }, [goToStep, setFlowError, setOnrampProcessResultAtom]);

  const renderStepContent = () => {
    sendMessageToSdk({
      type: "step-changed",
      payload: { step },
    } as PopupToSdkMessage<"step-changed">);
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
