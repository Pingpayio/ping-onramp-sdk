import { useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { onrampTargetAtom } from "../../state/atoms";
import type { TargetAsset } from "../../../../src/internal/communication/messages";
import { useQuotePreview } from "../../hooks/use-quote-preview";
import { useWalletState } from "../../hooks/use-wallet-state";

import Header from "../header";
import { Button } from "../ui/button";
import { DepositAmountInput } from "../form/deposit-amount-input";
import { ReceiveAmountDisplay } from "../form/receive-amount-display";
import { WalletAddressInput } from "../form/wallet-address-input";
import { PaymentMethodSelector } from "../form/payment-method-selector";

export type FormValues = {
  amount: string;
  selectedAsset: string; // This is the asset to buy on Coinbase (e.g., USDC)
  selectedCurrency: string;
  paymentMethod: string;
  recipientAddress: string; // Recipient wallet address
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
  onDisconnect: () => void;
}

const FALLBACK_TARGET_ASSET: TargetAsset = {
  chain: "NEAR",
  asset: "wNEAR",
};

export const FormEntryView: React.FC<FormEntryViewProps> = ({ onSubmit }) => {
  const onrampTargetFromAtom = useAtomValue(onrampTargetAtom);
  const currentOnrampTarget = onrampTargetFromAtom ?? FALLBACK_TARGET_ASSET;

  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      amount: "",
      selectedAsset: "USDC",
      selectedCurrency: "USD",
      paymentMethod: "card",
      recipientAddress: "",
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid },
    getValues,
  } = methods;

  const depositAmountWatcher = watch("amount");

  // Use custom hooks
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

        <DepositAmountInput />

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
          disabled={!isValid}
        >
          Buy {currentOnrampTarget.asset}
        </Button>
      </form>
    </FormProvider>
  );
};
