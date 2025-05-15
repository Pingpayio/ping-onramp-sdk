import React from 'react';
interface TransactionCompletionMessageProps {
  amount: string;
  asset: string | null;
}
const TransactionCompletionMessage: React.FC<TransactionCompletionMessageProps> = ({
  amount,
  asset
}) => {
  return <div className="flex flex-col items-center mt-4">
      
    </div>;
};
export default TransactionCompletionMessage;