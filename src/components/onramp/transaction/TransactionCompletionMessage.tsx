
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionCompletionMessageProps {
  amount: string;
  asset: string | null;
  txHash?: string;
  message?: string;
}

const TransactionCompletionMessage: React.FC<TransactionCompletionMessageProps> = ({
  amount,
  asset,
  txHash,
  message
}) => {
  const defaultMessage = `Successfully processed ${amount} ${asset || 'asset'}.`;
  const displayMessage = message || defaultMessage;

  // Basic check if txHash is a URL
  const isTxHashUrl = txHash && (txHash.startsWith('http://') || txHash.startsWith('https://'));

  return (
    <div className="bg-green-500/10 p-4 rounded-lg text-center border border-green-500/30">
      <p className="text-green-300 font-medium mb-2">Transaction Successful!</p>
      <p className="text-white/90 text-sm mb-3">{displayMessage}</p>
      {txHash && (
        <div className="mt-2">
          {isTxHashUrl ? (
            <Button
              variant="link"
              className="text-xs text-[#AF9EF9] hover:text-[#C7BFFD] p-0 h-auto"
              asChild
            >
              <a href={txHash} target="_blank" rel="noopener noreferrer">
                View Transaction on Explorer <ExternalLink size={14} className="ml-1 inline-block" />
              </a>
            </Button>
          ) : (
            <>
              <p className="text-xs text-white/60 mb-1">Transaction Hash:</p>
              <div className="bg-white/5 p-2 rounded text-xs font-mono break-all text-white/40">
                {txHash}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCompletionMessage;
