
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
  return null; // Remove the div entirely as the information is shown in other components
};

export default TransactionCompletionMessage;
