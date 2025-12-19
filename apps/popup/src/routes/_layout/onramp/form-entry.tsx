import { RegionNotSupportedPopup } from "@/components/region-not-supported-popup";
import { ErrorView } from "@/components/steps/error-view";
import { useDebounce } from "@/hooks/use-debounce";
import { isAmountValid, useQuotePreview } from "@/hooks/use-quote-preview";
import { initOnramp, onrampConfigQueryOptions } from "@/lib/pingpay-api";
import { appFeesAtom, onrampTargetAtom } from "@/state/atoms";
import type { PaymentMethodLimit, TargetAsset } from "@pingpay/onramp-types";
import { getAssetDisplaySymbol, getAssetSymbol } from "@pingpay/onramp-types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { AssetSelector, assetsByNetwork } from "@/components/asset-selector";
import { CurrencySelector } from "@/components/currency-selector";
import { NetworkSelector } from "@/components/network-selector";
import { DepositAmountInput } from "@/components/form/deposit-amount-input";
import { PaymentMethodSelector } from "@/components/form/payment-method-selector";
import { ReceiveAmountDisplay } from "@/components/form/receive-amount-display";
import { WalletAddressInput } from "@/components/form/wallet-address-input";
import Header from "@/components/header";
import { PaymentMethodModal } from "@/components/payment-method-modal";
import { Button } from "@/components/ui/button";

export interface FormValues {
  amount: string;
  selectedAsset: string;
  selectedNetwork: string;
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
    return {
      onrampConfig,
      targetAsset,
      showRegionError: !onrampConfig.isRegionSupported,
    };
  },
  component: FormEntryRoute,
});

function FormEntryRoute() {
  const {
    onrampConfig,
    targetAsset: onrampTarget,
    showRegionError,
  } = Route.useLoaderData();
  const { store } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
    useState(false);

  // Map API asset name back to dropdown ID (reverse of getTargetAssetFromSelectedAsset)
  const getDefaultAssetFromTarget = (target: TargetAsset): string => {
    const reverseMap: Record<string, string> = {
      wNEAR: "Near",
      wnear: "Near",
      NEAR: "Near",
      USDC: "USD Coin",
      USDT: "Tether USD",
      SOL: "Solana",
      BTC: "Bitcoin",
      ETH: "Ethereum",
      LOUD: "Loud",
      ZEC: "Zcash",
    };

    return reverseMap[target.asset] || "USD Coin"; // fallback to USDC
  };

  const methods = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      amount: "",
      selectedAsset: getDefaultAssetFromTarget(onrampTarget),
      selectedNetwork: onrampTarget.chain.toLowerCase() || "near",
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

  const {
    amount: depositAmountWatcher,
    paymentMethod: paymentMethodWatcher,
    selectedCurrency: selectedCurrencyWatcher,
    selectedAsset: selectedAssetWatcher,
    selectedNetwork: selectedNetworkWatcher,
  } = watch();
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

  // Map selectedAsset string to TargetAsset object
  const getTargetAssetFromSelectedAsset = (
    selectedAsset: string,
    selectedNetwork: string
  ): TargetAsset => {
    const assetName = getAssetSymbol(selectedAsset);

    // Use the selected network instead of base target chain
    return {
      chain: selectedNetwork,
      asset: assetName,
    };
  };

  // Get the target asset based on selected asset and network
  const currentTargetAsset = getTargetAssetFromSelectedAsset(
    selectedAssetWatcher,
    selectedNetworkWatcher
  );

  // Get display name for the selected asset (for button text)
  const getAssetDisplayName = (selectedAsset: string): string => {
    return getAssetDisplaySymbol(selectedAsset);
  };

  const appFees = store.get(appFeesAtom);

  const { estimatedReceiveAmount, quote, isQuoteLoading, error } =
    useQuotePreview({
      amount: debouncedAmount,
      paymentMethod: paymentMethodWatcher,
      selectedCurrency: selectedCurrencyWatcher,
      onrampConfig,
      onrampTarget: currentTargetAsset,
      appFees,
    });
  const handleFormSubmit = async (data: FormValues) => {
    if (!quote) {
      return;
    }

    void navigate({
      to: "/onramp/initiating",
    });

    try {
      const initData = {
        ...data,
        appFees: appFees,
      };

      const { redirectUrl: onrampUrl } = await initOnramp(initData);

      window.location.assign(onrampUrl);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      void navigate({
        to: "/onramp/error",
        search: {
          error: errorMsg || "Failed to initiate onramp.",
        },
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

  const handleNetworkSelect = (networkId: string) => {
    setValue("selectedNetwork", networkId);
    // Reset asset when network changes to ensure compatibility - use first asset from the network's asset list
    const networkAssets = assetsByNetwork[networkId] || [];
    const defaultAsset = networkAssets[0]?.id || "Near";
    setValue("selectedAsset", defaultAsset);
    setIsNetworkSelectorOpen(false);
  };

  const handleCloseNetworkSelector = () => {
    setIsNetworkSelectorOpen(false);
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
      <NetworkSelector
        isOpen={isNetworkSelectorOpen}
        onClose={handleCloseNetworkSelector}
        selectedNetwork={selectedNetworkWatcher}
        onSelectNetwork={handleNetworkSelect}
      />
      <AssetSelector
        isOpen={isAssetSelectorOpen}
        onClose={handleCloseAssetSelector}
        selectedAsset={selectedAssetWatcher}
        selectedNetwork={selectedNetworkWatcher}
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
            selectedNetwork={selectedNetworkWatcher}
            onNetworkClick={() => setIsNetworkSelectorOpen(true)}
            onAssetClick={() => setIsAssetSelectorOpen(true)}
            selectedAsset={selectedAssetWatcher}
          />

          <WalletAddressInput selectedNetwork={selectedNetworkWatcher} />

          <PaymentMethodSelector
            onrampConfig={onrampConfig}
            onPaymentMethodChange={handlePaymentMethodChange}
          />

          <Button
            type="submit"
            className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] rounded-full! transition ease-in-out duration-150"
            disabled={!isValid || !quote || isQuoteLoading}
          >
            Buy {getAssetDisplayName(selectedAssetWatcher)}
          </Button>
        </form>
      </FormProvider>

      {/* Region restriction popup - ready for API integration */}
      <RegionNotSupportedPopup
        isOpen={showRegionError}
        // TODO: Close popup
        onClose={() => console.log("Region popup closed")}
      />
    </>
  );
}
