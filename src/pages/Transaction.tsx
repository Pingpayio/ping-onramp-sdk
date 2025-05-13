
import React from 'react';
import { useLocation } from 'react-router-dom';
import TransactionStatus from '@/components/TransactionStatus';
import SidebarNav from '@/components/SidebarNav';

const Transaction = () => {
  const location = useLocation();
  const { state } = location;
  
  const defaultData = {
    status: "pending",
    title: "Transaction Processing",
    description: "Your transaction is currently being processed. This may take a few minutes.",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  };
  
  // Use state data if available, otherwise use default
  const transactionData = state || defaultData;

  // Convert transaction data to the format expected by TransactionStatus
  const statusProps = {
    status: transactionData.status,
    title: transactionData.title || `${transactionData.asset} Transaction`,
    description: transactionData.description || `Sending ${transactionData.amount} ${transactionData.asset} to ${transactionData.walletAddress}`,
    txHash: transactionData.txHash
  };

  return (
    <div className="flex h-screen bg-[#0E1116] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <TransactionStatus 
              status={statusProps.status as 'pending' | 'completed' | 'failed'}
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
