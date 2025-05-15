
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
        return { name: 'Bitcoin Network', networks: [{ id: 'bitcoin', name: 'Bitcoin Network', icon: '/lovable-uploads/69cbddc8-b347-4890-9211-c65d570c867f.png' }] };
      case 'ETH':
        return { name: 'Ethereum Network', networks: [{ id: 'ethereum', name: 'Ethereum Network', icon: '/lovable-uploads/7f88aeb4-86f7-4fbf-a3d6-25d9625fdb5d.png' }] };
      case 'NEAR':
        return { name: 'NEAR Protocol', networks: [{ id: 'near', name: 'NEAR Protocol', icon: '/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png' }] };
      case 'USDC':
        return { 
          name: 'Multiple Networks', 
          networks: [
            { id: 'ethereum', name: 'Ethereum Network', icon: '/lovable-uploads/7f88aeb4-86f7-4fbf-a3d6-25d9625fdb5d.png' },
            { id: 'polygon', name: 'Polygon Network', icon: '/lovable-uploads/2a3c01e1-3a77-414b-959d-e162d59ba6b5.png' },
            { id: 'solana', name: 'Solana Network', icon: '/lovable-uploads/2a3c01e1-3a77-414b-959d-e162d59ba6b5.png' },
            { id: 'near', name: 'NEAR Protocol', icon: '/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png' }
          ]
        };
      default:
        return { name: 'Unknown Network', networks: [{ id: 'unknown', name: 'Unknown Network', icon: '/lovable-uploads/2a3c01e1-3a77-414b-959d-e162d59ba6b5.png' }] };
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

  // Helper to get network icon from id
  const getNetworkIcon = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    return network ? network.icon : '';
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Network</label>
      
      {networks.length > 1 ? (
        <Select defaultValue={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3 text-white justify-between focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-1.5 mr-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden">
                  <img 
                    src={getNetworkIcon(selectedNetwork)} 
                    alt={getNetworkDisplayName(selectedNetwork)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-normal text-white/60 text-sm">
                {getNetworkDisplayName(selectedNetwork)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
          </SelectTrigger>
          <SelectContent className="bg-white/[0.08] border border-[#AF9EF9] rounded-lg">
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id} className="text-white/60 hover:bg-white/10 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary rounded-full p-1 mr-1">
                    <div className="w-3 h-3 rounded-full overflow-hidden">
                      <img 
                        src={network.icon} 
                        alt={network.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span>{network.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3 text-white justify-between">
          <div className="flex items-center">
            <div className="bg-secondary rounded-full p-1.5 mr-2">
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden">
                <img 
                  src={networks[0].icon} 
                  alt={networks[0].name}
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
