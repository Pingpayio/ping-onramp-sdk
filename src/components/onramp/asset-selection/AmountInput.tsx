
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
    <div className="w-full mb-4 md:mb-6">
      {/* Completely remove any visual styling for input box */}
      <div className="flex flex-row items-baseline justify-start mb-2">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10"
          className="text-3xl md:text-5xl font-bold border-none shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[120px] text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <span className="text-3xl md:text-5xl text-gray-400 font-normal ml-1">USD</span>
      </div>
      
      {/* Estimated token amount */}
      {selectedAsset && parseFloat(amount) > 0 && (
        <div className="flex items-start justify-start">
          <div className="flex items-center">
            <ArrowUpDown className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-600 text-base md:text-lg font-medium">
              {estimatedAmount} {selectedAsset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
