import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useAccount, useDisconnect } from "wagmi";
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
} from "../ui/select";

export type FormValues = {
  amount: string;
  selectedAsset: string;
  selectedCurrency: string;
  paymentMethod: string;
  nearWalletAddress?: string;
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
  onDisconnect: () => void;
  generatedEvmAddress?: string;
}

const FormEntryView: React.FC<FormEntryViewProps> = ({
  onSubmit,
  onDisconnect,
  // generatedEvmAddress,
}) => {
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      amount: "",
      selectedAsset: "USDC",
      selectedCurrency: "USD", // Will be part of amount display, not separate field
      paymentMethod: "card",
      nearWalletAddress: "",
    },
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isValid, errors },
  } = methods;
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const setWalletState = useSetAtom(walletStateAtom);

  // For payment method subtext
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    methods.getValues("paymentMethod")
  );
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/5 rounded-xl shadow-sm p-4 border border-white/[0.16] space-y-3"
      >
        {isConnected && address && (
          <div className="mt-1 text-center text-xs text-green-400">
            {" "}
            {/* Adjusted margin and text size */}
            Connected: {address.substring(0, 6)}...
            {address.substring(address.length - 4)}
          </div>
        )}

        {/* Amount Input */}
        <div className="w-full mb-3">
          <div className="flex flex-row items-center justify-start py-2">
            <Input
              type="number"
              id="amount"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be positive" },
              })}
              className="text-5xl md:text-6xl font-bold border-none shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] min-h-[60px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="text-5xl md:text-6xl text-white/40 font-normal -ml-1">
              {methods.getValues("selectedCurrency")}{" "}
              {/* Display selected currency */}
            </span>
          </div>
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
          )}
          {/* Hidden input to keep "USD" in form data - already part of defaultValues */}
        </div>

        {/* Asset Display (Disabled USDC) */}
        <div>
          <Label
            htmlFor="selectedAsset"
            className="block text-sm text-white mb-1"
          >
            Select Asset
          </Label>
          <div className="w-full justify-between bg-white/[0.08] hover:bg-white/5 border border-[rgba(255,255,255,0.18)] h-[42px] text-left px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 touch-feedback flex items-center rounded-md">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-1.5 mr-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src="/usd-coin-usdc-logo.svg" // Assuming this path is correct in popup/public
                    alt="USDC"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-normal text-white/60 text-sm">USDC</span>
            </div>
          </div>
          <input type="hidden" {...register("selectedAsset")} value="USDC" />
        </div>

        {/* Network Display (New Field) */}
        <div className="flex flex-col">
          <Label className="text-sm text-white mb-1">Network</Label>
          <div className="rounded-lg hover:shadow-sm transition-shadow bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3 text-white justify-between hover:border-[#AF9EF9]/70">
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full mr-2 overflow-hidden flex items-center justify-center">
                <img
                  src="/near-protocol-near-logo.svg" // Path relative to popup/public
                  alt="NEAR Protocol"
                  className="h-4 w-4 object-contain"
                />
              </div>
              <span className="text-sm font-normal text-white/60">
                NEAR Protocol
              </span>
            </div>
          </div>
        </div>

        {/* NEAR Wallet Address Input */}
        <div>
          <Label
            htmlFor="nearWalletAddress"
            className="block text-sm text-white mb-1"
          >
            NEAR Recipient Address (e.g., alice.near)
          </Label>
          <Input
            type="text"
            id="nearWalletAddress"
            {...register("nearWalletAddress", {
              required: "NEAR Wallet Address is required",
            })}
            className="mt-1 block w-full p-2 rounded-lg bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] text-white/60 placeholder:text-white/60 focus:ring-blue-500 focus:border-blue-500 focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 placeholder:text-sm placeholder:font-normal"
            placeholder="e.g., yourwallet.near"
          />
          {errors.nearWalletAddress && (
            <p className="text-red-400 text-xs mt-1">
              {errors.nearWalletAddress.message}
            </p>
          )}
          <p className="text-xs text-white/50 mt-1 px-1">
            Funds will be on-ramped and then bridged to this NEAR address.
          </p>
        </div>

        {/* Payment Method Dropdown */}
        <div>
          <Label
            htmlFor="paymentMethod"
            className="block text-sm text-white mb-2"
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
                <SelectTrigger className="w-full rounded-lg hover:shadow-sm transition-shadow bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[42px] text-white/60 flex items-center px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70">
                  <SelectValue
                    placeholder="Select payment method"
                    className="font-normal text-white/60"
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#303030] border-[#AF9EF9] text-white/60 w-full">
                  {" "}
                  {/* Added w-full to SelectContent */}
                  <SelectItem
                    value="card"
                    className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5"
                  >
                    Debit or Credit Card
                  </SelectItem>
                  <SelectItem
                    value="ach"
                    className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5"
                  >
                    Bank Transfer (ACH)
                  </SelectItem>
                  <SelectItem
                    value="apple"
                    className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5"
                  >
                    Apple Pay
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-white/40 mt-1">
            {getMethodSubtext(currentPaymentMethod)}
          </p>
          {errors.paymentMethod && (
            <p className="text-red-400 text-xs mt-1">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* EVM Deposit Address Display */}
        {/* <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden relative">
              <img
                src="/near-intents-logo.png"
                alt="EVM Deposit Address Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <Label className="text-sm text-white">
              EVM Deposit Address (for USDC)
            </Label>
          </div>
          <div className="mt-1 min-h-[auto] p-0 border-none bg-transparent text-xs text-[#AF9EF9] font-normal">
            {generatedEvmAddress ? (
              <span className="truncate">{generatedEvmAddress}</span>
            ) : (
              <span className="text-white/70">Awaiting generation...</span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1 px-1">
            This is the temporary EVM address where you'll send USDC. It will
            then be bridged to your NEAR address.
          </p>
        </div> */}

        <Button
          type="submit"
          className="w-full rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 py-2 transition ease-in-out duration-150"
          disabled={!isValid}
        >
          Continue
        </Button>

        {isConnected && (
          <Button
            type="button"
            onClick={() => {
              disconnect();
              onDisconnect();
            }}
            className="w-full mt-2 rounded-full border border-white/20 bg-transparent text-white/60 hover:bg-white/10 disabled:opacity-70 px-4 py-2 transition ease-in-out duration-150"
          >
            Disconnect Wallet
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default FormEntryView;
