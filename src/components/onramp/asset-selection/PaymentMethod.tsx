
import React, { useState } from 'react';
import { CreditCard, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethodProps {
  selectedMethod?: string;
  onMethodSelect?: (method: string) => void;
}

const PaymentMethod = ({ 
  selectedMethod = "card", 
  onMethodSelect = () => {} 
}: PaymentMethodProps) => {
  const handleValueChange = (value: string) => {
    onMethodSelect(value);
  };

  return (
    <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
      <div className="flex items-center w-full px-3">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <Select defaultValue={selectedMethod} onValueChange={handleValueChange}>
            <SelectTrigger className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 text-base md:text-sm bg-transparent h-8 focus-visible:ring-[#AF9EF9] focus-visible:ring-offset-0 focus-visible:ring-1">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/20 border-[#AF9EF9]">
              <SelectItem value="card">Debit or Credit Card</SelectItem>
              <SelectItem value="ach">Bank Transfer (ACH)</SelectItem>
              <SelectItem value="apple">Apple Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
