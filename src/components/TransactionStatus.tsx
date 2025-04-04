
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

type StatusType = 'pending' | 'completed' | 'failed';

interface TransactionStatusProps {
  status: StatusType;
  title: string;
  description: string;
  txHash?: string;
}

const TransactionStatus = ({
  status,
  title,
  description,
  txHash
}: TransactionStatusProps) => {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700'
    },
    completed: {
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    failed: {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn("border rounded-lg p-5", config.color)}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">{config.icon}</div>
        <div>
          <h3 className={cn("font-medium mb-1", config.textColor)}>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {txHash && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
              <div className="bg-white bg-opacity-50 p-2 rounded text-xs font-mono break-all">
                {txHash}
              </div>
            </div>
          )}
          
          {status === 'pending' && (
            <div className="mt-3">
              <div className="h-2 w-full bg-yellow-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full w-1/2 animate-pulse-slow"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
