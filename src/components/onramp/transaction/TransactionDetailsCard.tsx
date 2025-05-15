
import React from 'react';
import { Card } from '@/components/ui/card';

interface TransactionDetailsCardProps {
  amount: string;
  asset: string | null;
  walletAddress: string;
  network?: string;
  received?: string;
  fee?: string;
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  amount,
  asset,
  walletAddress,
  network = 'NEAR',
  received,
  fee = '0.5'
}) => {
  return (
    <Card className="bg-white/5 border border-white/10 p-5">
      <h4 className="text-white/80 text-sm font-medium mb-2">Transaction Details</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Onramp Amount:</span>
          <span className="text-white/80">${amount} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Asset:</span>
          <span className="text-white/80">{asset || 'NEAR'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Network:</span>
          <span className="text-white/80">{network}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Recipient:</span>
          <span className="text-white/80 break-all text-right max-w-[200px]">{walletAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Received:</span>
          <span className="text-white/80">{received || `${parseFloat(amount) - parseFloat(fee || '0.5')} ${asset || 'NEAR'}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Fee:</span>
          <span className="text-white/80">${fee} USD</span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetailsCard;
