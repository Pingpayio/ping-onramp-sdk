
import React from 'react';
import { Banknote } from 'lucide-react';
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
    <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
      <div className="flex items-center w-full px-3">
        <div className="bg-secondary rounded-full p-1.5 mr-2">
          <Banknote className="h-3.5 w-3.5 text-ping-700" />
        </div>
        <div className="flex-1">
          <Select defaultValue={selectedCurrency} onValueChange={handleValueChange}>
            <SelectTrigger className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 text-sm font-normal bg-transparent h-8 text-white/60 focus-visible:ring-[#AF9EF9] focus-visible:ring-offset-0 focus-visible:ring-1">
              <SelectValue placeholder="Select payment currency" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/20 max-h-[300px] border-[#AF9EF9]">
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value} className="text-white/60 text-sm font-normal">
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PaymentCurrency;
