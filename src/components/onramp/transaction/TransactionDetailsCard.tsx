
import React from 'react';
import { Card } from '@/components/ui/card';

interface TransactionDetailsCardProps {
  amount: string;
  asset: string | null;
  walletAddress: string;
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  amount,
  asset,
  walletAddress
}) => {
  return (
    <Card className="bg-white/5 border border-white/10 p-5">
      <h4 className="text-white/80 text-sm font-medium mb-2">Transaction Details</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Amount:</span>
          <span className="text-white/80">${amount} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Asset:</span>
          <span className="text-white/80">{asset || 'NEAR'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Recipient:</span>
          <span className="text-white/80 break-all text-right max-w-[200px]">{walletAddress}</span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetailsCard;
