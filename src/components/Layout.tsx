
import React from 'react';
import SidebarNav from './SidebarNav';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center px-4 lg:px-8">
          <MobileNav />
          <div className="ml-auto"></div>
        </header>
        
        <main className={cn("flex-1 overflow-auto p-4 lg:p-8", className)}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
