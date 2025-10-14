import { useMemo } from "react";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { CreditCard, Landmark } from "lucide-react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (methodId: string) => void;
  isIosDevice?: boolean;
}

// Apple logo SVG component
const AppleLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const paymentMethodsList = [
  {
    id: "CARD",
    name: "Debit or Credit Card",
    description: "Debit or Credit Card (Available in most countries)",
    icon: CreditCard,
  },
  {
    id: "ACH_BANK_ACCOUNT",
    name: "Bank Transfer (ACH)",
    description: "Bank Transfer (ACH) - US only",
    icon: Landmark,
  },
  {
    id: "APPLE_PAY",
    name: "Apple Pay",
    description: "Available on iOS devices",
    icon: AppleLogo,
  },
];

export function PaymentMethodModal({
  isOpen,
  onClose,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  isIosDevice = false,
}: PaymentMethodModalProps) {
  const filteredPaymentMethods = useMemo(() => {
    let methods = paymentMethodsList;

    // Filter based on device
    if (isIosDevice) {
      methods = methods.filter((method) =>
        ["CARD", "ACH_BANK_ACCOUNT", "APPLE_PAY"].includes(method.id)
      );
    } else {
      methods = methods.filter((method) =>
        ["CARD", "ACH_BANK_ACCOUNT"].includes(method.id)
      );
    }

    return methods;
  }, [isIosDevice]);

  const handleSelectPaymentMethod = (methodId: string) => {
    onSelectPaymentMethod(methodId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#121212] backdrop-blur-sm">
      <div className="flex flex-col h-full gap-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between py-[12px] px-[16px] bg-[#121212] relative z-[10000]">
          <Logo />
          <h2 className="text-[24px] font-bold text-white">Payment Method</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="w-6 h-6 border-none! hover:border-none!"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M13.1836 1.14453L1.18359 13.1445M1.18359 1.14453L13.1836 13.1445"
                stroke="#AF9EF9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {/* Payment Methods List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredPaymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Button
                  key={method.id}
                  onClick={() => handleSelectPaymentMethod(method.id)}
                  variant="ghost"
                  className={`w-full justify-start focus:outline-none! p-4 h-auto rounded-[8px] hover:bg-white/10 hover:border-[#AF9EF9]! ${
                    selectedPaymentMethod === method.id
                      ? "bg-[#AB9FF2]/20 border border-[#AB9FF2]"
                      : "bg-white/5 border border-white/[0.18]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[23px]">
                    <div className="bg-white/10 rounded-full p-2 flex items-center justify-center">
                      <IconComponent size={20} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-white text-sm font-medium">
                        {method.name}
                      </span>
                      <span className="text-white/60 text-sm">
                        {method.description}
                      </span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
