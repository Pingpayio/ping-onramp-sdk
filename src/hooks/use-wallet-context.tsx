
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { walletToast } from "@/components/ui/use-toast";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  setIsConnected: (connected: boolean) => void;
  setWalletAddress: (address: string) => void;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  // Mock wallet connection - in a real app, this would connect to an actual wallet
  const connectWallet = async () => {
    try {
      // Simulate wallet connection delay
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "...";
          setWalletAddress(mockAddress);
          setIsConnected(true);
          
          // Use the custom wallet toast instead of the default one
          walletToast(
            "Wallet Connected",
            "Your wallet has been connected successfully!"
          );
          
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
      });
    }
  };

  return (
    <WalletContext.Provider value={{ isConnected, walletAddress, setIsConnected, setWalletAddress, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
