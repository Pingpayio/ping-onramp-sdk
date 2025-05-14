
import React from 'react';
import { CreditCard } from 'lucide-react';
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
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Payment Method</label>
      <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70 px-3">
        <div className="bg-secondary rounded-full p-1.5 mr-2">
          <CreditCard className="h-3.5 w-3.5 text-ping-700" />
        </div>
        <Select defaultValue={selectedMethod} onValueChange={handleValueChange}>
          <SelectTrigger className="border-0 bg-transparent h-8 text-white/60 focus:ring-0 focus:ring-offset-0 focus-visible:ring-[#AF9EF9] focus-visible:ring-offset-0 focus-visible:ring-1 pl-0 text-sm font-normal pr-0 flex-1">
            <SelectValue placeholder="Select payment method" className="font-normal text-white/60" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-white/10 text-white/60 border-[#AF9EF9]">
            <SelectItem value="card" className="text-white/60 text-sm font-normal">Debit or Credit Card</SelectItem>
            <SelectItem value="ach" className="text-white/60 text-sm font-normal">Bank Transfer (ACH)</SelectItem>
            <SelectItem value="apple" className="text-white/60 text-sm font-normal">Apple Pay</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PaymentMethod;
