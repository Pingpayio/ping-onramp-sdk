
import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import CryptoAsset from '@/components/CryptoAsset';
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

  return (
    <Command>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput 
          placeholder="Search for an asset..." 
          className="flex h-11 w-full rounded-md bg-transparent py-3 outline-none placeholder:text-muted-foreground"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>
      <CommandList className={`${isMobile ? 'max-h-[50vh]' : 'max-h-[300px]'} overflow-auto`}>
        <CommandEmpty>No asset found.</CommandEmpty>
        <CommandGroup>
          {filteredAssets.map((asset) => (
            <CommandItem
              key={asset.symbol}
              value={asset.name}
              onSelect={() => onAssetSelect(asset.symbol)}
              className="cursor-pointer"
            >
              <CryptoAsset
                name={asset.name}
                symbol={asset.symbol}
                logoUrl={asset.logoUrl}
                isSelected={selectedAsset === asset.symbol}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AssetList;
