
import React, { useState, useEffect } from 'react';
import ApplePayButton from './payment-methods/ApplePayButton';
import PaymentForm from './payment-methods/PaymentForm';
import { Separator } from '@/components/ui/separator';

interface OnrampMethodSelectionProps {
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
}

const OnrampMethodSelection = ({
  amount,
  selectedAsset,
  walletAddress,
  onOnrampSelect,
  selectedOnramp
}: OnrampMethodSelectionProps) => {
  // Auto-select apple pay as the default payment method
  useEffect(() => {
    if (!selectedOnramp) {
      onOnrampSelect("apple");
    }
  }, [onOnrampSelect, selectedOnramp]);

  return (
    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold mb-1.5">
        Payment method
      </h2>
      
      {/* Apple Pay Button */}
      <ApplePayButton onSelect={() => onOnrampSelect("apple")} />
      
      {/* Divider with text */}
      <div className="flex items-center my-1.5">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-3 text-gray-400 text-xs">Or pay with debit card</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
      
      {/* Credit Card Form */}
      <PaymentForm />
    </div>
  );
};

export default OnrampMethodSelection;
