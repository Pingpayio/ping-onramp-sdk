
import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { assets, stablecoinSymbols } from '@/data/assets';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssetListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAssetSelect: (symbol: string) => void;
  selectedAsset: string | null;
}

const AssetList = ({
  searchQuery,
  setSearchQuery,
  onAssetSelect,
  selectedAsset
}: AssetListProps) => {
  const isMobile = useIsMobile();

  // Sort assets: NEAR first, then stablecoins, then by name
  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      // Put NEAR tokens at the very top
      const aIsNear = a.symbol === 'NEAR';
      const bIsNear = b.symbol === 'NEAR';
      
      if (aIsNear && !bIsNear) return -1;
      if (!aIsNear && bIsNear) return 1;
      
      // Put stablecoins next
      const aIsStable = stablecoinSymbols.includes(a.symbol);
      const bIsStable = stablecoinSymbols.includes(b.symbol);
      
      if (aIsStable && !bIsStable) return -1;
      if (!aIsStable && bIsStable) return 1;
      
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return sortedAssets;
    
    const query = searchQuery.toLowerCase();
    return sortedAssets.filter(asset => 
      asset.name.toLowerCase().includes(query) || 
      asset.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery, sortedAssets]);

  const getAssetLogoUrl = (symbol: string) => {
    const asset = assets.find(a => a.symbol === symbol);
    return asset ? asset.logoUrl : '';
  };

  return (
    <Command className="bg-[#303030] border-none rounded-lg overflow-hidden">
      <div className="flex items-center border-b border-white/10 px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-white/80" />
        <CommandInput 
          placeholder="Search for an asset..." 
          className="flex h-11 w-full rounded-md bg-transparent py-3 outline-none placeholder:text-white/40 text-white/80"
          value={searchQuery}
          onValueChange={setSearchQuery}
          autoFocus={false}
        />
      </div>
      <CommandList className={`${isMobile ? 'max-h-[50vh]' : 'max-h-[300px]'} overflow-auto`}>
        <CommandEmpty className="text-white/60 text-sm py-2">No asset found.</CommandEmpty>
        <CommandGroup>
          {filteredAssets.map((asset) => (
            <CommandItem
              key={asset.symbol}
              value={asset.name}
              onSelect={() => onAssetSelect(asset.symbol)}
              className={`cursor-pointer transition-colors py-3 ${
                asset.symbol === selectedAsset 
                  ? 'bg-white/5 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center w-full">
                <div className="bg-secondary rounded-full p-1.5 mr-2">
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={getAssetLogoUrl(asset.symbol)}
                      alt={asset.symbol}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{asset.name}</span>
                  <span className="text-xs text-gray-400">{asset.symbol}</span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AssetList;
