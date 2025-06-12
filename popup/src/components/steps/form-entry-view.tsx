import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
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
} from "../ui/select";
import Header from "../header";

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

export const FormEntryView: React.FC<FormEntryViewProps> = ({
  onSubmit,
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
  const setWalletState = useSetAtom(walletStateAtom);

  // For payment method subtext
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    methods.getValues("paymentMethod"),
  );
  const [isAmountFocused, setIsAmountFocused] = useState(false);

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
        className=" rounded-xl shadow-sm border-white/[0.16] space-y-3"
      >
        <Header title="Buy Assets" />
        {/* Amount Input */}
        <div
          className={`w-full p-4 border gap-2 flex flex-col hover:border-[#AF9EF9] ${
            isAmountFocused ? "border-[#AF9EF9]" : "border-white/[0.18]"
          } rounded-[8px] bg-white/5`}
        >
          <p>Your Deposit</p>
          <div className="flex flex-row items-center justify-between ">
            <Input
              type="number"
              id="amount"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be positive" },
              })}
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
              className=" font-bold border-none text-[18px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px]  text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center  rounded-full bg-white/[0.08] hover:bg-white/5">
              <img
                src="/usd.svg"
                alt="USD Currency Logo"
                width={"20px"}
                height={"20px"}
                className="rounded-full"
              />

              <span className=" text-white font-normal">
                {methods.getValues("selectedCurrency")}{" "}
              </span>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="6"
                  viewBox="0 0 11 6"
                  fill="none"
                >
                  <path
                    d="M1.89917 1L5.89917 5L9.89917 1"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
          )}
          {/* Hidden input to keep "USD" in form data - already part of defaultValues */}
        </div>
        {/* Amount Input */}
        <div className="w-full border gap-2 flex flex-col border-white/[0.18] rounded-[8px] bg-white/5">
          <div className="w-full p-4 gap-2 flex flex-col ">
            <p>You Receive</p>
            <div className="flex flex-row items-center justify-between ">
              <p className=" font-bold border-none text-[18px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px]  text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                100
              </p>
              <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center  rounded-full bg-white/[0.08] hover:bg-white/5">
                <img
                  src="/near-logo-green.png"
                  alt="USD Currency Logo"
                  width={"20px"}
                  height={"20px"}
                  className="rounded-full"
                />

                <span className=" text-white font-normal">NEAR</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                  >
                    <path
                      d="M1.89917 1L5.89917 5L9.89917 1"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[2px] -mt-1 -mb-2 w-full bg-white/5" />
          <div className="w-full py-2 gap-1 px-4 flex shrink-0 items-center justify-end text-[#FFFFFF99] text-xs">
            <p>Network:</p>
            <img
              src="/near-logo-green.png"
              alt="NEAR Protocol Logo"
              className="w-4 h-4 rounded-full"
            />
            <span>NEAR</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="6"
              viewBox="0 0 11 6"
              fill="none"
            >
              <path
                d="M1.89917 1L5.89917 5L9.89917 1"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* NEAR Wallet Address Input */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="nearWalletAddress"
            className="block text-sm text-white mb-1"
          >
            Recipient Wallet Address
          </Label>
          <Input
            type="text"
            id="nearWalletAddress"
            {...register("nearWalletAddress", {
              required: "NEAR Wallet Address is required",
            })}
            className=" block w-full p-4 rounded-lg h-[54px] bg-white/[0.08] border border-[rgba(255,255,255,0.18)]   focus:ring-blue-500 focus:border-blue-500 focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 placeholder:text-base placeholder:font-base"
            placeholder="Enter Recipient Address"
          />
          {errors.nearWalletAddress && (
            <p className="text-red-400 text-xs mt-1">
              {errors.nearWalletAddress.message}
            </p>
          )}
          <p className="text-xs text-white/50 mt-1 px-1">
            Funds will be on-ramped and then bridged to this address.
          </p>
        </div>

        {/* Payment Method Dropdown */}
        <div className="flex flex-col gap-1 z-50">
          <Label
            htmlFor="paymentMethod"
            className="block text-sm text-white mb-2"
          >
            Pay Using
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
                <SelectTrigger className="w-full rounded-lg hover:shadow-sm transition-shadow z-50 bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[42px] text-white flex items-center px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70">
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

        <Button
          type="submit"
          className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 py-2 transition ease-in-out duration-150"
          disabled={!isValid}
        >
          Buy NEAR
        </Button>
      </form>
    </FormProvider>
  );
};