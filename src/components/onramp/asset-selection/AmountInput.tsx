
import React from 'react';
import { Input } from '@/components/ui/input';
import { ArrowUpDown } from 'lucide-react';

interface AmountInputProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedAsset: string | null;
  estimatedAmount: string;
}

const AmountInput = ({
  amount,
  onAmountChange,
  selectedAsset,
  estimatedAmount
}: AmountInputProps) => {
  return (
    <div className="w-full mb-1 md:mb-2">
      {/* Reduced font size from 3xl/5xl to 2xl/4xl and removed padding */}
      <div className="flex flex-row items-center justify-start py-0">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10"
          className="text-2xl md:text-4xl font-bold border-none shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[160px] min-h-[40px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <span className="text-2xl md:text-4xl text-gray-500 font-normal -ml-1">USD</span>
      </div>
      
      {/* Reduced text size from sm/base to xs/sm and removed bottom margin */}
      {selectedAsset && parseFloat(amount) > 0 && (
        <div className="flex items-start justify-start mb-0">
          <div className="flex items-center">
            <ArrowUpDown className="h-3 w-3 text-[#AF9EF9] mr-1" />
            <span className="text-[#AF9EF9] text-xs md:text-sm font-medium">
              {estimatedAmount} {selectedAsset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
