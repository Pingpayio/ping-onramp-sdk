
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, CreditCard, WalletCards, Apple } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod?: string;
  onMethodSelect?: (method: string) => void;
}

const PaymentMethod = ({ 
  selectedMethod = "card", 
  onMethodSelect = () => {} 
}: PaymentMethodProps) => {
  const [currentMethod, setCurrentMethod] = useState(selectedMethod);
  
  useEffect(() => {
    setCurrentMethod(selectedMethod);
  }, [selectedMethod]);

  const handleValueChange = (value: string) => {
    setCurrentMethod(value);
    onMethodSelect(value);
  };

  // Dynamic subtext based on the selected payment method
  const getMethodSubtext = (method: string) => {
    switch (method) {
      case 'card':
        return 'Debit or Credit Card (Available in most countries)';
      case 'ach':
        return 'Bank Transfer (ACH) - US only';
      case 'apple':
        return 'Apple Pay - Available on iOS devices';
      default:
        return '';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-3.5 w-3.5 text-white/60" />;
      case 'ach':
        return <WalletCards className="h-3.5 w-3.5 text-white/60" />;
      case 'apple':
        return <Apple className="h-3.5 w-3.5 text-white/60" />;
      default:
        return <CreditCard className="h-3.5 w-3.5 text-white/60" />;
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-2">Payment Method</label>
      <Select value={currentMethod} onValueChange={handleValueChange}>
        <SelectTrigger 
          className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] 
          text-white/60 flex items-center px-3
          focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
          focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70"
        >
          <div className="flex items-center">
            <div className="bg-secondary rounded-full p-1.5 mr-2">
              {getMethodIcon(currentMethod)}
            </div>
            <SelectValue placeholder="Select payment method" className="font-normal text-white/60" />
          </div>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </SelectTrigger>
        <SelectContent className="bg-white/[0.08] border-[#AF9EF9] text-white/60 rounded-lg">
          <SelectItem value="card" className="text-white/60 text-sm font-normal hover:bg-white/10">
            <div className="flex items-center gap-2">
              <div className="bg-secondary rounded-full p-1 mr-1">
                <CreditCard className="h-3 w-3 text-white/60" />
              </div>
              <span>Debit or Credit Card</span>
            </div>
          </SelectItem>
          <SelectItem value="ach" className="text-white/60 text-sm font-normal hover:bg-white/10">
            <div className="flex items-center gap-2">
              <div className="bg-secondary rounded-full p-1 mr-1">
                <WalletCards className="h-3 w-3 text-white/60" />
              </div>
              <span>Bank Transfer (ACH)</span>
            </div>
          </SelectItem>
          <SelectItem value="apple" className="text-white/60 text-sm font-normal hover:bg-white/10">
            <div className="flex items-center gap-2">
              <div className="bg-secondary rounded-full p-1 mr-1">
                <Apple className="h-3 w-3 text-white/60" />
              </div>
              <span>Apple Pay</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-white/40 mt-1">
        {getMethodSubtext(currentMethod)}
      </p>
    </div>
  );
};

export default PaymentMethod;
