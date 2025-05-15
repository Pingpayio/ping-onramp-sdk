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
  return;
};
export default TransactionCompletionMessage;