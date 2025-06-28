import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { FormValues } from "../steps/form-entry-view";

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

export function PaymentMethodSelector() {
  const { control, formState: { errors }, watch, getValues } = useFormContext<FormValues>();
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    getValues("paymentMethod")
  );

  const paymentMethodWatcher = watch("paymentMethod");

  useEffect(() => {
    setCurrentPaymentMethod(paymentMethodWatcher);
  }, [paymentMethodWatcher]);

  return (
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
            <SelectTrigger className="w-full rounded-lg hover:shadow-sm transition-shadow z-50 bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[54px] text-white flex items-center px-4 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 font-medium">
              <SelectValue
                placeholder="Select payment method"
                className="font-medium text-white/60"
              />
            </SelectTrigger>
            <SelectContent className="bg-[#303030] border-[#AF9EF9] text-white/60 w-full">
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
  );
}