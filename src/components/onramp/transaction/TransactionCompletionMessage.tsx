
import React from 'react';
import { Link } from 'lucide-react';

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
    <div className="flex flex-col items-center mt-4">
      <div className="text-center">
        <div className="text-2xl font-semibold text-white mb-1">
          {amount} {asset}
        </div>
        <p className="text-white/60 mb-3">Successfully delivered to your wallet</p>
        
        {txHash && (
          <a 
            href={`https://explorer.near.org/transactions/${txHash}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#AF9EF9]/10 text-[#AF9EF9] hover:bg-[#AF9EF9]/20 transition-colors"
          >
            <Link className="h-4 w-4" />
            View on NEAR Explorer
          </a>
        )}
      </div>
    </div>
  );
};

export default TransactionCompletionMessage;
