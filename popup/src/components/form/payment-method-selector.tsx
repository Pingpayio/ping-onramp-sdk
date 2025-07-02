import { onrampConfigQueryOptions } from "@/lib/coinbase";
import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import { onrampTargetAtom } from "@/state/atoms";
import type { OnrampConfigResponse } from "@pingpay/onramp-types";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { CreditCard, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Apple logo SVG component
const AppleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

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
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext<FormValues>();
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    getValues("paymentMethod"),
  );

  const onrampTarget = useAtomValue(onrampTargetAtom);
  const { data: onrampConfig } = useQuery(
    onrampConfigQueryOptions(onrampTarget),
  ) as { data: OnrampConfigResponse | undefined };

  const paymentMethodWatcher = watch("paymentMethod");

  useEffect(() => {
    setCurrentPaymentMethod(paymentMethodWatcher);
  }, [paymentMethodWatcher]);

  return (
    <div className="flex flex-col gap-1 z-50">
      <Label htmlFor="paymentMethod" className="block text-sm text-white mb-2">
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
            <SelectTrigger className="!flex !w-full !items-center !justify-between !p-4 !rounded-lg !h-[54px] !bg-white/[0.08] !border !border-[rgba(255,255,255,0.18)] focus:!ring-0 focus:!border-[#AF9EF9] focus-visible:!ring-0 focus-visible:!border-[#AF9EF9] hover:!border-[#AF9EF9]/70 !text-white !font-medium !text-base [&>svg]:!shrink-0 !outline-none">
              <SelectValue
                placeholder="Select payment method"
                className="font-medium text-white placeholder:text-base placeholder:font-base"
              />
            </SelectTrigger>
            <SelectContent
              className="!bg-[#1a1a1a] !border !border-[rgba(255,255,255,0.18)] !text-white !rounded-lg !shadow-lg !min-w-[var(--radix-select-trigger-width)] !mt-1 !p-0 [&>div]:!p-1"
              side="top"
            >
              {(onrampConfig?.paymentMethods as { id: string; name: string }[])
                .filter((method) => {
                  if (onrampConfig?.isIosDevice) {
                    return ["CARD", "ACH_BANK_ACCOUNT", "APPLE_PAY"].includes(
                      method.id,
                    );
                  } else {
                    return ["CARD", "ACH_BANK_ACCOUNT"].includes(method.id);
                  }
                })
                .map((method) => {
                  return (
                    <SelectItem
                      key={method.id}
                      value={method.id}
                      className="!text-white !text-base !font-medium hover:!text-white hover:!bg-white/10 focus:!bg-white/10 !p-4 !pr-8 !cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {method.id === "CARD" && (
                          <>
                            <div className="bg-white/10 rounded-full p-2 flex items-center justify-center">
                              <CreditCard size={20} />
                            </div>
                            <span>Debit or Credit Card</span>
                          </>
                        )}
                        {method.id === "ACH_BANK_ACCOUNT" && (
                          <>
                            <div className="bg-white/10 rounded-full p-2 flex items-center justify-center">
                              <Landmark size={20} />
                            </div>
                            <span>Bank Transfer (ACH)</span>
                          </>
                        )}
                        {method.id === "APPLE_PAY" && (
                          <>
                            <div className="bg-white/10 rounded-full p-2 flex items-center justify-center">
                              {" "}
                              <AppleLogo />
                            </div>
                            <span>Apply Pay</span>
                          </>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
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
