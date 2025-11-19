import { ProviderError, ServiceError } from "../../lib/errors";
import {
  fetch1ClickSupportedTokens,
  find1ClickAsset,
  requestSwapQuote,
  type QuoteRequestParams,
} from "../../lib/one-click-api";
import { OneClickClient } from "../../lib/one-click-client";
import { coinbaseProvider } from "./providers/coinbase";

const ONE_CLICK_REFERRAL_ID = "pingpayio.near";

export async function getCombinedQuote(
  env: any,
  formData: any,
  country: string,
  dryRun = true,
) {
  const { amount, destinationAsset, recipientAddress, paymentMethod } =
    formData;

  const oneClickClient = new OneClickClient(env.INTENTS_API_KEY);

  // 1. Get Onramp Quote
  const onrampQuoteParams = {
    purchase_amount: amount,
    purchase_currency: "usdc",
    purchase_network: "base",
    payment_currency: "USD",
    payment_method: paymentMethod,
    country: country,
  };

  const onrampQuote = await coinbaseProvider.getOnrampQuote(
    env,
    onrampQuoteParams,
  );

  // 2. Get 1-Click Swap Quote
  if (!destinationAsset.asset || !destinationAsset.chain) {
    throw new ServiceError("Onramp target asset or chain is not defined.");
  }
  const supportedTokens = await fetch1ClickSupportedTokens(oneClickClient);
  const originAsset1Click = find1ClickAsset(
    supportedTokens,
    onrampQuoteParams.purchase_currency,
    onrampQuoteParams.purchase_network,
  );
  const destinationAsset1Click = find1ClickAsset(
    supportedTokens,
    destinationAsset.asset as string,
    destinationAsset.chain as string,
  );

  if (!originAsset1Click || !destinationAsset1Click) {
    throw new ServiceError("Could not find required assets for the quote.");
  }

  const amountInSmallestUnit = BigInt(
    Math.floor(
      parseFloat(onrampQuote.purchase_amount.value) *
        10 ** originAsset1Click.decimals,
    ),
  ).toString();

  const quoteDeadline = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  let recipientForPreview: string;
  if (destinationAsset1Click.blockchain.toLowerCase() === "near") {
    recipientForPreview = recipientAddress || "preview.near";
  } else {
    recipientForPreview =
      recipientAddress ||
      "0x0000000000000000000000000000000000000000";
  }

  const swapQuoteParams: QuoteRequestParams = {
    originAsset: originAsset1Click.assetId,
    destinationAsset: destinationAsset1Click.assetId,
    amount: amountInSmallestUnit,
    recipient: recipientForPreview,
    refundTo: env.REFUND_ADDRESS,
    refundType: "ORIGIN_CHAIN",
    depositType: "ORIGIN_CHAIN",
    recipientType: "DESTINATION_CHAIN",
    swapType: "EXACT_INPUT",
    slippageTolerance: 100,
    deadline: quoteDeadline,
    dry: dryRun,
    referral: ONE_CLICK_REFERRAL_ID,
  };

  const swapQuote = await requestSwapQuote(oneClickClient, swapQuoteParams);

  // 3. Combine Quotes
  let swapFee = 0;
  if (onrampQuote.payment_subtotal?.value && swapQuote.quote.amountOutUsd) {
    const amountIn = parseFloat(onrampQuote.payment_subtotal.value);
    const amountOut = parseFloat(swapQuote.quote.amountOutUsd);
    swapFee = Math.max(0, amountIn - amountOut);
  }
  const networkFee = parseFloat(onrampQuote.network_fee.value);
  const providerFee = parseFloat(onrampQuote.coinbase_fee.value);
  const totalFee = networkFee + providerFee + swapFee;

  return {
    swapQuote,
    onrampQuote,
    fees: {
      maxSlippage: `${swapQuote.quoteRequest.slippageTolerance / 100}%`,
      networkFee: networkFee.toFixed(2),
      providerFee: providerFee.toFixed(2),
      swapFee: swapFee.toFixed(2),
      pingpayFee: "0.00",
      totalFee: totalFee.toFixed(2),
    },
    estimatedReceiveAmount: swapQuote.quote.amountOutFormatted,
  };
}
