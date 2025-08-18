import { ErrorView } from "@/components/steps/error-view";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useParentMessenger,
  useReportStep,
} from "@/hooks/use-parent-messenger";
import { isAmountValid, useQuotePreview } from "@/hooks/use-quote-preview";
import { initOnramp, onrampConfigQueryOptions } from "@/lib/pingpay-api";
import { onrampTargetAtom } from "@/state/atoms";
import type { PaymentMethodLimit } from "@pingpay/onramp-types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DepositAmountInput } from "@/components/form/deposit-amount-input";
import { PaymentMethodSelector } from "@/components/form/payment-method-selector";
import { ReceiveAmountDisplay } from "@/components/form/receive-amount-display";
import { WalletAddressInput } from "@/components/form/wallet-address-input";
import { CurrencySelector } from "@/components/currency-selector";
import { AssetSelector } from "@/components/asset-selector";
import { PaymentMethodModal } from "@/components/payment-method-modal";
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
  loader: async ({ context }) => {
    const targetAsset = context.store.get(onrampTargetAtom);
    console.log("targetAsset", targetAsset);
    if (!targetAsset) {
      throw new Error("Onramp target asset is missing. Cannot proceed.");
    }
    const onrampConfig = await context.queryClient.ensureQueryData(
      onrampConfigQueryOptions(targetAsset)
    );
    return { onrampConfig, targetAsset };
  },
  component: FormEntryRoute,
});

function FormEntryRoute() {
  const { call } = useParentMessenger();
  const { onrampConfig, targetAsset: onrampTarget } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

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
    setValue,
    formState: { isValid },
    trigger,
  } = methods;

  const [depositAmountWatcher, paymentMethodWatcher, selectedCurrencyWatcher, selectedAssetWatcher] =
    watch(["amount", "paymentMethod", "selectedCurrency", "selectedAsset"]);
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
      validate: (value: string) => {
        if (onrampConfig && paymentMethodWatcher) {
          const paymentCurrency = onrampConfig.paymentCurrencies[0];
          const limit = paymentCurrency.limits.find(
            (l: PaymentMethodLimit) =>
              l.id.toLowerCase() === paymentMethodWatcher.toLowerCase()
          );
          if (!isAmountValid(value, paymentMethodWatcher, onrampConfig)) {
            if (limit) {
              const numericValue = parseFloat(value);
              if (numericValue < parseFloat(limit.min)) {
                return `Minimum amount is ${limit.min}`;
              }
              if (numericValue > parseFloat(limit.max)) {
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
      onrampConfig,
      onrampTarget,
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
          "Development mode: Navigating to onramp-callback with params:"
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

  const handleCurrencySelect = (currencyId: string) => {
    setValue("selectedCurrency", currencyId);
    setIsCurrencySelectorOpen(false);
  };

  const handleCloseCurrencySelector = () => {
    setIsCurrencySelectorOpen(false);
  };

  const handleAssetSelect = (assetId: string) => {
    setValue("selectedAsset", assetId);
    setIsAssetSelectorOpen(false);
  };

  const handleCloseAssetSelector = () => {
    setIsAssetSelectorOpen(false);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setValue("paymentMethod", methodId);
    setIsPaymentMethodModalOpen(false);
  };

  const handleClosePaymentMethodModal = () => {
    setIsPaymentMethodModalOpen(false);
  };

  const handlePaymentMethodChange = () => {
    // Open the modal after a dropdown selection is made
    setIsPaymentMethodModalOpen(true);
  };

  return (
    <>
      <CurrencySelector
        isOpen={isCurrencySelectorOpen}
        onClose={handleCloseCurrencySelector}
        currencies={onrampConfig.paymentCurrencies}
        selectedCurrency={selectedCurrencyWatcher}
        onSelectCurrency={handleCurrencySelect}
      />
      <AssetSelector
        isOpen={isAssetSelectorOpen}
        onClose={handleCloseAssetSelector}
        selectedAsset={selectedAssetWatcher}
        onSelectAsset={handleAssetSelect}
      />
      <PaymentMethodModal
        isOpen={isPaymentMethodModalOpen}
        onClose={handleClosePaymentMethodModal}
        selectedPaymentMethod={paymentMethodWatcher}
        onSelectPaymentMethod={handlePaymentMethodSelect}
        isIosDevice={onrampConfig.isIosDevice}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
          className=" rounded-xl shadow-sm border-white/[0.16] space-y-3"
        >
          <Header
            title="Buy Assets"
            showCloseIcon={isCurrencySelectorOpen}
            onClose={handleCloseCurrencySelector}
          />

          <DepositAmountInput 
            validationRules={getValidationRules()} 
            onCurrencyClick={() => setIsCurrencySelectorOpen(true)}
          />

          <ReceiveAmountDisplay
            estimatedReceiveAmount={estimatedReceiveAmount}
            isQuoteLoading={isQuoteLoading}
            quoteError={error instanceof Error ? error.message : undefined}
            depositAmount={depositAmountWatcher}
            quote={quote}
            onrampTarget={onrampTarget}
            onAssetClick={() => setIsAssetSelectorOpen(true)}
            selectedAsset={selectedAssetWatcher}
          />

          <WalletAddressInput onrampTarget={onrampTarget} />

          <PaymentMethodSelector 
            onrampConfig={onrampConfig} 
            onPaymentMethodChange={handlePaymentMethodChange}
          />

          <Button
            type="submit"
            className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] rounded-full! transition ease-in-out duration-150"
            disabled={!isValid || !quote || isQuoteLoading}
          >
            Buy {onrampTarget?.asset}
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
