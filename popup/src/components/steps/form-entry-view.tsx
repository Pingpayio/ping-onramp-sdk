import { useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { useQuotePreview } from "@/hooks/use-quote-preview";
import { useWalletState } from "@/hooks/use-wallet-state";
import { onrampTargetAtom } from "@/state/atoms";
import { useQuery } from "@tanstack/react-query";
import { onrampConfigQueryOptions } from "@/lib/coinbase";
import type {
  OnrampQuoteResponse,
  PaymentMethodLimit,
} from "@pingpay/onramp-types";
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash-es";

import { DepositAmountInput } from "../form/deposit-amount-input";
import { PaymentMethodSelector } from "../form/payment-method-selector";
import { ReceiveAmountDisplay } from "../form/receive-amount-display";
import { WalletAddressInput } from "../form/wallet-address-input";
import Header from "../header";
import { Button } from "../ui/button";

export interface FormValues {
  amount: string;
  selectedAsset: string; // The asset to buy
  selectedCurrency: string;
  paymentMethod: string;
  recipientAddress: string; // Recipient wallet address
}

interface FormEntryViewProps {
  onSubmit: (data: FormValues, quote: OnrampQuoteResponse) => void;
  onDisconnect: () => void;
}

export const FormEntryView: React.FC<FormEntryViewProps> = ({
  onSubmit,
}) => {
  const onrampTarget = useAtomValue(onrampTargetAtom);

  const methods = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      amount: "",
      selectedAsset: "USDC",
      selectedCurrency: "USD",
      paymentMethod: "CARD",
      recipientAddress: "",
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid },
    trigger,
  } = methods;

  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget)
  );

  const [
    depositAmountWatcher,
    paymentMethodWatcher,
    recipientAddressWatcher,
    selectedCurrencyWatcher,
  ] = watch([
    "amount",
    "paymentMethod",
    "recipientAddress",
    "selectedCurrency",
  ]);
  const [debouncedAmount, setDebouncedAmount] = useState("");

  const debouncedSetAmount = useCallback(
    debounce((amount: string) => {
      setDebouncedAmount(amount);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetAmount(depositAmountWatcher);
  }, [depositAmountWatcher, debouncedSetAmount]);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    trigger("amount").catch((e: unknown) => {
      console.error("Failed to trigger amount:", e);
    });
  }, [paymentMethodWatcher, trigger]);

  const getValidationRules = () => {
    const rules = {
      valueAsNumber: true,
      validate: (value: number) => {
        if (onrampConfig && paymentMethodWatcher) {
          const paymentCurrency = onrampConfig.paymentCurrencies[0];
          const limit = paymentCurrency.limits.find(
            (l: PaymentMethodLimit) =>
              l.id.toLowerCase() === paymentMethodWatcher.toLowerCase()
          );
          if (limit) {
            if (value < parseFloat(limit.min)) {
              return `Minimum amount is ${limit.min}`;
            }
            if (value > parseFloat(limit.max)) {
              return `Maximum amount is ${limit.max}`;
            }
          }
        }
        return true;
      },
    };

    return rules;
  };

  useWalletState();
  const { estimatedReceiveAmount, quote, isQuoteLoading, error } =
    useQuotePreview({
      amount: debouncedAmount,
      paymentMethod: paymentMethodWatcher,
      recipientAddress: recipientAddressWatcher,
      selectedCurrency: selectedCurrencyWatcher,
    });

  const handleFormSubmit = (data: FormValues) => {
    if (quote) {
      onSubmit(data, quote);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className=" rounded-xl shadow-sm border-white/[0.16] space-y-3"
      >
        <Header title="Buy Assets" />

        <DepositAmountInput validationRules={getValidationRules()} />

        <ReceiveAmountDisplay
          estimatedReceiveAmount={estimatedReceiveAmount}
          isQuoteLoading={isQuoteLoading}
          quoteError={error instanceof Error ? error.message : String(error)}
          depositAmount={depositAmountWatcher}
          quote={quote}
        />

        <WalletAddressInput />

        <PaymentMethodSelector />

        <Button
          type="submit"
          className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] rounded-full! transition ease-in-out duration-150"
          disabled={!isValid || !quote || isQuoteLoading}
        >
          Buy {onrampTarget.asset}
        </Button>
      </form>
    </FormProvider>
  );
};
