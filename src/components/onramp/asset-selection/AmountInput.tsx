
import React from 'react';
import { Input } from '@/components/ui/input';

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
    <div className="w-full mb-8 md:mb-10">
      <div className="flex flex-row items-baseline justify-center space-x-3">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10"
          className="text-3xl md:text-5xl font-bold w-auto text-center border-none focus:outline-none focus:ring-0 p-0 max-w-[200px]"
          placeholder="0"
        />
        <span className="text-3xl md:text-5xl text-muted-foreground font-normal">USD</span>
      </div>
      
      {/* Estimated token amount - updated styling */}
      {selectedAsset && parseFloat(amount) > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center">
            <span className="text-ping-600 text-base md:text-lg font-medium">
              ≈ {estimatedAmount} {selectedAsset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
