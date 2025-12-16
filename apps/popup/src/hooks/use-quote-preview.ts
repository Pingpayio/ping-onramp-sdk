import { onrampQuoteQueryOptions } from "@/lib/pingpay-api";
import type {
  OnrampConfigResponse,
  PaymentMethodLimit,
  TargetAsset,
} from "@pingpay/onramp-types";
import { useQuery } from "@tanstack/react-query";
import type { OneClickFee } from "@/lib/one-click-api";

export const isAmountValid = (
  amount: string,
  paymentMethod: string,
  onrampConfig: OnrampConfigResponse | undefined,
) => {
  if (!amount || Number.isNaN(parseFloat(amount))) {
    return false;
  }
  const numericAmount = parseFloat(amount);
  if (onrampConfig && paymentMethod) {
    const paymentCurrency = onrampConfig.paymentCurrencies[0];
    const limit = paymentCurrency.limits.find(
      (l: PaymentMethodLimit) =>
        l.id.toLowerCase() === paymentMethod.toLowerCase(),
    );
    if (limit) {
      return (
        numericAmount >= parseFloat(limit.min) &&
        numericAmount <= parseFloat(limit.max)
      );
    }
  }
  return false;
};

interface UseQuotePreviewProps {
  amount: string;
  selectedCurrency: string;
  paymentMethod: string;
  onrampTarget: TargetAsset | null;
  onrampConfig: OnrampConfigResponse | undefined;
  appFees?: OneClickFee[] | null;
}

export function useQuotePreview({
  amount,
  selectedCurrency,
  paymentMethod,
  onrampTarget,
  onrampConfig,
  appFees,
}: UseQuotePreviewProps) {
  const {
    data: quote,
    error,
    isLoading,
  } = useQuery({
    ...onrampQuoteQueryOptions({
      amount,
      sourceCurrency: selectedCurrency,
      destinationAsset: onrampTarget!,
      paymentMethod,
      appFees: appFees || undefined,
    }),
    enabled:
      !!onrampTarget && isAmountValid(amount, paymentMethod, onrampConfig),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    estimatedReceiveAmount: quote?.estimatedReceiveAmount,
    quote,
    error,
    isQuoteLoading: isLoading,
  };
}
