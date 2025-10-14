import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import type { OnrampConfigResponse } from "@pingpay/onramp-types";
import { CreditCard, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

// Apple logo SVG component
const AppleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const getMethodName = (methodId: string) => {
  switch (methodId) {
    case "CARD":
      return "Debit or Credit Card";
    case "ACH_BANK_ACCOUNT":
      return "Bank Transfer (ACH)";
    case "APPLE_PAY":
      return "Apple Pay";
    default:
      return "Select payment method";
  }
};

const getMethodIcon = (methodId: string) => {
  switch (methodId) {
    case "CARD":
      return <CreditCard size={20} />;
    case "ACH_BANK_ACCOUNT":
      return <Landmark size={20} />;
    case "APPLE_PAY":
      return <AppleLogo />;
    default:
      return null;
  }
};

export function PaymentMethodSelector({
  // onrampConfig,
  onPaymentMethodChange,
}: {
  onrampConfig: OnrampConfigResponse;
  onPaymentMethodChange?: () => void;
}) {
  const {
    formState: { errors },
    watch,
    getValues,
  } = useFormContext<FormValues>();
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    getValues("paymentMethod"),
  );

  const paymentMethodWatcher = watch("paymentMethod");

  useEffect(() => {
    setCurrentPaymentMethod(paymentMethodWatcher);
  }, [paymentMethodWatcher]);

  const handleClick = () => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange();
    }
  };

  return (
    <div className="flex flex-col gap-1 z-50">
      <Label htmlFor="paymentMethod" className="block text-sm text-white mb-2">
        Pay Using
      </Label>
      <Button
        type="button"
        onClick={handleClick}
        className="!flex !w-full focus:outline-none! !items-center !justify-between !p-4 !rounded-lg !h-[54px] !bg-white/[0.08] !border !border-[rgba(255,255,255,0.18)] hover:!border-[#AF9EF9]/70 !text-white !font-medium !text-base [&>svg]:!shrink-0"
      >
        <div className="flex items-center gap-3">
          {currentPaymentMethod && (
            <div className="bg-white/10 rounded-full p-2 flex items-center justify-center">
              {getMethodIcon(currentPaymentMethod)}
            </div>
          )}
          <span>{getMethodName(currentPaymentMethod)}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M7 7L10 10L13 7"
            stroke="#AF9EF9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      {errors.paymentMethod && (
        <p className="text-red-400 text-xs mt-1">
          {errors.paymentMethod.message}
        </p>
      )}
    </div>
  );
}
