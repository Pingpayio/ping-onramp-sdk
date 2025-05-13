
import React from 'react';
import { useLocation } from 'react-router-dom';
import TransactionStatus from '@/components/TransactionStatus';
import SidebarNav from '@/components/SidebarNav';

const Transaction = () => {
  const location = useLocation();
  const { state } = location;
  
  const defaultData = {
    asset: "ETH",
    amount: "100",
    walletAddress: "0x1234...5678",
    status: "pending"
  };
  
  // Use state data if available, otherwise use default
  const transactionData = state || defaultData;

  return (
    <div className="flex h-screen bg-[#0E1116] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <TransactionStatus 
              asset={transactionData.asset}
              amount={transactionData.amount}
              walletAddress={transactionData.walletAddress}
              status={transactionData.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
