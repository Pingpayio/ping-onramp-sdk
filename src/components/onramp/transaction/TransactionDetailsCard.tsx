
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TransactionDetailsCardProps {
  amount: string;
  asset: string | null;
  walletAddress: string;
  network?: string;
  received?: string;
  fee?: string;
  isCompleted?: boolean;
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  amount,
  asset,
  walletAddress,
  network = 'NEAR',
  received,
  fee = '0.5',
  isCompleted = false
}) => {
  const [showValues, setShowValues] = useState(false);

  // Only show received and fee values when transaction is completed
  useEffect(() => {
    if (isCompleted) {
      // Slight delay for better UX
      const timer = setTimeout(() => setShowValues(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <Card className="bg-white/5 border border-white/10 p-5">
      <h4 className="text-sm text-white mb-2">Transaction Details</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Onramp Amount:</span>
          <span className="text-white">${amount} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Asset:</span>
          <span className="text-white">{asset || 'NEAR'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Network:</span>
          <span className="text-white">{network}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Recipient:</span>
          <span className="text-white break-all text-right max-w-[200px]">{walletAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Received:</span>
          <span 
            className={cn(
              "text-white font-bold transition-all duration-500", 
              showValues ? "opacity-100" : "opacity-0"
            )}
          >
            {showValues 
              ? (received || `${parseFloat(amount) - parseFloat(fee || '0.5')} ${asset || 'NEAR'}`) 
              : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Fee:</span>
          <span 
            className={cn(
              "text-white font-bold transition-all duration-500", 
              showValues ? "opacity-100" : "opacity-0"
            )}
          >
            {showValues ? `${fee} ${asset || 'NEAR'}` : "--"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetailsCard;
