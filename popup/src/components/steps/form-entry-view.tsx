import { useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { useQuotePreview } from "@/hooks/use-quote-preview";
import { useWalletState } from "@/hooks/use-wallet-state";
import { onrampTargetAtom } from "@/state/atoms";
import { useQuery } from "@tanstack/react-query";
import { onrampConfigQueryOptions } from "@/lib/coinbase";
import type { OnrampConfigResponse, PaymentMethodLimit } from "@pingpay/onramp-types";
import { useEffect, useRef } from "react";

import { DepositAmountInput } from "../form/deposit-amount-input";
import { PaymentMethodSelector } from "../form/payment-method-selector";
import { ReceiveAmountDisplay } from "../form/receive-amount-display";
import { WalletAddressInput } from "../form/wallet-address-input";
import Header from "../header";
import { Button } from "../ui/button";

export type FormValues = {
  amount: string;
  selectedAsset: string; // The asset to buy
  selectedCurrency: string;
  paymentMethod: string;
  recipientAddress: string; // Recipient wallet address
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
  onDisconnect: () => void;
}

export const FormEntryView: React.FC<FormEntryViewProps> = ({ onSubmit }) => {
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
    getValues,
    trigger,
  } = methods;

  const { data: onrampConfig } = useQuery(onrampConfigQueryOptions(onrampTarget)) as {
    data: OnrampConfigResponse | undefined;
  };

  const depositAmountWatcher = watch("amount");
  const paymentMethodWatcher = watch("paymentMethod");

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    trigger("amount");
  }, [paymentMethodWatcher, trigger]);

  const getValidationRules = () => {
    const rules: any = {
      valueAsNumber: true,
      validate: (value: number) => {
        if (onrampConfig && paymentMethodWatcher) {
          const paymentCurrency = onrampConfig.paymentCurrencies?.[0];
          if (paymentCurrency) {
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
        }
        return true;
      },
    };

    return rules;
  };

  useWalletState();
  const { estimatedReceiveAmount, isQuoteLoading, quoteError } =
    useQuotePreview({
      amount: depositAmountWatcher,
      getFormValues: getValues,
    });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" rounded-xl shadow-sm border-white/[0.16] space-y-3"
      >
        <Header title="Buy Assets" />

        <DepositAmountInput validationRules={getValidationRules()} />

        <ReceiveAmountDisplay
          estimatedReceiveAmount={estimatedReceiveAmount}
          isQuoteLoading={isQuoteLoading}
          quoteError={quoteError}
          depositAmount={depositAmountWatcher}
        />

        <WalletAddressInput />

        <PaymentMethodSelector />

        <Button
          type="submit"
          className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] rounded-full! transition ease-in-out duration-150"
          disabled={!isValid || !estimatedReceiveAmount || isQuoteLoading}
        >
          Buy {onrampTarget.asset}
        </Button>
      </form>
    </FormProvider>
  );
};
