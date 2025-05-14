
import React from 'react';
import { Globe } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  // Determine network based on selected asset
  const getNetworkForAsset = (asset: string | null) => {
    if (!asset) return '';
    return asset === 'NEAR' ? 'NEAR Protocol' : 'Base';
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-white mb-1">Network</label>
      <Select defaultValue={selectedAsset ? getNetworkForAsset(selectedAsset) : undefined}>
        <SelectTrigger 
          className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] 
          text-white/60 flex items-center px-3
          focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
          focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70"
        >
          <div className="bg-secondary rounded-full p-1.5 mr-2">
            <Globe className="h-3.5 w-3.5 text-ping-700" />
          </div>
          <SelectValue placeholder="Select network" className="font-normal text-white/60" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1F2C] border-white/10 text-white/60 border-[#AF9EF9]">
          <SelectItem value="NEAR Protocol" className="text-white/60 text-sm font-normal">NEAR Protocol</SelectItem>
          <SelectItem value="Base" className="text-white/60 text-sm font-normal">Base</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkBadge;
