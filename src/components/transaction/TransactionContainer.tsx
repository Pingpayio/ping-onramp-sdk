
import React from 'react';
import SidebarNav from '@/components/SidebarNav';

interface TransactionContainerProps {
  children: React.ReactNode;
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#120714] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-[256px]">
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TransactionContainer;
