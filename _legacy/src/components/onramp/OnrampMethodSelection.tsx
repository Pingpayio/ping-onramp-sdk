import React, { useState, useEffect } from "react";
import ApplePayButton from "./payment-methods/ApplePayButton";
import PaymentForm from "./payment-methods/PaymentForm";

interface OnrampMethodSelectionProps {
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
  onCardNumberChange?: (cardNumber: string) => void;
}

const OnrampMethodSelection = ({
  amount,
  selectedAsset,
  walletAddress,
  onOnrampSelect,
  selectedOnramp,
  onCardNumberChange,
}: OnrampMethodSelectionProps) => {
  // Auto-select apple pay as the default payment method
  useEffect(() => {
    if (!selectedOnramp) {
      onOnrampSelect("apple");
    }
  }, [onOnrampSelect, selectedOnramp]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-5 text-white">
        Payment method
      </h2>

      {/* Apple Pay Button */}
      <ApplePayButton onSelect={() => onOnrampSelect("apple")} />

      {/* Divider with text */}
      <div className="flex items-center mb-6">
        <div className="flex-grow h-px bg-gray-200/20"></div>
        <span className="px-4 text-white/40 text-sm">
          Or pay with debit card
        </span>
        <div className="flex-grow h-px bg-gray-200/20"></div>
      </div>

      {/* Credit Card Form */}
      <PaymentForm onCardNumberChange={onCardNumberChange} />
    </div>
  );
};

export default OnrampMethodSelection;
