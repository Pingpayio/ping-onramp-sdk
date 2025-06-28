import { useAtomValue, useSetAtom } from "jotai";
import React, { useState, useEffect, useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  oneClickSupportedTokensAtom,
  onrampTargetAtom,
  walletStateAtom,
} from "../../state/atoms";
import {
  requestSwapQuote,
  find1ClickAsset,
  type QuoteRequestParams,
  type OneClickToken,
  fetch1ClickSupportedTokens,
} from "../../lib/one-click-api";
import { useAccount } from "wagmi";
import type { TargetAsset } from "@pingpay/onramp-sdk";

import Header from "../header";
import LoadingSpinner from "../loading-spinner";
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
  selectedAsset: string; // This is the asset to buy on Coinbase (e.g., USDC)
  selectedCurrency: string;
  paymentMethod: string;
  nearWalletAddress: string; // Made non-optional
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
  onDisconnect: () => void;
}

const FALLBACK_TARGET_ASSET: TargetAsset = {
  chain: "NEAR",
  asset: "wNEAR",
};

const COINBASE_DEPOSIT_NETWORK = "base";
const ONE_CLICK_REFERRAL_ID = "pingpay.near";

// Simple debounce utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const FormEntryView: React.FC<FormEntryViewProps> = ({ onSubmit }) => {
  const onrampTargetFromAtom = useAtomValue(onrampTargetAtom);
  const currentOnrampTarget = onrampTargetFromAtom ?? FALLBACK_TARGET_ASSET;
  const allSupportedTokens = useAtomValue(oneClickSupportedTokensAtom);
  const setAllSupportedTokens = useSetAtom(oneClickSupportedTokensAtom);

  const [estimatedReceiveAmount, setEstimatedReceiveAmount] = useState<
    string | null
  >(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      amount: "",
      selectedAsset: "USDC", // Asset to buy on Coinbase
      selectedCurrency: "USD",
      paymentMethod: "card",
      nearWalletAddress: "", // Will be validated as required
    },
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isValid, errors },
    getValues,
  } = methods;
  const { address, chainId, isConnected } = useAccount();
  const setWalletState = useSetAtom(walletStateAtom);
  const depositAmountWatcher = watch("amount");

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

  const fetchQuotePreview = useCallback(
    async (amountStr: string) => {
      if (!amountStr || parseFloat(amountStr) <= 0) {
        setEstimatedReceiveAmount(null);
        setQuoteError(null);
        setIsQuoteLoading(false);
        return;
      }

      setIsQuoteLoading(true);
      setQuoteError(null);
      setEstimatedReceiveAmount("..."); // Placeholder for loading

      try {
        let currentSupportedTokens = allSupportedTokens;
        if (!currentSupportedTokens) {
          currentSupportedTokens = await fetch1ClickSupportedTokens();
          setAllSupportedTokens(currentSupportedTokens);
        }

        if (!currentSupportedTokens || currentSupportedTokens.length === 0) {
          throw new Error("Supported token list is empty or not loaded.");
        }

        const formSnapshot = getValues();

        const originAsset1Click: OneClickToken | undefined = find1ClickAsset(
          currentSupportedTokens,
          formSnapshot.selectedAsset,
          COINBASE_DEPOSIT_NETWORK,
        );

        const destinationAsset1Click: OneClickToken | undefined =
          find1ClickAsset(
            currentSupportedTokens,
            currentOnrampTarget.asset,
            currentOnrampTarget.chain,
          );

        if (!originAsset1Click || !destinationAsset1Click) {
          throw new Error("Could not find required assets for the quote.");
        }

        const amountInSmallestUnit = BigInt(
          Math.floor(parseFloat(amountStr) * 10 ** originAsset1Click.decimals),
        ).toString();

        const quoteDeadline = new Date(
          Date.now() + 5 * 60 * 1000,
        ).toISOString();

        let recipientForPreview: string;
        const enteredNearWalletAddress = formSnapshot.nearWalletAddress;

        if (destinationAsset1Click.blockchain.toLowerCase() === "near") {
          recipientForPreview = enteredNearWalletAddress || "preview.near";
        } else {
          recipientForPreview =
            enteredNearWalletAddress ||
            address ||
            "0x0000000000000000000000000000000000000000";
        }

        const quoteParams: QuoteRequestParams = {
          originAsset: originAsset1Click.assetId,
          destinationAsset: destinationAsset1Click.assetId,
          amount: amountInSmallestUnit,
          recipient: recipientForPreview,
          refundTo: address || "0x0000000000000000000000000000000000000000",
          refundType: "ORIGIN_CHAIN",
          depositType: "ORIGIN_CHAIN",
          recipientType: "DESTINATION_CHAIN",
          swapType: "EXACT_INPUT",
          slippageTolerance: 100, // 1%
          deadline: quoteDeadline,
          dry: true, // CRITICAL: For preview only
          referral: ONE_CLICK_REFERRAL_ID,
        };

        const quoteResponse = await requestSwapQuote(quoteParams);
        const rawAmount = parseFloat(quoteResponse.quote.amountOutFormatted);
        if (!isNaN(rawAmount)) {
          const truncatedAmount = Math.floor(rawAmount * 100) / 100;
          setEstimatedReceiveAmount(truncatedAmount.toFixed(2));
        } else {
          // Fallback if parsing fails, though amountOutFormatted should be a number string
          setEstimatedReceiveAmount(quoteResponse.quote.amountOutFormatted);
        }
        setQuoteError(null);
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error("Quote preview error:", errorMsg);
        setQuoteError("Unavailable");
        setEstimatedReceiveAmount(null);
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [
      allSupportedTokens,
      currentOnrampTarget,
      address,
      getValues,
      setAllSupportedTokens,
    ],
  );

  const debouncedFetchQuotePreview = useCallback(
    debounce(fetchQuotePreview, 750),
    [fetchQuotePreview],
  );

  useEffect(() => {
    if (depositAmountWatcher && parseFloat(depositAmountWatcher) > 0) {
      debouncedFetchQuotePreview(depositAmountWatcher);
    } else {
      setEstimatedReceiveAmount(null);
      setQuoteError(null);
      setIsQuoteLoading(false);
    }
  }, [depositAmountWatcher, debouncedFetchQuotePreview]);

  useEffect(() => {
    const loadSupportedTokens = async () => {
      if (!allSupportedTokens) {
        try {
          const tokens = await fetch1ClickSupportedTokens();
          setAllSupportedTokens(tokens);
        } catch (error) {
          console.error("Failed to fetch supported tokens on mount:", error);
          setQuoteError("Could not load token data.");
        }
      }
    };
    loadSupportedTokens();
  }, [allSupportedTokens, setAllSupportedTokens]);

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
              className="font-bold border-none text-[24px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px]  text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center rounded-full bg-white/[0.08] hover:bg-white/5">
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
              {/* <div>
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
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}
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
            <p>You Receive (Estimated)</p>
            <div className="flex flex-row items-center justify-between ">
              <div className="flex items-center">
                {isQuoteLoading ? (
                  <LoadingSpinner size="xs" inline={true} />
                ) : (
                  <p className="font-bold border-none text-[18px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                    {quoteError ? quoteError : estimatedReceiveAmount || "-"}
                  </p>
                )}
              </div>
              <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center  rounded-full bg-white/[0.08] hover:bg-white/5">
                <img
                  src={
                    currentOnrampTarget.asset === "wNEAR"
                      ? "/near-logo-green.png"
                      : "/usd-coin-usdc-logo.svg"
                  }
                  alt={`${currentOnrampTarget.asset} Logo`}
                  width={"20px"}
                  height={"20px"}
                  className="rounded-full"
                />

                <span className=" text-white font-normal">
                  {currentOnrampTarget.asset}
                </span>
                {/* <div>
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
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
          <div className="h-[2px] -mt-1 -mb-2 w-full bg-white/5" />
          <div className="w-full py-2 gap-1 px-4 flex shrink-0 items-center justify-end text-[#FFFFFF99] text-xs">
            <p>Network:</p>
            <img
              src={"/near-logo-green.png"}
              alt={`${currentOnrampTarget.chain} Protocol Logo`}
              className="w-4 h-4 rounded-full"
            />
            <span>{currentOnrampTarget.chain}</span>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="6"
              viewBox="0 0 11 6"
              fill="none"
            >
              <path
                d="M1.89917 1L5.89917 5L9.89917 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
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
          Buy {currentOnrampTarget.asset}
        </Button>
      </form>
    </FormProvider>
  );
};
