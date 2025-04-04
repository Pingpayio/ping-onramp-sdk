
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
      color: 'bg-yellow-500/10 border-yellow-500/20',
      textColor: 'text-yellow-500'
    },
    completed: {
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
      color: 'bg-primary/10 border-primary/20',
      textColor: 'text-primary'
    },
    failed: {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-500/10 border-red-500/20',
      textColor: 'text-red-500'
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
              <div className="bg-background/50 p-2 rounded text-xs font-mono break-all">
                {txHash}
              </div>
            </div>
          )}
          
          {status === 'pending' && (
            <div className="mt-3">
              <div className="h-2 w-full bg-yellow-500/20 rounded-full overflow-hidden">
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
