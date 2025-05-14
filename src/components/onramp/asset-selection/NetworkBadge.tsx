
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
      <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center group-focus-within:border-[#AF9EF9] group-focus-within:border-[1.5px] focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
        <div className="flex items-center w-full px-3">
          <div className="bg-secondary rounded-full p-1.5 mr-2">
            <Globe className="h-3.5 w-3.5 text-ping-700" />
          </div>
          <div className="flex-1">
            <Select defaultValue={selectedAsset ? getNetworkForAsset(selectedAsset) : undefined}>
              <SelectTrigger className="border-0 bg-transparent h-8 text-white/60 focus:ring-0 focus:ring-offset-0 focus-visible:ring-[#AF9EF9] focus-visible:ring-offset-0 focus-visible:ring-1 pl-0 text-sm font-normal pr-0 flex justify-between">
                <SelectValue placeholder="Select network" className="font-normal text-white/60" />
                <div className="ml-auto mr-0 pl-2">
                  {/* Spacing added here instead of in SelectTrigger to maintain consistency */}
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2C] border-white/10 text-white/60 border-[#AF9EF9]">
                <SelectItem value="NEAR Protocol" className="text-white/60 text-sm font-normal">NEAR Protocol</SelectItem>
                <SelectItem value="Base" className="text-white/60 text-sm font-normal">Base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkBadge;
