
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Copy, CheckCircle2 } from "lucide-react";
import { useWallet } from '@/hooks/use-wallet-context';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const OnrampHeader = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

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

  // Truncate wallet address for mobile
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, isMobile ? 4 : 6)}...${walletAddress.substring(walletAddress.length - (isMobile ? 3 : 4))}` : 
    '';

  return (
    <header className="flex justify-between items-center h-[50px] mt-2 md:mt-0">
      <div className="flex items-center">
        <h1 className="text-[20px] md:text-[30px] font-normal text-white leading-none flex items-center">Ping Onramp</h1>
      </div>
      
      {!isConnected ? (
        <Button 
          variant="outline" 
          className="flex items-center gap-1 md:gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-xs md:text-base font-normal px-3 md:px-4 h-9 md:h-10"
          onClick={connectWallet}
        >
          <Wallet className="h-3 w-3 md:h-4 md:w-4" />
          <span>Connect Wallet</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="flex items-center gap-1 md:gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-xs md:text-base font-normal px-3 md:px-4 h-9 md:h-10"
          onClick={copyAddress}
        >
          {copied ? (
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
          ) : (
            <Copy className="h-3 w-3 md:h-4 md:w-4" />
          )}
          <span>{displayAddress}</span>
        </Button>
      )}
    </header>
  );
};

export default OnrampHeader;
