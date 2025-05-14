
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AssetList from './AssetList';

interface AssetSelectorProps {
  selectedAsset: string | null;
  onAssetSelect?: (symbol: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}

const AssetSelector = ({
  selectedAsset,
  onAssetSelect,
  open,
  setOpen,
  className,
}: AssetSelectorProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAssetSelect = (symbol: string) => {
    if (onAssetSelect) {
      onAssetSelect(symbol);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between bg-transparent hover:bg-white/5 h-full text-left", 
            className
          )}
        >
          <div className="flex items-center">
            {selectedAsset ? (
              <>
                <div className="w-7 h-7 rounded-full mr-2 overflow-hidden">
                  <img
                    src={`/lovable-uploads/${
                      selectedAsset === "BTC"
                        ? "69cbddc8-b347-4890-9211-c65d570c867f.png"
                        : selectedAsset === "ETH"
                        ? "7f88aeb4-86f7-4fbf-a3d6-25d9625fdb5d.png"
                        : selectedAsset === "NEAR"
                        ? "f655448d-7787-4f68-bd65-c92b438f5d1c.png"
                        : selectedAsset === "USDC"
                        ? "a984f844-0031-4fc1-8792-d810f6bbd335.png"
                        : "2a3c01e1-3a77-414b-959d-e162d59ba6b5.png"
                    }`}
                    alt={selectedAsset}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-normal text-white/60">
                  {selectedAsset}
                </span>
              </>
            ) : (
              <span className="font-normal text-white/60">Select an asset</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border border-[#AF9EF9] bg-[#1A1F2C]">
        <AssetList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAssetSelect={handleAssetSelect}
          selectedAsset={selectedAsset}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AssetSelector;
