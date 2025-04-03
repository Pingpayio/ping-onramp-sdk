
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
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-3">
        Payment method
      </h2>
      
      {/* Apple Pay Button */}
      <ApplePayButton onSelect={() => onOnrampSelect("apple")} />
      
      {/* Divider with text */}
      <div className="flex items-center mb-4">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-4 text-gray-400 text-sm">Or pay with debit card</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
      
      {/* Credit Card Form */}
      <PaymentForm />
      
      {/* Terms text */}
      <p className="text-sm text-muted-foreground mt-4">
        By tapping Continue, I agree to the <a href="#" className="text-ping-600 hover:underline">Terms of Service</a> and <a href="#" className="text-ping-600 hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default OnrampMethodSelection;
