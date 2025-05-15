
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TransactionStage } from '@/hooks/use-transaction-progress';

interface TransactionActionButtonsProps {
  currentStage: TransactionStage;
}

const TransactionActionButtons: React.FC<TransactionActionButtonsProps> = ({ currentStage }) => {
  const navigate = useNavigate();

  if (currentStage !== 'completed') {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button
        variant="outline"
        className="bg-white/5 border border-white/20 text-white hover:bg-white/10"
        onClick={() => navigate('/onramp')}
      >
        Buy More
      </Button>
      
      <Button
        variant="default"
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        onClick={() => navigate('/')}
      >
        Return Home
      </Button>
    </div>
  );
};

export default TransactionActionButtons;
