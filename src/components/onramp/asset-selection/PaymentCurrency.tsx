
import React from 'react';

interface PaymentCurrencyProps {
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
}

const PaymentCurrency = ({
  selectedCurrency = "USD",
  onCurrencySelect = () => {}
}: PaymentCurrencyProps) => {
  // Return null to render nothing
  return null;
};

export default PaymentCurrency;
