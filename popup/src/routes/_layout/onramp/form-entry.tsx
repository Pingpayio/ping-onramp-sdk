import { ErrorView } from "@/components/steps/error-view";
import type { FormValues } from "@/components/steps/form-entry-view";
import { FormEntryView } from "@/components/steps/form-entry-view";
import { usePopupConnection } from "@/internal/communication/usePopupConnection";
import { initOnramp, onrampConfigQueryOptions } from "@/lib/coinbase";
import {
  fetch1ClickSupportedTokens,
  find1ClickAsset,
  requestSwapQuote,
  type OneClickToken,
  type QuoteRequestParams,
} from "@/lib/one-click-api";
import { onrampTargetAtom } from "@/state/atoms";
import {
  useOneClickSupportedTokens,
  useOnrampTarget,
  useSetNearIntentsDisplayInfo,
  useSetOneClickSupportedTokens,
  useWalletState,
} from "@/state/hooks";
import type { OnrampCallbackParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const ONE_CLICK_REFERRAL_ID = "pingpayio.near";

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
  const { connection, openerOrigin } = usePopupConnection();
  const [walletState] = useWalletState();
  const [onrampTarget] = useOnrampTarget();
  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget)
  );
  const navigate = Route.useNavigate();

  const setOneClickSupportedTokens = useSetOneClickSupportedTokens();
  const [oneClickSupportedTokens] = useOneClickSupportedTokens();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();

  // Report step change to parent application
  useEffect(() => {
    if (connection) {
      connection
        ?.remoteHandle()
        .call("reportStepChanged", { step: "form-entry" })
        .catch((e: unknown) =>
          console.error("Error calling reportStepChanged", e)
        );
    }
  }, [connection]);

  const handleFormSubmit = async (data: FormValues) => {
    connection
      ?.remoteHandle()
      .call("reportFormDataSubmitted", { formData: data });

    const userEvmAddress = walletState?.address;
    if (!userEvmAddress) {
      navigate({
        to: "/onramp/error",
        search: {
          error:
            "EVM wallet address not available. Please connect your wallet.",
        },
      });
      return;
    }

    navigate({
      to: "/onramp/initiating",
    });
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
        onrampTarget.asset, // e.g., "USDC" - final asset on target chain
        onrampTarget.chain // e.g., "NEAR"
      );

      if (!originAsset1Click || !destinationAsset1Click) {
        navigate({
          to: "/onramp/error",
          search: {
            error:
              "Could not find required assets for the swap in 1Click service.",
          },
        });
        return;
      }

      // Convert fiat amount to smallest unit of origin asset
      const amountInSmallestUnit = BigInt(
        Math.floor(parseFloat(data.amount) * 10 ** originAsset1Click.decimals)
      ).toString();

      const quoteDeadline = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now

      const quoteParams: QuoteRequestParams = {
        originAsset: originAsset1Click.assetId,
        destinationAsset: destinationAsset1Click.assetId,
        amount: amountInSmallestUnit,
        recipient: data.recipientAddress, // Final recipient address
        refundTo: userEvmAddress,
        refundType: "ORIGIN_CHAIN",
        depositType: "ORIGIN_CHAIN",
        recipientType: "DESTINATION_CHAIN", // As we are sending to destination chain address
        swapType: "EXACT_INPUT",
        slippageTolerance: 100, // 1%
        deadline: quoteDeadline,
        dry: false,
        referral: ONE_CLICK_REFERRAL_ID,
      };

      setNearIntentsDisplayInfo({ message: "Requesting swap quote..." });
      const quoteResponse = await requestSwapQuote(quoteParams);

      const depositAddressForCoinbase = quoteResponse.quote.depositAddress;
      const depositNetworkForCoinbase = originAsset1Click.blockchain; // Should match COINBASE_DEPOSIT_NETWORK

      const params: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: onrampTarget.chain,
        asset: onrampTarget.asset,
        amount: data.amount,
        recipient: data.recipientAddress,
      };

      const callbackUrlParams = new URLSearchParams(params);

      if (openerOrigin) {
        callbackUrlParams.set("ping_sdk_opener_origin", openerOrigin);
      }

      const redirectUrl = `${
        window.location.origin
      }/onramp/callback?${callbackUrlParams.toString()}`;

      const onrampInitParams = {
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

      if (!onrampConfig?.sessionId) {
        throw new Error("Onramp session not initialized.");
      }

      const { redirectUrl: coinbaseOnrampURL } = await initOnramp(
        onrampConfig.sessionId,
        onrampInitParams
      );

      // Prepare callback data for router navigation
      const callbackParams: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: onrampTarget.chain,
        asset: onrampTarget.asset,
        amount: data.amount,
        recipient: data.recipientAddress,
      };
      if (openerOrigin) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (callbackParams as any).ping_sdk_opener_origin = openerOrigin;
      }

      // Report onramp initiation to the parent application
      await connection?.remoteHandle().call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click)",
        details: {
          url: import.meta.env.VITE_PUBLIC_SKIP_REDIRECT
            ? "ROUTER_NAVIGATION:USING_TANSTACK_ROUTER"
            : coinbaseOnrampURL,
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

      if (!import.meta.env.VITE_PUBLIC_SKIP_REDIRECT) {
        // In production: Redirect to Coinbase Onramp URL
        console.log("Production mode: Redirecting to Coinbase Onramp URL");
        window.location.href = coinbaseOnrampURL;
      } else {
        // In development: Use router to navigate to the onramp-callback route
        console.log(
          "Development mode: Navigating to onramp-callback with params:",
          callbackParams
        );
        navigate({
          to: "/onramp/callback",
          search: callbackParams,
        });
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);

      navigate({
        to: "/onramp/error",
        search: {
          error:
            errorMsg || "Failed to initiate 1Click quote or Coinbase Onramp.",
        },
      });
      connection?.remoteHandle().call("reportProcessFailed", {
        error: errorMsg,
        step: "initiating-onramp-service",
      });
    }
  };

  const handleDisconnect = () => {
    navigate({
      to: "/onramp/connect-wallet",
      replace: true,
    });
  };

  return (
    <FormEntryView
      onSubmit={handleFormSubmit}
      onDisconnect={handleDisconnect}
    />
  );
}
