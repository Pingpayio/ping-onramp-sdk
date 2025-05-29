import { Wallet } from "@coinbase/onchainkit/wallet";
import { useSetAtom } from "jotai";
import React, { useState } from "react"; // Added useState
import { FormProvider, useForm, Controller } from "react-hook-form"; // Added Controller
import { useAccount } from "wagmi";
import { walletStateAtom } from "../../state/atoms";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Added Select components

export type FormValues = {
  amount: string;
  selectedAsset: string;
  selectedCurrency: string;
  paymentMethod: string;
  nearWalletAddress?: string;
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
  generatedEvmAddress?: string; // To display the generated EVM address
}

const FormEntryView: React.FC<FormEntryViewProps> = ({ onSubmit, generatedEvmAddress }) => {
          const methods = useForm<FormValues>({
            mode: 'onChange', // Ensure form validity is updated on change
            defaultValues: {
              amount: "",
              selectedAsset: "USDC",
              selectedCurrency: "USD",
              paymentMethod: "card", // Default payment method
              nearWalletAddress: "", // This will be for the user's NEAR wallet input
            },
          });
          const { handleSubmit, register, control, watch, formState: { isValid } } = methods; // Added formState: { isValid }
  const { address, chainId, isConnected } = useAccount();
  const setWalletState = useSetAtom(walletStateAtom);

  // For payment method subtext
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(methods.getValues("paymentMethod"));
  const paymentMethodWatcher = watch("paymentMethod");

  React.useEffect(() => {
    setCurrentPaymentMethod(paymentMethodWatcher);
  }, [paymentMethodWatcher]);

  const getMethodSubtext = (method: string) => {
    switch (method) {
      case "card":
        return "Debit or Credit Card (Available in most countries)";
      case "ach":
        return "Bank Transfer (ACH) - US only";
      case "apple":
        return "Apple Pay - Available on iOS devices";
      default:
        return "";
    }
  };

  React.useEffect(() => {
    if (isConnected && address) {
      setWalletState({
        address,
        chainId: chainId?.toString(), // chainId can be undefined if not available
        // walletName could be added here if available from useAccount or another source
      });
    } else {
      // Set to null or an empty state if that's how disconnection is represented
      // For WalletState | null, setting to null is appropriate
      setWalletState(null);
    }
  }, [address, chainId, isConnected, setWalletState]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Onramp Details</h2>

        <div className="my-4 p-3 border border-gray-700 rounded-lg bg-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            Connect Your Wallet
          </h3>
          <div className="flex justify-center">
            <Wallet />
          </div>
          {isConnected && address && (
            <div className="mt-3 text-center text-sm text-green-400">
              Connected: {address.substring(0, 6)}...
              {address.substring(address.length - 4)}
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300"
          >
            Amount
          </Label>
          <Input
            type="number"
            id="amount"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be positive" },
            })}
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 100"
          />
          {methods.formState.errors.amount && (
            <p className="text-red-400 text-xs mt-1">
              {methods.formState.errors.amount.message}
            </p>
          )}
        </div>

        {/* Asset Display (Disabled USDC) */}
        <div>
          <Label
            htmlFor="selectedAsset"
            className="block text-sm font-medium text-white mb-1"
          >
            Asset
          </Label>
          <div className="w-full justify-between bg-white/[0.08] hover:bg-white/5 border border-[rgba(255,255,255,0.18)] h-[42px] text-left px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 touch-feedback flex items-center rounded-md">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-1.5 mr-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src="/cryptologos/usd-coin-usdc-logo.svg"
                    alt="USDC"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-normal text-white/60 text-sm">USDC</span>
            </div>
          </div>
          {/* Hidden input to keep "USDC" in form data */}
          <input type="hidden" {...register("selectedAsset")} value="USDC" />
        </div>

        {/* Currency Display (Disabled USD) */}
        <div>
          <Label
            htmlFor="selectedCurrency"
            className="block text-sm font-medium text-white mb-1"
          >
            Currency
          </Label>
          <div className="w-full justify-between bg-white/[0.08] hover:bg-white/5 border border-[rgba(255,255,255,0.18)] h-[42px] text-left px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 touch-feedback flex items-center rounded-md">
            <div className="flex items-center">
              {/* Placeholder for currency icon if available/needed in future */}
              <span className="font-normal text-white/60 text-sm">USD</span>
            </div>
          </div>
          {/* Hidden input to keep "USD" in form data */}
          <input type="hidden" {...register("selectedCurrency")} value="USD" />
        </div>
        
        {/* EVM Deposit Address Display */}
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden relative">
                <img
                    src="/near-intents-logo.png" // Corrected path to available logo
                    alt="EVM Deposit Address Icon"
                    className="w-full h-full object-contain"
                />
                </div>
                <Label className="text-sm text-white">EVM Deposit Address (for USDC)</Label>
            </div>
            <div className="mt-1 block w-full p-2.5 border border-gray-600 rounded bg-gray-800 text-white/80 text-sm min-h-[42px] flex items-center">
              {generatedEvmAddress ? (
                <span className="truncate">{generatedEvmAddress}</span>
              ) : (
                <span className="text-white/50">Awaiting generation...</span>
              )}
            </div>
            <p className="text-xs text-white/50 mt-1 px-1">
                This is the temporary EVM address where you'll send USDC. It will then be bridged to your NEAR address.
            </p>
        </div>

        {/* NEAR Wallet Address Input */}
        <div>
          <Label
            htmlFor="nearWalletAddress"
            className="block text-sm font-medium text-white mb-1"
          >
            Your NEAR Wallet Address
          </Label>
          <Input
            type="text"
            id="nearWalletAddress"
            {...register("nearWalletAddress", {
              required: "NEAR Wallet Address is required",
            })}
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., yourwallet.near"
          />
          {methods.formState.errors.nearWalletAddress && (
            <p className="text-red-400 text-xs mt-1">
              {methods.formState.errors.nearWalletAddress.message}
            </p>
          )}
        </div>

        {/* Payment Method Dropdown */}
        <div>
          <Label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-white mb-2"
          >
            Payment Method
          </Label>
          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: "Payment method is required" }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setCurrentPaymentMethod(value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="rounded-lg hover:shadow-sm transition-shadow bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[42px] text-white/60 flex items-center px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70">
                  <SelectValue placeholder="Select payment method" className="font-normal text-white/60" />
                </SelectTrigger>
                <SelectContent className="bg-[#303030] border-[#AF9EF9] text-white/60">
                  <SelectItem value="card" className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5">Debit or Credit Card</SelectItem>
                  <SelectItem value="ach" className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5">Bank Transfer (ACH)</SelectItem>
                  <SelectItem value="apple" className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5">Apple Pay</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-white/40 mt-1">
            {getMethodSubtext(currentPaymentMethod)}
          </p>
          {methods.formState.errors.paymentMethod && (
            <p className="text-red-400 text-xs mt-1">
              {methods.formState.errors.paymentMethod.message}
            </p>
          )}
        </div>

                <Button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValid} // Disable button if form is not valid
                >
                  Continue
                </Button>
      </form>
    </FormProvider>
  );
};

export default FormEntryView;
