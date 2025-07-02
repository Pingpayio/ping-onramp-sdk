import type { FormValues } from "@/components/steps/form-entry-view";
import { onrampConfigQueryOptions, onrampQuoteQueryOptions } from "@/lib/coinbase";
import { onrampTargetAtom } from "@/state/atoms";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

export function useQuotePreview({
  amount,
  selectedCurrency,
  paymentMethod,
}: Omit<FormValues, 'selectedAsset'>) {
  const onrampTarget = useAtomValue(onrampTargetAtom);
  const { data: onrampConfig } = useQuery(onrampConfigQueryOptions(onrampTarget));

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
      sessionId: onrampConfig?.sessionId ?? '',
    }),
    enabled: !!amount && parseFloat(amount) > 0 && !!onrampConfig?.sessionId,
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
