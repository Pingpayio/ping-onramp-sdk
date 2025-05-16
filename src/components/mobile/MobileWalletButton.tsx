
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet-context';
import { toast } from '@/components/ui/use-toast';

interface MobileWalletButtonProps {
  className?: string;
}

const MobileWalletButton = ({ className }: MobileWalletButtonProps) => {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

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

  return (
    <>
      {!isConnected ? (
        <Button 
          size="sm"
          className={`h-auto min-h-[52px] max-h-[64px] bg-[#AB9FF2] text-[#3D315E] rounded-full hover:bg-[#AB9FF2]/90 px-5 py-3 text-sm md:text-base font-medium flex items-center ${className}`}
          onClick={connectWallet}
          style={{ lineHeight: 1.2 }}
        >
          <Wallet className="h-3 w-3 mr-1" />
          <span>Connect</span>
        </Button>
      ) : (
        <Button 
          size="sm"
          className={`h-auto min-h-[52px] max-h-[64px] bg-[#AB9FF2] text-[#3D315E] rounded-full hover:bg-[#AB9FF2]/90 px-5 py-3 text-sm md:text-base font-medium flex items-center ${className}`}
          onClick={copyAddress}
          style={{ lineHeight: 1.2 }}
        >
          <Wallet className="h-3 w-3 mr-1" />
          <span>{displayAddress}</span>
        </Button>
      )}
    </>
  );
};

export default MobileWalletButton;
