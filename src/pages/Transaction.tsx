
import React from 'react';
import { useLocation } from 'react-router-dom';
import TransactionStatus from '@/components/TransactionStatus';
import SidebarNav from '@/components/SidebarNav';

const Transaction = () => {
  const location = useLocation();
  const { state } = location;
  
  const defaultData = {
    status: "pending" as const,
    title: "Transaction Processing",
    description: "Your transaction is currently being processed. This may take a few minutes.",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  };
  
  // Use state data if available, otherwise use default
  const transactionData = state || defaultData;

  // Ensure status is always a valid value
  const validStatus = ['pending', 'completed', 'failed'].includes(transactionData.status) 
    ? transactionData.status 
    : 'pending';

  // Convert transaction data to the format expected by TransactionStatus
  const statusProps = {
    status: validStatus as 'pending' | 'completed' | 'failed',
    title: transactionData.title || `Transaction Processing`,
    description: transactionData.description || `Your transaction is being processed.`,
    txHash: transactionData.txHash
  };

  return (
    <div className="flex h-screen bg-[#120714] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-[256px]">
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <TransactionStatus 
              status={statusProps.status}
              title={statusProps.title}
              description={statusProps.description}
              txHash={statusProps.txHash}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
