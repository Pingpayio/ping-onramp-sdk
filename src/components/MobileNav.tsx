
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowDownUp, LayoutDashboard, Link as LinkIcon, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/onramp") {
      return true;
    }
    return location.pathname === path;
  };
  
  const menuItems = [{
    title: "Onramp",
    icon: <ArrowDownUp className="h-5 w-5" />,
    path: "/dashboard",
    disabled: false
  }, {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/markets",
    disabled: true
  }, {
    title: "Ping Links",
    icon: <LinkIcon className="h-5 w-5" />,
    path: "/stats",
    disabled: true
  }, {
    title: "Ping Account",
    icon: <User className="h-5 w-5" />,
    path: "/points",
    disabled: true
  }];
  
  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 text-white">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#121212] p-0 w-[280px]">
          <div className="flex flex-col h-full">
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="text-white text-xl font-semibold flex items-center">
                <img 
                  src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
                  alt="PING" 
                  className="h-[28px]" 
                />
              </div>
              <button onClick={() => setOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="mt-4 flex-1">
              <ul className="space-y-1 px-2">
                {menuItems.map(item => (
                  <li key={item.title}>
                    {item.disabled ? (
                      <div className="flex items-center py-3 text-base font-medium text-gray-500 cursor-not-allowed px-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent mr-3">
                          {item.icon}
                        </div>
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center py-3 text-base font-medium px-4 rounded-lg",
                          isActive(item.path) ? 
                            "bg-[#AF9EF9] text-black" : 
                            "text-white hover:bg-white/10"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full mr-3",
                          isActive(item.path) ? "bg-[#1F1F1F]" : "bg-transparent"
                        )}>
                          {item.icon}
                        </div>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Social Links */}
            <div className="flex px-6 pt-2 pb-6 space-x-2 border-t border-white/10">
              <a href="https://x.com/pingpay_io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#AF9EF9]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#AF9EF9] ml-[8px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#AF9EF9] ml-[8px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#AF9EF9] ml-[8px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                  <path d="M10 2v20"></path>
                </svg>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
