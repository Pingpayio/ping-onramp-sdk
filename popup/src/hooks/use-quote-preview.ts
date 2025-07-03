import {
  onrampConfigQueryOptions,
  onrampQuoteQueryOptions,
} from "@/lib/pingpay-api";
import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import { onrampTargetAtom } from "@/state/atoms";
import type {
  OnrampConfigResponse,
  PaymentMethodLimit,
} from "@pingpay/onramp-types";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

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

export function useQuotePreview({
  amount,
  selectedCurrency,
  paymentMethod,
}: Omit<FormValues, "selectedAsset" | "recipientAddress">) {
  const onrampTarget = useAtomValue(onrampTargetAtom);
  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget),
  );

  const {
    data: quote,
    error,
    isLoading,
  } = useQuery({
    ...onrampQuoteQueryOptions({
      amount,
      sourceCurrency: selectedCurrency,
      destinationAsset: onrampTarget,
      paymentMethod,
    }),
    enabled: isAmountValid(amount, paymentMethod, onrampConfig),
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
