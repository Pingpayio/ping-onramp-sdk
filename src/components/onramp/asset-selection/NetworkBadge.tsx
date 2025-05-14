
import React from 'react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  // Only show the network badge if an asset is selected
  if (!selectedAsset) {
    return null;
  }

  // Get network based on selected asset
  const getNetworkName = (asset: string) => {
    switch (asset) {
      case 'NEAR':
        return 'NEAR Network';
      case 'BTC':
        return 'Bitcoin Network';
      case 'ETH':
        return 'Ethereum Network';
      case 'USDC':
        return 'USDC Network';
      default:
        return 'Other Network';
    }
  };

  // Get network logo based on selected asset
  const getNetworkLogo = (asset: string) => {
    return `/lovable-uploads/${
      asset === "BTC"
        ? "69cbddc8-b347-4890-9211-c65d570c867f.png"
        : asset === "ETH"
        ? "7f88aeb4-86f7-4fbf-a3d6-25d9625fdb5d.png"
        : asset === "NEAR"
        ? "f655448d-7787-4f68-bd65-c92b438f5d1c.png"
        : asset === "USDC"
        ? "a984f844-0031-4fc1-8792-d810f6bbd335.png"
        : "2a3c01e1-3a77-414b-959d-e162d59ba6b5.png"
    }`;
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Network</label>
      <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center px-4">
        <div className="flex items-center">
          <div className="bg-secondary rounded-full p-1.5">
            <div className="w-3.5 h-3.5 rounded-full overflow-hidden">
              <img
                src={getNetworkLogo(selectedAsset)}
                alt={getNetworkName(selectedAsset)}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-white/60 ml-2">{getNetworkName(selectedAsset)}</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkBadge;
