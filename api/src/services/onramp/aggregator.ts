import { coinbaseProvider } from "./providers/coinbase";
import type {
  OnrampConfigResponse,
  OnrampInitResponse,
  TargetAsset,
} from "@pingpay/onramp-types";
import { createSession, getSession } from "./session-store";
import { getCombinedQuote } from "./quote";

export async function getAggregatedOnrampConfig(
  env: any,
  location: { country: string; subdivision?: string; currency: string },
  device: { userAgent: string | null },
  targetAsset: TargetAsset,
  origin: string,
): Promise<OnrampConfigResponse> {
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

  const sessionId = await createSession(env.SESSIONS, {
    location,
    device,
    targetAsset,
    origin,
  });

  return {
    sessionId,
    ...aggregatedOptions,
  } as OnrampConfigResponse;
}

export async function generateOnrampUrl(
  env: any,
  sessionId: string,
  formData: any,
): Promise<OnrampInitResponse> {
  const session = await getSession(env.SESSIONS, sessionId);
  if (!session) {
    throw new Error("Invalid session ID");
  }

  const {
    amount,
    paymentMethod,
    recipientAddress,
    selectedAsset,
    selectedCurrency,
  } = formData;

  const quoteFormData = {
    amount,
    destinationAsset: session.targetAsset,
    recipientAddress,
    paymentMethod,
  };

  const { swapQuote } = await getCombinedQuote(
    env,
    quoteFormData,
    session.location.country,
    false,
  );

  const depositAddress = swapQuote.quote.depositAddress;

  const callbackParams = new URLSearchParams({
    type: "intents",
    action: "withdraw",
    network: session.targetAsset.chain,
    asset: session.targetAsset.asset,
    amount: amount,
    recipient: recipientAddress,
    depositAddress,
  });

  const redirectUrl = `${session.origin}/onramp/callback?${callbackParams.toString()}`;

  const { redirectUrl: onrampUrl } = await coinbaseProvider.generateOnrampUrl(
    env,
    {
      amount,
      asset: selectedAsset,
      network: "base",
      address: depositAddress,
      redirectUrl,
      paymentCurrency: selectedCurrency,
      paymentMethod
    },
  );

  return { redirectUrl: onrampUrl };
}
