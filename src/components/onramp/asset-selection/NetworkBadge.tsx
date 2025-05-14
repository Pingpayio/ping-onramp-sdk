
import React from 'react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  if (!selectedAsset) return null;

  const getNetworkInfo = (asset: string) => {
    switch (asset) {
      case 'BTC':
        return { name: 'Bitcoin Network', networks: 1 };
      case 'ETH':
        return { name: 'Ethereum Network', networks: 1 };
      case 'NEAR':
        return { name: 'NEAR Protocol', networks: 1 };
      case 'USDC':
        return { name: 'Multiple Networks', networks: 4 };
      default:
        return { name: 'Unknown Network', networks: 1 };
    }
  };

  const getAssetLogoUrl = (symbol: string | null) => {
    if (!symbol) return '';
    return `/lovable-uploads/${
      symbol === "BTC"
        ? "69cbddc8-b347-4890-9211-c65d570c867f.png"
        : symbol === "ETH"
        ? "7f88aeb4-86f7-4fbf-a3d6-25d9625fdb5d.png"
        : symbol === "NEAR"
        ? "f655448d-7787-4f68-bd65-c92b438f5d1c.png"
        : symbol === "USDC"
        ? "a984f844-0031-4fc1-8792-d810f6bbd335.png"
        : "2a3c01e1-3a77-414b-959d-e162d59ba6b5.png"
    }`;
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Network</label>
      <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3">
        <div className="flex items-center">
          <div className="bg-secondary rounded-full p-1.5 mr-2">
            <div className="w-3.5 h-3.5 rounded-full overflow-hidden">
              <img
                src={getAssetLogoUrl(selectedAsset)}
                alt={selectedAsset}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-sm font-normal text-white/60">{name}</span>
        </div>
      </div>
      <p className="text-xs text-white/40 mt-1">
        {selectedAsset} is available on {networks} network{networks > 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default NetworkBadge;
