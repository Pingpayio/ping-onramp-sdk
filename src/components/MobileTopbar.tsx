
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowDownUp, LayoutDashboard, User, Github, ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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
    icon: <Link className="h-5 w-5" />,
    path: "/stats",
    disabled: true
  }, {
    title: "Subscriptions",
    icon: (
      <div className="relative h-5 w-5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat">
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      </div>
    ),
    path: "/referrals",
    disabled: true
  }, {
    title: "Ping Account",
    icon: <User className="h-5 w-5" />,
    path: "/points",
    disabled: true
  }];

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#121212] flex justify-between items-center px-4 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
          alt="PING" 
          className="h-[28px]" 
        />
      </Link>

      {/* Connect Wallet Button - simplified version for mobile */}
      <Button 
        variant="gradient" 
        size="sm"
        className="mr-3"
      >
        Connect
      </Button>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 text-white focus:outline-none">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] sm:w-[385px] bg-[#121212] text-white border-l border-[#1A1326] p-0">
          <div className="flex flex-col h-full">
            {/* Menu header */}
            <div className="px-4 py-6 border-b border-[#1A1326] flex justify-between items-center">
              <div className="font-semibold text-lg">Menu</div>
              <SheetTrigger asChild>
                <button className="p-2 text-white focus:outline-none hover:text-[#AF9EF9]">
                  <X size={24} />
                </button>
              </SheetTrigger>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav>
                <ul className="space-y-1 px-2">
                  {menuItems.map(item => (
                    <li key={item.title}>
                      {item.disabled ? (
                        <div className="flex items-center py-3 px-4 text-gray-500 cursor-not-allowed">
                          <span className="mr-3 opacity-70">{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center py-3 px-4 rounded-lg",
                            location.pathname === item.path || 
                            (item.path === "/dashboard" && location.pathname === "/onramp")
                              ? "bg-[#AF9EF9] text-black"
                              : "text-white hover:bg-[#1A1326]"
                          )}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* Social Links */}
            <div className="px-4 py-6 border-t border-[#1A1326]">
              <div className="flex space-x-4">
                <a href="https://x.com/pingpay_io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#AF9EF9]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#AF9EF9]">
                  <Github size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#AF9EF9]">
                  <ExternalLink size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#AF9EF9]">
                  <BookOpen size={20} />
                </a>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileTopbar;
