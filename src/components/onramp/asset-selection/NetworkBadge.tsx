
import React, { useState } from 'react';
import { ChevronDown, Wifi } from 'lucide-react';
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

  // Helper to get network display name from id
  const getNetworkDisplayName = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    return network ? network.name : 'Select Network';
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-2">Network</label>
      
      {networks.length > 1 ? (
        <Select defaultValue={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger 
            className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] 
            text-white/60 flex items-center px-3
            focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
            focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70"
          >
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-1.5 mr-2">
                <Wifi className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-normal text-white/60 text-sm">
                {getNetworkDisplayName(selectedNetwork)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-white/60 ml-2" />
          </SelectTrigger>
          <SelectContent className="bg-white/[0.08] border-[#AF9EF9] text-white/60 rounded-lg">
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id} className="text-white/60 text-sm font-normal hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary rounded-full p-1 mr-1">
                    <Wifi className="h-3 w-3 text-white/60" />
                  </div>
                  <span>{network.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] flex items-center px-3 text-white justify-between">
          <div className="flex items-center">
            <div className="bg-secondary rounded-full p-1.5 mr-2">
              <Wifi className="w-3.5 h-3.5 text-white" />
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
