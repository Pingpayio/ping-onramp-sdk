import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormEntryView } from "../../../components/steps/form-entry-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { useSetOneClickSupportedTokens, useWalletState } from "../../../state/hooks";
import type { FormValues } from "../../../components/steps/form-entry-view";
import { useOnrampTarget } from "../../../state/hooks";
import { generateOnrampURL } from "../../../lib/coinbase";
import type { OnrampURLParams } from "../../../lib/coinbase";
import {
  fetch1ClickSupportedTokens,
  find1ClickAsset,
  requestSwapQuote,
  type OneClickToken,
  type QuoteRequestParams,
} from "../../../lib/one-click-api";
import {
  useOneClickSupportedTokens,
  useSetNearIntentsDisplayInfo,
} from "../../../state/hooks";
import type { OnrampCallbackParams } from "./callback";

const ONE_CLICK_REFERRAL_ID = "pingpay.near";

export const Route = createFileRoute("/_layout/onramp/form-entry")({
  component: FormEntryRoute,
});

function FormEntryRoute() {
  const { connection } = usePopupConnection();
  const [walletState] = useWalletState();
  const [onrampTarget] = useOnrampTarget();
  const navigate = Route.useNavigate();

  const setOneClickSupportedTokens = useSetOneClickSupportedTokens();
  const [oneClickSupportedTokens] = useOneClickSupportedTokens();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();

  // Report step change to parent application
  // Get ping_sdk_opener_origin from the current URL
  const currentUrlParams = new URLSearchParams(window.location.search);
  const openerOrigin = currentUrlParams.get("ping_sdk_opener_origin");

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
    
    connection?.remoteHandle()
      .call("reportFormDataSubmitted", { formData: data });

    const userEvmAddress = walletState?.address;
    if (!userEvmAddress) {
      // Create error search params and preserve ping_sdk_opener_origin
      const errorSearch: Record<string, string> = { 
        error: "EVM wallet address not available. Please connect your wallet." 
      };
      
      // Add ping_sdk_opener_origin if it exists
      if (openerOrigin) {
        errorSearch.ping_sdk_opener_origin = openerOrigin;
      }
      
      navigate({ 
        to: "/onramp/error",
        search: errorSearch
      });
      return;
    }
    
    // If onrampTarget is not defined, use default wNEAR on NEAR chain
    const targetAsset = onrampTarget || { chain: "NEAR", asset: "wNEAR" };

    // Navigate to initiating route and preserve ping_sdk_opener_origin
    const initiatingSearch = openerOrigin 
      ? { ping_sdk_opener_origin: openerOrigin } 
      : {};
      
    navigate({ 
      to: "/onramp/initiating",
      search: initiatingSearch
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
        targetAsset.asset, // e.g., "USDC" - final asset on target chain
        targetAsset.chain // e.g., "NEAR"
      );

      if (!originAsset1Click || !destinationAsset1Click) {
        // Create error search params and preserve ping_sdk_opener_origin
        const errorSearch: Record<string, string> = { 
          error: "Could not find required assets for the swap in 1Click service." 
        };
        
        // Add ping_sdk_opener_origin if it exists
        if (openerOrigin) {
          errorSearch.ping_sdk_opener_origin = openerOrigin;
        }
        
        navigate({ 
          to: "/onramp/error",
          search: errorSearch
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

      const depositAddressForCoinbase = quoteResponse.quote.depositAddress;
      const depositNetworkForCoinbase = originAsset1Click.blockchain; // Should match COINBASE_DEPOSIT_NETWORK

      const params: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: targetAsset.chain,
        asset: targetAsset.asset,
        amount: data.amount,
        recipient: data.nearWalletAddress,
      };

      const callbackUrlParams = new URLSearchParams(params);

      if (openerOrigin) {
        callbackUrlParams.set("ping_sdk_opener_origin", openerOrigin);
      }

      const redirectUrl = `${
        window.location.origin
      }/onramp/callback?${callbackUrlParams.toString()}`;

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

      const coinbaseOnrampURL = generateOnrampURL(onrampParamsForCoinbase);

      // Prepare callback data for router navigation
      const callbackParams: OnrampCallbackParams = {
        type: "intents",
        action: "withdraw",
        depositAddress: depositAddressForCoinbase,
        network: targetAsset.chain,
        asset: targetAsset.asset,
        amount: data.amount,
        recipient: data.nearWalletAddress,
      };
      if (openerOrigin) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (callbackParams as any).ping_sdk_opener_origin = openerOrigin;
      }

      // Report onramp initiation to the parent application
      await connection?.remoteHandle().call("reportOnrampInitiated", {
        serviceName: "Coinbase Onramp (via 1Click)",
        details: {
          url: import.meta.env.VITE_PUBLIC_SKIP_REDIRECT ? "ROUTER_NAVIGATION:USING_TANSTACK_ROUTER": coinbaseOnrampURL,
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
      
      // Create error search params and preserve ping_sdk_opener_origin
      const errorSearch: Record<string, string> = { 
        error: errorMsg || "Failed to initiate 1Click quote or Coinbase Onramp." 
      };
      
      // Add ping_sdk_opener_origin if it exists
      if (openerOrigin) {
        errorSearch.ping_sdk_opener_origin = openerOrigin;
      }
      
      navigate({ 
        to: "/onramp/error",
        search: errorSearch
      });
      connection?.remoteHandle().call("reportProcessFailed", {
        error: errorMsg,
        step: "initiating-onramp-service",
      });
    }
  };

  const handleDisconnect = () => {
    // Preserve ping_sdk_opener_origin when navigating to connect-wallet
    const navigationSearch = openerOrigin 
      ? { ping_sdk_opener_origin: openerOrigin } 
      : {};
      
    navigate({ 
      to: "/onramp/connect-wallet", 
      search: navigationSearch,
      replace: true 
    });
  };

  return (
    <FormEntryView
      onSubmit={handleFormSubmit}
      onDisconnect={handleDisconnect}
    />
  );
}
