import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import { useState } from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Input } from "../ui/input";

interface DepositAmountInputProps {
  validationRules: RegisterOptions<FormValues, "amount">;
  onCurrencyClick?: () => void;
}

const currenciesList = [
  {
    id: "USD",
    name: "United States Dollar",
    flag: "/usd.svg",
  },
  {
    id: "GBP",
    name: "Great British Pound",
    flag: "/gbp 1.svg",
  },
  {
    id: "EUR",
    name: "EURO",
    flag: "/eur.svg.svg",
  },
  {
    id: "CAD",
    name: "Canadian Dollar",
    flag: "/cad.svg.svg",
  },
  {
    id: "AUD",
    name: "Australian Dollar",
    flag: "/aud 1.svg",
  },
  {
    id: "INR",
    name: "Indian Rupee",
    flag: "/inr 1.svg",
  },
  {
    id: "HKD",
    name: "Hong Kong Dollar",
    flag: "/hkd 1.svg",
  },
  {
    id: "THB",
    name: "Thai Bhat",
    flag: "/thb 1.svg",
  },
];

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
          className="border gap-2 border-white/[0.18]! px-3! py-2! flex items-center rounded-full! bg-white/[0.08]! hover:bg-white/5! cursor-pointer transition-colors"
        >
          {(() => {
            const selectedCurrency = getValues("selectedCurrency");
            const currencyInfo = currenciesList.find(
              (c) => c.id === selectedCurrency,
            );
            return (
              <>
                <img
                  src={currencyInfo?.flag || "/usd.svg"}
                  alt={`${selectedCurrency} Currency Logo`}
                  width="20px"
                  height="20px"
                  className="rounded-full"
                />
                <span className="text-white font-normal">
                  {selectedCurrency}
                </span>
              </>
            );
          })()}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="6"
            viewBox="0 0 11 6"
            fill="none"
          >
            <path
              d="M1.36963 1L5.36963 5L9.36963 1"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
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
