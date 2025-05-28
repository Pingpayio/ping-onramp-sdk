
import React from 'react';
import { Input } from '@/components/ui/input';
import { ArrowUpDown } from 'lucide-react';

interface AmountInputProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedAsset: string | null;
  estimatedAmount: string;
  selectedCurrency?: string;
  onCurrencySelect?: (currency: string) => void;
}

const AmountInput = ({
  amount,
  onAmountChange,
  selectedAsset,
  estimatedAmount,
  selectedCurrency = 'USD',
  onCurrencySelect,
}: AmountInputProps) => {
  return (
    <div className="w-full mb-3">
      <div className="flex flex-row items-center justify-start py-2">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10" // This minimum might need to be dynamic based on currency or payment method
          className="text-3xl md:text-5xl font-bold border-none shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[160px] min-h-[45px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <span className="text-3xl md:text-5xl text-white/40 font-normal -ml-1">
          {selectedCurrency}
        </span>
      </div>
      
      {selectedAsset && parseFloat(amount) > 0 && (
        <div className="flex items-start justify-start">
          <div className="flex items-center">
            <ArrowUpDown className="h-4 w-4 text-[#AF9EF9] mr-1" />
            <span className="text-[#AF9EF9] text-sm md:text-base font-medium">
              {estimatedAmount} {selectedAsset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
