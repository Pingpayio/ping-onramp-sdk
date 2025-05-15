
import React, { useState } from 'react';
import { Check, ChevronDown, Network } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  if (!selectedAsset) return null;

  // Get available networks for the selected asset
  const getNetworkInfo = (asset: string) => {
    switch (asset) {
      case 'BTC':
        return { name: 'Bitcoin Network', networks: [{ id: 'bitcoin', name: 'Bitcoin Network' }] };
      case 'ETH':
        return { name: 'Ethereum Network', networks: [{ id: 'ethereum', name: 'Ethereum Network' }] };
      case 'NEAR':
        return { name: 'NEAR Protocol', networks: [{ id: 'near', name: 'NEAR Protocol' }] };
      case 'USDC':
        return { 
          name: 'Multiple Networks', 
          networks: [
            { id: 'ethereum', name: 'Ethereum Network' },
            { id: 'polygon', name: 'Polygon Network' },
            { id: 'solana', name: 'Solana Network' },
            { id: 'near', name: 'NEAR Protocol' }
          ]
        };
      default:
        return { name: 'Unknown Network', networks: [{ id: 'unknown', name: 'Unknown Network' }] };
    }
  };

  // Retrieve network information for the selected asset
  const { networks } = getNetworkInfo(selectedAsset);
  
  // Use state to track the selected network
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0].id);

  const getSelectedNetworkName = () => {
    const network = networks.find(n => n.id === selectedNetwork);
    return network ? network.name : networks[0].name;
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
      
      {networks.length > 1 ? (
        <Select defaultValue={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3 text-white">
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
              <SelectValue placeholder="Select network" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border border-[#AF9EF9]">
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id} className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <Network className="h-3.5 w-3.5 text-white/60" />
                  <span>{network.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
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
            <span className="text-sm font-normal text-white/60">{networks[0].name}</span>
          </div>
        </div>
      )}

      <p className="text-xs text-white/40 mt-1">
        {selectedAsset} is available on {networks.length} network{networks.length > 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default NetworkBadge;
