import { ErrorView } from "@/components/steps/error-view";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useParentMessenger,
  useReportStep,
} from "@/hooks/use-parent-messenger";
import { isAmountValid, useQuotePreview } from "@/hooks/use-quote-preview";
import { initOnramp, onrampConfigQueryOptions } from "@/lib/pingpay-api";
import { onrampTargetAtom } from "@/state/atoms";
import { useOnrampTarget } from "@/state/hooks";
import type { PaymentMethodLimit } from "@pingpay/onramp-types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DepositAmountInput } from "@/components/form/deposit-amount-input";
import { PaymentMethodSelector } from "@/components/form/payment-method-selector";
import { ReceiveAmountDisplay } from "@/components/form/receive-amount-display";
import { WalletAddressInput } from "@/components/form/wallet-address-input";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { SKIP_REDIRECT } from "@/config";

export interface FormValues {
  amount: string;
  selectedAsset: string;
  selectedCurrency: string;
  paymentMethod: string;
  recipientAddress: string;
}

export const Route = createFileRoute("/_layout/onramp/form-entry")({
  errorComponent: ({ error, reset }) => (
    <ErrorView error={error.message} onRetry={reset} />
  ),
  loader: ({ context }) => {
    const targetAsset = context.store.get(onrampTargetAtom);
    return context.queryClient.ensureQueryData(
      onrampConfigQueryOptions(targetAsset),
    );
  },
  component: FormEntryRoute,
});

function FormEntryRoute() {
  const { call } = useParentMessenger();
  const [onrampTarget] = useOnrampTarget();
  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget),
  );
  const navigate = Route.useNavigate();

  useReportStep("form-entry");

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

  const [depositAmountWatcher, paymentMethodWatcher, selectedCurrencyWatcher] =
    watch(["amount", "paymentMethod", "selectedCurrency"]);
  const debouncedAmount = useDebounce(depositAmountWatcher, 300);

  useEffect(() => {
    if (depositAmountWatcher) {
      trigger("amount").catch((e: unknown) => {
        console.error("Failed to trigger amount:", e);
      });
    }
  }, [paymentMethodWatcher, trigger, depositAmountWatcher]);

  const getValidationRules = () => {
    const rules = {
      valueAsNumber: true,
      validate: (value: number) => {
        if (onrampConfig && paymentMethodWatcher) {
          const paymentCurrency = onrampConfig.paymentCurrencies[0];
          const limit = paymentCurrency.limits.find(
            (l: PaymentMethodLimit) =>
              l.id.toLowerCase() === paymentMethodWatcher.toLowerCase(),
          );
          if (
            !isAmountValid(value.toString(), paymentMethodWatcher, onrampConfig)
          ) {
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

  const { estimatedReceiveAmount, quote, isQuoteLoading, error } =
    useQuotePreview({
      amount: debouncedAmount,
      paymentMethod: paymentMethodWatcher,
      selectedCurrency: selectedCurrencyWatcher,
    });

  const handleFormSubmit = async (data: FormValues) => {
    if (!quote) {
      return;
    }
    call("reportFormDataSubmitted", { formData: data })?.catch((e: unknown) => {
      console.error("Failed to report form data submitted:", e);
    });
    
    void navigate({
      to: "/onramp/initiating",
    });

    try {
      const { redirectUrl: onrampUrl } = await initOnramp(data);

      console.log("SKIP_REDIRECT", SKIP_REDIRECT);
      console.log("typeof SKIP_REDIRECT", typeof SKIP_REDIRECT);

      await call("reportOnrampInitiated", {
        serviceName: "Onramp (via 1Click)",
        details: {
          url: SKIP_REDIRECT
            ? "ROUTER_NAVIGATION:USING_TANSTACK_ROUTER"
            : onrampUrl,
          onrampUrl,
        },
      });
      if (SKIP_REDIRECT === "true") {
        // In development: Use router to navigate to the onramp-callback route
        console.log(
          "Development mode: Navigating to onramp-callback with params:",
        );
        const url = new URL(onrampUrl);
        const targetRedirectUrl = url.searchParams.get("redirectUrl");
        window.location.href = targetRedirectUrl!;
      } else {
        // In production: Redirect to Onramp URL
        console.log("Production mode: Redirecting to Onramp URL");
        window.location.href = onrampUrl;
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);

      void navigate({
        to: "/onramp/error",
        search: {
          error: errorMsg || "Failed to initiate onramp.",
        },
      });
      call("reportProcessFailed", {
        error: errorMsg,
        step: "initiating-onramp-service",
      })?.catch((e: unknown) => {
        console.error("Failed to report process failure:", e);
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
        className=" rounded-xl shadow-sm border-white/[0.16] space-y-3"
      >
        <Header title="Buy Assets" />

        <DepositAmountInput validationRules={getValidationRules()} />

        <ReceiveAmountDisplay
          estimatedReceiveAmount={estimatedReceiveAmount}
          isQuoteLoading={isQuoteLoading}
          quoteError={error instanceof Error ? error.message : undefined}
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
}
