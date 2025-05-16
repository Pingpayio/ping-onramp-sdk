import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

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

  // Access environment variables directly
  const walletConnectProjectId =
    import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID ||
    "a353ad87-5af2-4bc7-af5b-884e6aabf088";
  const onchainKitApiKey =
    import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY ||
    "HCBY5TstODcJYjYbCoC9re0PFwZ75DDe";
  const projectName =
    import.meta.env.VITE_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Coinbase Ramp Demo";
  const cdpProjectId =
    import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID ||
    "a353ad87-5af2-4bc7-af5b-884e6aabf088";

  // Log configuration status (without exposing actual values)
  console.log("Provider configuration:", {
    walletConnectProjectId: walletConnectProjectId ? "Set" : "Not set",
    apiKey: onchainKitApiKey ? "Set" : "Not set",
    cdpProjectId: cdpProjectId ? "Set" : "Not set",
  });

  // Mock wallet connection - in a real app, this would connect to an actual wallet
  const connectWallet = async () => {
    try {
      // Simulate wallet connection delay
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockAddress =
            "0x" + Math.random().toString(16).slice(2, 12) + "...";
          setWalletAddress(mockAddress);
          setIsConnected(true);

          // Use the standardized toast
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully!",
          });

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
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        setIsConnected,
        setWalletAddress,
        connectWallet,
      }}
    >
      <OnchainKitProvider
        chain={base}
        projectId={cdpProjectId}
        apiKey={onchainKitApiKey}
        config={{
          appearance: {
            name: projectName,
            theme: "default",
            mode: "light",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
