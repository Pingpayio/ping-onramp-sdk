
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, CreditCard, WalletCards, AppleIcon } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod?: string;
  onMethodSelect?: (method: string) => void;
}

// Custom AppleIcon since it might not be available in Lucide
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20.94c1.5 0 2.75 -.65 3.71 -1.27a9.97 9.97 0 0 0 2.33 -2.12c.44 -.55 .71 -1.27 .71 -2.05c0 -.85 -.14 -1.59 -.5 -2.24c-.7 -1.37 -1.9 -2.21 -3.25 -2.24c-.88 -.03 -1.58 .28 -2.18 .6c-.49 .27 -.94 .54 -1.82 .54c-.88 0 -1.33 -.27 -1.82 -.54c-.6 -.32 -1.3 -.63 -2.18 -.6c-1.35 .03 -2.56 .87 -3.25 2.24c-.36 .65 -.5 1.4 -.5 2.24c0 .78 .27 1.5 .71 2.05c.76 .95 1.53 1.65 2.33 2.12c.96 .62 2.19 1.27 3.71 1.27z"/>
    <path d="M12 8.5c0 -1.95 1.53 -3.53 3.44 -3.5c.82 .03 1.56 .15 2.06 .4c.5 .25 .96 .63 1.5 1.1" />
  </svg>
);

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
        return <AppleIcon className="h-3.5 w-3.5 text-white/60" />;
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
                <AppleIcon className="h-3 w-3 text-white/60" />
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
