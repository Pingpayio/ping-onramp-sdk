
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import CryptoAsset from '@/components/CryptoAsset';
import { assets } from '@/data/cryptoAssets';

interface AssetSelectionProps {
  selectedAsset: string | null;
  amount: string;
  onAssetSelect: (symbol: string) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AssetSelection = ({
  selectedAsset,
  amount,
  onAssetSelect,
  onAmountChange,
  open,
  setOpen
}: AssetSelectionProps) => {
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
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search for an asset..." />
              <CommandList>
                <CommandEmpty>No asset found.</CommandEmpty>
                <CommandGroup>
                  {assets.map((asset) => (
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
        <input
          type="number"
          value={amount}
          onChange={onAmountChange}
          min="10"
          className="w-full border border-input rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ping-500"
          placeholder="Enter amount"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Minimum amount: $10.00
        </p>
      </div>
    </div>
  );
};

export default AssetSelection;
