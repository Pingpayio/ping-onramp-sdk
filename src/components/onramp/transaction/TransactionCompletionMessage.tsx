
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionCompletionMessageProps {
  amount: string;
  asset: string | null;
  txHash?: string;
}

const TransactionCompletionMessage: React.FC<TransactionCompletionMessageProps> = ({
  amount,
  asset,
  txHash
}) => {
  return (
    <div className="text-center py-4">
      <h3 className="text-2xl font-semibold text-white mb-1">
        {amount} {asset}
      </h3>
      <p className="text-white/60">Successfully delivered to your wallet</p>
    </div>
  );
};

export default TransactionCompletionMessage;
