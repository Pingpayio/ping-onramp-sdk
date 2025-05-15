
import React from 'react';

interface TransactionCompletionMessageProps {
  amount: string;
  asset: string | null;
}

const TransactionCompletionMessage: React.FC<TransactionCompletionMessageProps> = ({
  amount,
  asset
}) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="text-center">
        <div className="text-2xl font-semibold text-white mb-1">
          {amount} {asset}
        </div>
        <p className="text-white/60">Successfully delivered to your wallet</p>
      </div>
    </div>
  );
};

export default TransactionCompletionMessage;
