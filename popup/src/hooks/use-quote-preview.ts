import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { onrampConfigQueryOptions, onrampQuoteQueryOptions } from "@/lib/coinbase";
import { onrampTargetAtom } from "@/state/atoms";

interface UseQuotePreviewParams {
  amount: string;
  selectedAsset: string;
  paymentMethod: string;
  recipientAddress: string;
}

export function useQuotePreview({
  amount,
  selectedAsset,
  paymentMethod,
  recipientAddress,
}: UseQuotePreviewParams) {
  const onrampTarget = useAtomValue(onrampTargetAtom);
  const { address } = useAccount();
  const { data: onrampConfig } = useQuery(onrampConfigQueryOptions(onrampTarget));

  const formData = {
    amount,
    selectedAsset,
    onrampTarget,
    recipientAddress,
    address,
    paymentMethod,
    sessionId: onrampConfig?.sessionId,
  };

  const {
    data: quote,
    error,
    isLoading,
  } = useQuery({
    ...onrampQuoteQueryOptions(formData),
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
