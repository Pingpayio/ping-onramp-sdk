
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import MobileWalletButton from './mobile/MobileWalletButton';
import MobileMenu from './mobile/MobileMenu';

const MobileTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle menu open/close
  const toggleMenu = (open: boolean) => {
    setIsMenuOpen(open);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-[54px] bg-[#121212] flex justify-between items-center px-4 z-50 border-b border-white/10">
      {/* Logo */}
      <div className="flex items-center">
        <button onClick={scrollToTop} className="focus:outline-none">
          <img 
            src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
            alt="PING" 
            className="h-6" 
          />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Connect Wallet Button - matched to the logo height */}
        <MobileWalletButton />

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMenuOpen} onOpenChange={toggleMenu} />
      </div>
    </div>
  );
};

export default MobileTopbar;
