
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, ArrowDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import CryptoAsset from '@/components/CryptoAsset';
import { assets, stablecoinSymbols } from '@/data/assets';
import { Input } from '@/components/ui/input';

interface AssetSelectionProps {
  selectedAsset: string | null;
  amount: string;
  onAssetSelect: (symbol: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Mock prices for demonstration purposes - in a real app, these would come from an API
const mockPrices: Record<string, number> = {
  USDT: 1,
  USDC: 1,
  DAI: 1,
  BTC: 65000,
  ETH: 3500,
  NEAR: 8.12,
  SOL: 145,
  AVAX: 35,
  DOT: 8.5,
  MATIC: 0.75,
  // Add more tokens as needed
};

const AssetSelection = ({
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen
}: AssetSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState<string>('0');
  
  // Sort assets: stablecoins first, then NEAR, then by name
  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      // Put stablecoins at the top
      const aIsStable = stablecoinSymbols.includes(a.symbol);
      const bIsStable = stablecoinSymbols.includes(b.symbol);
      
      if (aIsStable && !bIsStable) return -1;
      if (!aIsStable && bIsStable) return 1;
      
      // Put NEAR tokens next
      const aIsNear = a.symbol === 'NEAR';
      const bIsNear = b.symbol === 'NEAR';
      
      if (aIsNear && !bIsNear) return -1;
      if (!aIsNear && bIsNear) return 1;
      
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

  // Calculate estimated token amount based on USD amount and selected asset
  useEffect(() => {
    if (selectedAsset && amount && !isNaN(parseFloat(amount))) {
      const assetPrice = mockPrices[selectedAsset] || 1;
      const estimatedTokens = parseFloat(amount) / assetPrice;
      
      // Format based on value - show more decimal places for higher value tokens
      let formattedAmount;
      if (assetPrice >= 1000) {
        formattedAmount = estimatedTokens.toFixed(5);
      } else if (assetPrice >= 100) {
        formattedAmount = estimatedTokens.toFixed(4);
      } else {
        formattedAmount = estimatedTokens.toFixed(2);
      }
      
      setEstimatedAmount(formattedAmount);
    } else {
      setEstimatedAmount('0');
    }
  }, [selectedAsset, amount]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Select Asset</h2>
      <p className="text-muted-foreground mb-6">Choose the asset you want to purchase</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Asset</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center justify-between w-full border border-input rounded-md p-3 bg-background text-left text-sm font-normal"
              role="combobox"
              aria-expanded={open}
            >
              {selectedAsset ? (
                <div className="flex items-center">
                  <img 
                    src={assets.find(a => a.symbol === selectedAsset)?.logoUrl} 
                    alt={selectedAsset} 
                    className="h-6 w-6 mr-2" 
                  />
                  <span>{assets.find(a => a.symbol === selectedAsset)?.name}</span>
                  <span className="ml-2 text-muted-foreground">{selectedAsset}</span>
                </div>
              ) : (
                "Select an asset"
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
              <CommandList className="max-h-[300px] overflow-auto">
                <CommandEmpty>No asset found.</CommandEmpty>
                <CommandGroup>
                  {filteredAssets.map((asset) => (
                    <CommandItem
                      key={asset.symbol}
                      value={asset.name}
                      onSelect={() => {
                        onAssetSelect(asset.symbol);
                        setSearchQuery('');
                      }}
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
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Amount (USD)</label>
        <div className="space-y-2">
          <Input
            type="number"
            value={amount}
            onChange={onAmountChange}
            min="10"
            className="w-full border border-input rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ping-500"
            placeholder="Enter amount"
          />
          
          {selectedAsset && parseFloat(amount) > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
              <ArrowDown className="h-4 w-4 text-ping-500" />
              <span className="font-medium text-foreground">{estimatedAmount} {selectedAsset}</span>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Minimum amount: $10.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetSelection;
