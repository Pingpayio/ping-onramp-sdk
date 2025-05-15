
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TransactionProgressBarProps {
  progress: number;
}

const TransactionProgressBar: React.FC<TransactionProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-white/5 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Transaction Progress</span>
        <span className="text-sm font-medium text-white">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-white/10" />
    </div>
  );
};

export default TransactionProgressBar;
