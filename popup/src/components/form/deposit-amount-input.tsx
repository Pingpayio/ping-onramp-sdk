import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import type { FormValues } from "../steps/form-entry-view";

export function DepositAmountInput() {
  const {
    register,
    formState: { errors },
    getValues,
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
          type="number"
          id="amount"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be positive" },
          })}
          onFocus={() => setIsAmountFocused(true)}
          onBlur={() => setIsAmountFocused(false)}
          className="font-bold border-none text-[24px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center rounded-full bg-white/[0.08] hover:bg-white/5">
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
        </div>
      </div>
      {errors.amount && (
        <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
      )}
    </div>
  );
}
