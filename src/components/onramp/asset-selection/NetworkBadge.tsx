import React, { useState } from 'react';
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
      case 'NEAR':
        return { 
          name: 'NEAR Protocol', 
          networks: [
            { 
              id: 'near', 
              name: 'NEAR Protocol',
              logo: '/cryptologos/near-protocol-near-logo.svg?v=029'
            }
          ] 
        };
      default:
        return { 
          name: 'Unknown Network', 
          networks: [
            { 
              id: 'unknown', 
              name: 'Unknown Network',
              logo: 'https://cryptologos.cc/logos/generic-crypto-logo.svg?v=029'
            }
          ] 
        };
    }
  };

  // Hardcode for intents
  const { networks } = getNetworkInfo("NEAR");
  
  const selectedNetwork = networks[0].id;

  // Helper to get network display name from id
  const getNetworkDisplayName = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    return network ? network.name : 'Select Network';
  };

  // Helper to get network logo from id
  const getNetworkLogo = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    return network ? network.logo : '';
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Network</label>
      
      {networks.length > 1 ? (
        <Select defaultValue={selectedNetwork} disabled>
          <SelectTrigger 
            className="rounded-lg hover:shadow-sm transition-shadow bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[40px] 
            text-white/60 flex items-center px-3
            focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
            focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70"
          >
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full mr-2 overflow-hidden flex items-center justify-center">
                <img 
                  src={getNetworkLogo(selectedNetwork)} 
                  alt={getNetworkDisplayName(selectedNetwork)} 
                  className="h-4 w-4 object-contain" 
                />
              </div>
              <span className="font-normal text-white/60 text-sm">
                {getNetworkDisplayName(selectedNetwork)}
              </span>
            </div>
            {/* The SelectTrigger already has a chevron added automatically by the component */}
          </SelectTrigger>
          <SelectContent className="bg-[#303030] border border-[#AF9EF9] p-1 w-full">
            {networks.map((network) => (
              <SelectItem 
                key={network.id} 
                value={network.id} 
                className="text-white/60 text-sm font-normal hover:text-white hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src={network.logo} 
                      alt={network.name} 
                      className="h-4 w-4 object-contain" 
                    />
                  </div>
                  <span>{network.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="rounded-lg hover:shadow-sm transition-shadow bg-[#303030] border border-[rgba(255,255,255,0.18)] h-[40px] flex items-center px-3 text-white justify-between hover:border-[#AF9EF9]/70">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full mr-2 overflow-hidden flex items-center justify-center">
              <img 
                src={networks[0].logo} 
                alt={networks[0].name} 
                className="h-4 w-4 object-contain" 
              />
            </div>
            <span className="text-sm font-normal text-white/60">{networks[0].name}</span>
          </div>
        </div>
      )}

      {/* <p className="text-xs text-white/40 mt-1">
        {selectedAsset} is available on {networks.length} network{networks.length > 1 ? 's' : ''}
      </p> */}
    </div>
  );
};

export default NetworkBadge;
