
import React, { useState } from 'react';
import { Wifi } from 'lucide-react';
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
      <label className="text-sm text-white mb-1">Network</label>
      
      {networks.length > 1 ? (
        <Select defaultValue={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger className="rounded-lg bg-[#303030] border-none h-[40px] flex items-center px-3 text-white justify-between">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-1.5 mr-2">
                <Wifi className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-white/60">
                {getNetworkDisplayName(selectedNetwork)}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#303030] border-none rounded-lg overflow-hidden p-0">
            {networks.map((network) => (
              <SelectItem 
                key={network.id} 
                value={network.id} 
                className="text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors py-3 focus:bg-white/5 focus:text-white px-3 data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
              >
                <div className="flex items-center">
                  <div className="bg-secondary rounded-full p-1.5 mr-2">
                    <Wifi className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm">{network.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="rounded-lg bg-[#303030] border-none h-[40px] flex items-center px-3 text-white justify-between">
          <div className="flex items-center">
            <div className="bg-secondary rounded-full p-1.5 mr-2">
              <Wifi className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-white/60">{networks[0].name}</span>
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
