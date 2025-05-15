
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Copy, CheckCircle2 } from "lucide-react";
import { useWallet } from '@/hooks/use-wallet-context';
import { toast } from '@/components/ui/use-toast';

const OnrampHeader = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

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

  return (
    <header className="flex justify-between items-start h-[50px]">
      <div className="flex items-start">
        <h1 className="text-[30px] font-normal text-white leading-none flex items-center mt-[-16px]">Ping Onramp</h1>
      </div>
      
      {!isConnected ? (
        <Button 
          variant="outline" 
          className="flex items-center gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-base font-normal"
          onClick={connectWallet}
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="flex items-center gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-base font-normal"
          onClick={copyAddress}
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{walletAddress}</span>
        </Button>
      )}
    </header>
  );
};

export default OnrampHeader;
