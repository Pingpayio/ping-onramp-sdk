
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, ArrowDown, ChevronRight } from 'lucide-react';
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

  const selectedAssetData = selectedAsset ? assets.find(a => a.symbol === selectedAsset) : null;

  return (
    <div className="flex flex-col items-center">
      {/* Title section similar to coinbase "Buy ETH" */}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {selectedAsset ? `Buy ${selectedAsset}` : 'Select Asset'}
      </h2>
      
      {/* Large USD amount display */}
      <div className="w-full mb-6">
        <div className="flex items-baseline justify-center">
          <Input
            type="number"
            value={amount}
            onChange={onAmountChange}
            min="10"
            className="text-4xl font-bold w-auto text-center border-none focus:outline-none focus:ring-0 p-0 max-w-[150px]"
            placeholder="0"
          />
          <span className="text-4xl text-muted-foreground ml-2">USD</span>
        </div>
        
        {/* Estimated token amount */}
        {selectedAsset && parseFloat(amount) > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-ping-600 mt-2">
            <span className="font-medium">{estimatedAmount} {selectedAsset}</span>
          </div>
        )}
      </div>
      
      {/* Selection cards for asset, network and payment method */}
      <div className="w-full space-y-3 mt-6">
        {/* Asset Selection Card */}
        <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-between w-full text-left"
                role="combobox"
                aria-expanded={open}
              >
                <div className="flex items-center">
                  {selectedAssetData ? (
                    <>
                      <div className="bg-secondary rounded-full p-2 mr-3">
                        <img 
                          src={selectedAssetData.logoUrl} 
                          alt={selectedAssetData.symbol} 
                          className="h-6 w-6" 
                        />
                      </div>
                      <div>
                        <p className="font-medium">Buy</p>
                        <p className="text-muted-foreground">{selectedAssetData.name}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-secondary rounded-full p-2 mr-3">
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      </div>
                      <p>Select an asset</p>
                    </>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
        
        {/* Network Card - for display only */}
        <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-2 mr-3">
                <div className="h-6 w-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ping-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-medium">Network</p>
                <p className="text-muted-foreground">{selectedAsset && selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Payment Method Card - for display only */}
        <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-secondary rounded-full p-2 mr-3">
                <div className="h-6 w-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ping-600">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-medium">Pay with</p>
                <p className="text-muted-foreground">Credit or debit card</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-6">
        Minimum amount: $10.00
      </p>
    </div>
  );
};

export default AssetSelection;
