import React from "react";

interface ConnectWalletViewProps {
  onConnected: () => Promise<void>;
}

export const ConnectWalletView: React.FC<ConnectWalletViewProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 bg-white/5 rounded-xl shadow-sm p-8 border border-white/[0.16]">
      <div className="w-16 h-16 mb-4">
        <img
          src="/ping-pay-logo.png"
          alt="NEAR Intents Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-xl font-medium text-white text-center">
        Connect Your Wallet
      </h2>

      <p className="text-white/60 text-center text-sm mb-4">
        Connect your wallet to start the onramp process
      </p>
    </div>
  );
};
