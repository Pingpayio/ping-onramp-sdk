import { ErrorView } from "@/components/steps/error-view";
import type { FormValues } from "@/components/steps/form-entry-view";
import { FormEntryView } from "@/components/steps/form-entry-view";
import { usePopupConnection } from "@/context/popup-connection-provider";
import {
  useParentMessenger,
  useReportStep,
} from "@/hooks/use-parent-messenger";
import { initOnramp, onrampConfigQueryOptions } from "@/lib/coinbase";
import { onrampTargetAtom } from "@/state/atoms";
import { useOnrampTarget, useWalletState } from "@/state/hooks";
import type { OnrampCallbackParams } from "@/types";
import type { OnrampQuoteResponse } from "@pingpay/onramp-types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/onramp/form-entry")({
  errorComponent: ({ error, reset }) => (
    <ErrorView error={error.message} onRetry={reset} />
  ),
  loader: ({ context }) => {
    const targetAsset = context.store.get(onrampTargetAtom);
    return context.queryClient.ensureQueryData(
      onrampConfigQueryOptions(targetAsset)
    );
  },
  component: FormEntryRoute,
});

function FormEntryRoute() {
  const { openerOrigin } = usePopupConnection();
  const { call } = useParentMessenger();
  const [walletState] = useWalletState();
  const [onrampTarget] = useOnrampTarget();
  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget)
  );
  const navigate = Route.useNavigate();

  useReportStep("form-entry");

  const handleFormSubmit = async (
    data: FormValues,
    quoteResponse: OnrampQuoteResponse
  ) => {
    call("reportFormDataSubmitted", { formData: data })?.catch((e: unknown) => {
      console.error("Failed to report form data submitted:", e);
    });

    if (!walletState?.address) {
      void navigate({
        to: "/onramp/error",
        search: {
          error:
            "EVM wallet address not available. Please connect your wallet.",
        },
      });
      return;
    }

    void navigate({
      to: "/onramp/initiating",
    });

    try {
      const depositAddressForCoinbase =
        quoteResponse.swapQuote.quote.depositAddress;
      const depositNetworkForCoinbase = "base";

      const callbackParams: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: onrampTarget.chain,
        asset: onrampTarget.asset,
        amount: data.amount,
        recipient: data.recipientAddress,
        ...(openerOrigin && { ping_sdk_opener_origin: openerOrigin }),
      };

      const callbackUrlParams = new URLSearchParams(
        callbackParams as Record<string, string>
      );
      const redirectUrl = `${
        window.location.origin
      }/onramp/callback?${callbackUrlParams.toString()}`;

      if (!onrampConfig?.sessionId) {
        throw new Error("Onramp session not initialized.");
      }

      const { redirectUrl: onrampUrl } = await initOnramp(
        onrampConfig.sessionId,
        data
      );

      await call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click)",
        details: {
          url: import.meta.env.VITE_PUBLIC_SKIP_REDIRECT
            ? "ROUTER_NAVIGATION:USING_TANSTACK_ROUTER"
            : onrampUrl,
          manualCallbackUrl: redirectUrl,
          originalCoinbaseOnrampURL: onrampUrl,
          callbackParams: callbackParams,
          depositAddress: {
            address: depositAddressForCoinbase,
            network: depositNetworkForCoinbase,
          },
          quote: quoteResponse,
        },
      });

      if (!import.meta.env.VITE_PUBLIC_SKIP_REDIRECT) {
        // In production: Redirect to Onramp URL
        console.log("Production mode: Redirecting to Coinbase Onramp URL");
        window.location.href = onrampUrl;
      } else {
        // In development: Use router to navigate to the onramp-callback route
        console.log(
          "Development mode: Navigating to onramp-callback with params:",
          callbackParams
        );
        void navigate({
          to: "/onramp/callback",
          search: callbackParams,
        });
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);

      void navigate({
        to: "/onramp/error",
        search: {
          error:
            errorMsg || "Failed to initiate 1Click quote or Coinbase Onramp.",
        },
      });
      call("reportProcessFailed", {
        error: errorMsg,
        step: "initiating-onramp-service",
      })?.catch((e: unknown) => {
        console.error("Failed to report process failure:", e);
      });
    }
  };

  const handleDisconnect = () => {
    void navigate({
      to: "/onramp/connect-wallet",
      replace: true,
    });
  };

  return (
    <FormEntryView
      onSubmit={(data, quote) => void handleFormSubmit(data, quote)}
      onDisconnect={handleDisconnect}
    />
  );
}
