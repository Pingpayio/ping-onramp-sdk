
import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowDownUp, LayoutDashboard, User, Github, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useWallet } from '@/hooks/use-wallet-context';
import { toast } from '@/components/ui/use-toast';

const MobileTopbar = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [{
    title: "Onramp",
    icon: <ArrowDownUp className="h-5 w-5" />,
    path: "/onramp",
    disabled: false
  }, {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/dashboard",
    disabled: true
  }, {
    title: "Ping Links",
    icon: <LinkIcon className="h-5 w-5" />,
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

  // Truncate wallet address for display
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 3)}` : 
    '';

  // Copy address function
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  // Scroll to top function for logo click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Toggle menu open/closed state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-[54px] bg-[#121212] flex justify-between items-center px-4 z-50 border-b border-white/10">
      {/* Logo - vertically centered */}
      <div className="flex items-center h-full">
        <RouterLink to="/" onClick={scrollToTop} className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
            alt="PING" 
            className="h-6"
          />
        </RouterLink>
      </div>

      <div className="flex items-center gap-2">
        {/* Connect Wallet Button - styled to match the image */}
        {!isConnected ? (
          <Button 
            className="bg-[#AB9FF2] text-[#3D315E] rounded-full px-5 py-2.5 text-sm hover:opacity-90 min-h-[40px]"
            onClick={connectWallet}
          >
            Connect
          </Button>
        ) : (
          <Button 
            className="bg-[#AB9FF2] text-[#3D315E] rounded-full px-5 py-2.5 text-sm hover:opacity-90 min-h-[40px]"
            onClick={copyAddress}
          >
            {displayAddress}
          </Button>
        )}

        {/* Mobile Menu with Sheet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild onClick={toggleMenu}>
            <button className="p-2 ml-2 text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[85%] sm:w-[385px] bg-[#121212] text-white border-l border-[#1A1326] p-0 z-50 top-[54px] h-[calc(100vh-54px)] mt-0 pt-0 sheet-content"
          >
            <div className="flex flex-col h-full">
              {/* Menu header */}
              <div className="px-4 py-6 border-b border-[#1A1326] flex justify-between items-center">
                <div className="font-semibold text-lg">Menu</div>
                <button 
                  className="p-2 text-white focus:outline-none hover:text-[#AF9EF9] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Menu items */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav>
                  <ul className="space-y-1 px-2">
                    {menuItems.map(item => (
                      <li key={item.title}>
                        {item.disabled ? (
                          <div className="flex items-center py-3 px-4 text-gray-500 cursor-not-allowed min-h-[44px]">
                            <span className="mr-3 opacity-70">{item.icon}</span>
                            <span>{item.title}</span>
                          </div>
                        ) : (
                          <RouterLink
                            to={item.path}
                            className={cn(
                              "flex items-center py-3 px-4 rounded-lg min-h-[44px]",
                              location.pathname === item.path
                                ? "bg-[#AF9EF9] text-black"
                                : "text-white hover:bg-[#1A1326]"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.title}</span>
                          </RouterLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              {/* Social Links */}
              <div className="px-4 py-6 border-t border-[#1A1326]">
                <div className="flex space-x-6">
                  <a href="https://x.com/pingpay_io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#AF9EF9] p-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-[#AF9EF9] p-2 flex items-center justify-center">
                    <Github size={24} />
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileTopbar;
