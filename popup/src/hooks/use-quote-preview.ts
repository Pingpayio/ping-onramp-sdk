import { useState, useCallback, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useAccount } from "wagmi";
import { oneClickSupportedTokensAtom, onrampTargetAtom } from "../state/atoms";
import {
  requestSwapQuote,
  find1ClickAsset,
  type QuoteRequestParams,
  type OneClickToken,
  fetch1ClickSupportedTokens,
} from "../lib/one-click-api";
import type { TargetAsset } from "../../../src/internal/communication/messages";
import { useDebounce } from "./use-debounce";

const FALLBACK_TARGET_ASSET: TargetAsset = {
  chain: "NEAR",
  asset: "wNEAR",
};

const COINBASE_DEPOSIT_NETWORK = "base";
const ONE_CLICK_REFERRAL_ID = "pingpay.near";

interface QuotePreviewState {
  estimatedReceiveAmount: string | null;
  isQuoteLoading: boolean;
  quoteError: string | null;
}

interface UseQuotePreviewParams {
  amount: string;
  getFormValues: () => any;
}

export function useQuotePreview({
  amount,
  getFormValues,
}: UseQuotePreviewParams): QuotePreviewState {
  const onrampTargetFromAtom = useAtomValue(onrampTargetAtom);
  const currentOnrampTarget = onrampTargetFromAtom ?? FALLBACK_TARGET_ASSET;
  const allSupportedTokens = useAtomValue(oneClickSupportedTokensAtom);
  const setAllSupportedTokens = useSetAtom(oneClickSupportedTokensAtom);
  const { address } = useAccount();

  const [estimatedReceiveAmount, setEstimatedReceiveAmount] = useState<
    string | null
  >(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fetchQuotePreview = useCallback(
    async (amountStr: string) => {
      if (!amountStr || parseFloat(amountStr) <= 0) {
        setEstimatedReceiveAmount(null);
        setQuoteError(null);
        setIsQuoteLoading(false);
        return;
      }

      setIsQuoteLoading(true);
      setQuoteError(null);
      setEstimatedReceiveAmount("...");

      try {
        let currentSupportedTokens = allSupportedTokens;
        if (!currentSupportedTokens) {
          currentSupportedTokens = await fetch1ClickSupportedTokens();
          setAllSupportedTokens(currentSupportedTokens);
        }

        if (!currentSupportedTokens || currentSupportedTokens.length === 0) {
          throw new Error("Supported token list is empty or not loaded.");
        }

        const formSnapshot = getFormValues();

        const originAsset1Click: OneClickToken | undefined = find1ClickAsset(
          currentSupportedTokens,
          formSnapshot.selectedAsset,
          COINBASE_DEPOSIT_NETWORK
        );

        const destinationAsset1Click: OneClickToken | undefined =
          find1ClickAsset(
            currentSupportedTokens,
            currentOnrampTarget.asset,
            currentOnrampTarget.chain
          );

        if (!originAsset1Click || !destinationAsset1Click) {
          throw new Error("Could not find required assets for the quote.");
        }

        const amountInSmallestUnit = BigInt(
          Math.floor(parseFloat(amountStr) * 10 ** originAsset1Click.decimals)
        ).toString();

        const quoteDeadline = new Date(
          Date.now() + 5 * 60 * 1000
        ).toISOString();

        let recipientForPreview: string;
        const enteredRecipientAddress = formSnapshot.recipientAddress;

        if (destinationAsset1Click.blockchain.toLowerCase() === "near") {
          recipientForPreview = enteredRecipientAddress || "preview.near";
        } else {
          recipientForPreview =
            enteredRecipientAddress ||
            address ||
            "0x0000000000000000000000000000000000000000";
        }

        const quoteParams: QuoteRequestParams = {
          originAsset: originAsset1Click.assetId,
          destinationAsset: destinationAsset1Click.assetId,
          amount: amountInSmallestUnit,
          recipient: recipientForPreview,
          refundTo: address || "0x0000000000000000000000000000000000000000",
          refundType: "ORIGIN_CHAIN",
          depositType: "ORIGIN_CHAIN",
          recipientType: "DESTINATION_CHAIN",
          swapType: "EXACT_INPUT",
          slippageTolerance: 100,
          deadline: quoteDeadline,
          dry: true,
          referral: ONE_CLICK_REFERRAL_ID,
        };

        const quoteResponse = await requestSwapQuote(quoteParams);
        const rawAmount = parseFloat(quoteResponse.quote.amountOutFormatted);
        if (!isNaN(rawAmount)) {
          const truncatedAmount = Math.floor(rawAmount * 100) / 100;
          setEstimatedReceiveAmount(truncatedAmount.toFixed(2));
        } else {
          setEstimatedReceiveAmount(quoteResponse.quote.amountOutFormatted);
        }
        setQuoteError(null);
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error("Quote preview error:", errorMsg);
        setQuoteError("Unavailable");
        setEstimatedReceiveAmount(null);
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [
      allSupportedTokens,
      currentOnrampTarget,
      address,
      getFormValues,
      setAllSupportedTokens,
    ]
  );

  const debouncedFetchQuotePreview = useDebounce(fetchQuotePreview, 750);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      debouncedFetchQuotePreview(amount);
    } else {
      setEstimatedReceiveAmount(null);
      setQuoteError(null);
      setIsQuoteLoading(false);
    }
  }, [amount, debouncedFetchQuotePreview]);

  // Load supported tokens on mount
  useEffect(() => {
    const loadSupportedTokens = async () => {
      if (!allSupportedTokens) {
        try {
          const tokens = await fetch1ClickSupportedTokens();
          setAllSupportedTokens(tokens);
        } catch (error) {
          console.error("Failed to fetch supported tokens on mount:", error);
          setQuoteError("Could not load token data.");
        }
      }
    };
    loadSupportedTokens();
  }, [allSupportedTokens, setAllSupportedTokens]);

  return {
    estimatedReceiveAmount,
    isQuoteLoading,
    quoteError,
  };
}
