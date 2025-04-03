
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AssetList from './AssetList';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssetSelectorProps {
  selectedAsset: string | null;
  onAssetSelect: (symbol: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AssetSelector = ({
  selectedAsset,
  onAssetSelect,
  open,
  setOpen
}: AssetSelectorProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedAssetData = selectedAsset ? assets.find(a => a.symbol === selectedAsset) : null;

  // The button that triggers the asset selector
  const assetButton = (
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
  );
  
  // Mobile uses Sheet, Desktop uses Popover
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {assetButton}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh]">
          <div className="pt-6 pb-2">
            <h2 className="text-lg font-semibold mb-4">Select an asset</h2>
            <AssetList 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAssetSelect={(symbol) => {
                onAssetSelect(symbol);
                setSearchQuery('');
              }}
              selectedAsset={selectedAsset}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {assetButton}
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <AssetList 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAssetSelect={(symbol) => {
            onAssetSelect(symbol);
            setSearchQuery('');
          }}
          selectedAsset={selectedAsset}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AssetSelector;

// Import at the top that couldn't be placed there due to the component reference
import { useState } from 'react';
import { assets } from '@/data/assets';
