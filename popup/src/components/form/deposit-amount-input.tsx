import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import { useState } from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Input } from "../ui/input";

interface DepositAmountInputProps {
  validationRules: RegisterOptions<FormValues, "amount">;
  onCurrencyClick?: () => void;
}

export function DepositAmountInput({
  validationRules,
  onCurrencyClick,
}: DepositAmountInputProps) {
  const {
    register,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext<FormValues>();
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  return (
    <div
      className={`w-full p-4 border gap-2 flex flex-col hover:border-[#AF9EF9] ${
        isAmountFocused ? "border-[#AF9EF9]" : "border-white/[0.18]"
      } rounded-[8px] bg-white/5`}
    >
      <p>Your Deposit</p>
      <div className="flex flex-row items-center justify-between">
        <Input
          type="text"
          inputMode="decimal"
          id="amount"
          {...register("amount", validationRules)}
          onFocus={() => {
            setIsAmountFocused(true);
          }}
          onBlur={() => {
            setIsAmountFocused(false);
            trigger("amount").catch((e: unknown) => {
              console.error("Failed to trigger amount:", e);
            });
          }}
          className="font-bold border-none text-[24px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <button
          type="button"
          onClick={onCurrencyClick}
          className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center rounded-full bg-white/[0.08] hover:bg-white/5 cursor-pointer transition-colors"
        >
          <img
            src="/usd.svg"
            alt="USD Currency Logo"
            width="20px"
            height="20px"
            className="rounded-full"
          />
          <span className="text-white font-normal">
            {getValues("selectedCurrency")}
          </span>
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {errors.amount && (
        <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
      )}
    </div>
  );
}
