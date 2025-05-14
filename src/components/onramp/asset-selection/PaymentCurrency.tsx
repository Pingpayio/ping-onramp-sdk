
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentCurrencyProps {
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
}

const currencies = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "BRL", label: "Brazilian Real (BRL)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "CNY", label: "Chinese Yuan (CNY)" },
  { value: "DKK", label: "Danish Krone (DKK)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "HKD", label: "Hong Kong Dollar (HKD)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "IDR", label: "Indonesian Rupiah (IDR)" },
  { value: "ILS", label: "Israeli New Shekel (ILS)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "MYR", label: "Malaysian Ringgit (MYR)" },
  { value: "MXN", label: "Mexican Peso (MXN)" },
  { value: "NZD", label: "New Zealand Dollar (NZD)" },
  { value: "NOK", label: "Norwegian Krone (NOK)" },
  { value: "PHP", label: "Philippine Peso (PHP)" },
  { value: "PLN", label: "Polish Złoty (PLN)" },
  { value: "SAR", label: "Saudi Riyal (SAR)" },
  { value: "SGD", label: "Singapore Dollar (SGD)" },
  { value: "ZAR", label: "South African Rand (ZAR)" },
  { value: "KRW", label: "South Korean Won (KRW)" },
  { value: "SEK", label: "Swedish Krona (SEK)" },
  { value: "CHF", label: "Swiss Franc (CHF)" },
  { value: "THB", label: "Thai Baht (THB)" },
  { value: "TRY", label: "Turkish Lira (TRY)" },
  { value: "AED", label: "UAE Dirham (AED)" }
];

const PaymentCurrency = ({ 
  selectedCurrency = "USD", 
  onCurrencySelect = () => {} 
}: PaymentCurrencyProps) => {
  const handleValueChange = (value: string) => {
    onCurrencySelect(value);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Payment Currency</label>
      <Select defaultValue={selectedCurrency} onValueChange={handleValueChange}>
        <SelectTrigger 
          className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] 
          text-white/60 flex items-center px-3
          focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
          focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70"
        >
          <SelectValue placeholder="Select payment currency" className="font-normal text-white/60" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1F2C] border-white/10 max-h-[300px] border-[#AF9EF9]">
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value} className="text-white/60 text-sm font-normal">
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentCurrency;
