
import React, { useState } from 'react';
import Button from './Button';
import { Wallet, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ConnectWalletProps {
  onConnect: (address: string) => void;
}

const ConnectWallet = ({ onConnect }: ConnectWalletProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  // This is a mock function - in a real app, this would integrate with actual wallet providers
  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      setTimeout(() => {
        const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "...";
        setAddress(mockAddress);
        setIsConnected(true);
        onConnect(mockAddress);
        
        // Use standardized toast
        toast({
          title: "Wallet Connected", 
          description: "Your wallet has been connected successfully!"
        });
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard"
    });
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <Wallet className="h-6 w-6 text-ping-600 mr-2" />
        <h3 className="text-lg font-medium">Wallet Connection</h3>
      </div>

      {!isConnected ? (
        <div>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to receive your purchased assets.
          </p>
          <Button 
            variant="gradient" 
            size="md" 
            className="w-full"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div>
          <div className="p-3 rounded-md bg-ping-50 flex items-center justify-between mb-4">
            <span className="font-medium">{address}</span>
            <button 
              onClick={copyAddress}
              className="text-ping-600 hover:text-ping-700"
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-sm text-green-600 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Wallet connected successfully
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
