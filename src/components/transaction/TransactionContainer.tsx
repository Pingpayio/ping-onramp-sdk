
import React from 'react';
import SidebarNav from '@/components/SidebarNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionContainerProps {
  children: React.ReactNode;
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-[#120714]">
      {/* Only show sidebar on tablet and larger */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>
      
      <div className={`flex-1 ${isMobile ? 'ml-0 pt-[54px]' : 'md:ml-[256px]'}`}>
        <div className="px-3 py-3 md:px-6 md:py-6 lg:container mx-auto flex flex-col h-full half-screen-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TransactionContainer;
