
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
      {/* Reduced font size (from 4xl/6xl to 3xl/5xl) and reduced spacing */}
      <div className="flex flex-row items-center justify-start py-1">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10"
          className="text-3xl md:text-5xl font-bold border-none shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[160px] min-h-[45px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <span className="text-3xl md:text-5xl text-gray-500 font-normal -ml-1">USD</span>
      </div>
      
      {/* Estimated token amount with reduced spacing */}
      {selectedAsset && parseFloat(amount) > 0 && (
        <div className="flex items-start justify-start mb-1">
          <div className="flex items-center">
            <ArrowUpDown className="h-4 w-4 text-ping-700 mr-1" />
            <span className="text-ping-700 text-sm md:text-base font-medium">
              {estimatedAmount} {selectedAsset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
