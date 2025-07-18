import type {
  OnrampConfigResponse,
  OnrampInitResponse,
} from "@pingpay/onramp-types";
import { OnrampInitRequest } from "@pingpay/onramp-types";
import { ProviderError } from "../../lib/errors";
import { OnrampSessionContext } from "../../middleware/onramp-session";
import { coinbaseProvider } from "./providers/coinbase";
import { getCombinedQuote } from "./quote";

export async function getAggregatedOnrampConfig(
  env: any,
  location: { country: string; subdivision?: string; currency: string },
  device: { userAgent: string | null },
): Promise<OnrampConfigResponse> {
  try {
    const coinbaseOptions = await coinbaseProvider.getOnrampOptions(
      env,
      location,
      device,
    );

    const paymentCurrencies = coinbaseOptions.paymentCurrencies!.filter(
      (currency) => currency.id === location.currency,
    );
    const purchaseCurrencies = coinbaseOptions.purchaseCurrencies!.filter(
      (currency) => currency.symbol === "USDC",
    );

    const aggregatedOptions = {
      paymentMethods: coinbaseOptions.paymentMethods,
      paymentCurrencies,
      purchaseCurrencies,
      isIosDevice: coinbaseOptions.isIosDevice,
    };

    return aggregatedOptions as OnrampConfigResponse;
  } catch (err) {
    throw new ProviderError("Failed to get aggregated onramp config", err);
  }
}

export async function generateOnrampUrl(
  env: any,
  session: OnrampSessionContext,
  formData: OnrampInitRequest,
): Promise<OnrampInitResponse> {
  try {
    const { location, targetAsset, origin } = session;
    const {
      amount,
      paymentMethod,
      recipientAddress,
      selectedAsset,
      selectedCurrency,
    } = formData;

    const quoteFormData = {
      amount,
      destinationAsset: targetAsset,
      recipientAddress,
      paymentMethod,
    };

    const { swapQuote } = await getCombinedQuote(
      env,
      quoteFormData,
      location.country,
      false,
    );

    const depositAddress = swapQuote.quote.depositAddress;

    const callbackParams = new URLSearchParams({
      type: "intents",
      action: "withdraw",
      network: targetAsset.chain,
      asset: targetAsset.asset,
      amount: amount,
      recipient: recipientAddress,
      depositAddress,
    });

    const redirectUrl = `${origin}/onramp/callback?${callbackParams.toString()}`;

    const { redirectUrl: onrampUrl } = await coinbaseProvider.generateOnrampUrl(
      env,
      {
        amount,
        asset: selectedAsset,
        network: "ethereum",
        address: depositAddress,
        redirectUrl,
        paymentCurrency: selectedCurrency,
        paymentMethod,
      },
    );

    return { redirectUrl: onrampUrl };
  } catch (err) {
    throw new ProviderError("Failed to generate onramp URL", err);
  }
}
