
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TransactionStage } from '@/hooks/use-transaction-progress';
import { Link } from 'lucide-react';

interface TransactionActionButtonsProps {
  currentStage: TransactionStage;
  txHash?: string;
}

const TransactionActionButtons: React.FC<TransactionActionButtonsProps> = ({ 
  currentStage, 
  txHash 
}) => {
  const navigate = useNavigate();

  if (currentStage !== 'completed') {
    return null;
  }

  return (
    <div className="flex justify-between gap-4 mt-6">
      <Button
        variant="outline"
        className="bg-white/5 border border-white/20 text-white hover:bg-white/10"
        onClick={() => navigate('/onramp')}
      >
        Buy More
      </Button>
      
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
  );
};

export default TransactionActionButtons;
