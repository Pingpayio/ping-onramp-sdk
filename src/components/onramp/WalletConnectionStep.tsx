
import React from 'react';
import ConnectWallet from '@/components/ConnectWallet';

interface WalletConnectionStepProps {
  onConnect: (address: string) => void;
}

const WalletConnectionStep = ({ onConnect }: WalletConnectionStepProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
      <p className="text-muted-foreground mb-6">
        Connect your wallet to receive your purchased assets
      </p>
      
      <ConnectWallet onConnect={onConnect} />
    </div>
  );
};

export default WalletConnectionStep;
