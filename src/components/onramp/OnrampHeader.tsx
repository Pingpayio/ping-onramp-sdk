
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const OnrampHeader = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mock wallet connection - in a real app, this would connect to an actual wallet
  const connectWallet = async () => {
    try {
      // Simulate wallet connection delay
      setTimeout(() => {
        const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "...";
        setWalletAddress(mockAddress);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully!",
        });
      }, 500);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
      });
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="flex justify-between items-center h-[50px]">
      <div className="flex items-center">
        <h1 className="text-[30px] font-normal text-white leading-none flex items-center">Ping Onramp</h1>
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
