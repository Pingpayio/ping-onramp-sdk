import React from "react";

const ConnectingWalletView: React.FC = () => (
  <div className="p-4 text-center">
    <p className="text-gray-300">Connecting Wallet...</p>
    <p className="text-sm text-gray-400 mt-2">
      (Placeholder: User connects EVM wallet for Coinbase)
    </p>
    {/* Add a spinner or loading animation here */}
  </div>
);

export default ConnectingWalletView;
