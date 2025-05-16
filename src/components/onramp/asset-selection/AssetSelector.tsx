
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AssetList from './AssetList';
import { assets } from '@/data/assets';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleAssetSelect = (symbol: string) => {
    if (onAssetSelect) {
      onAssetSelect(symbol);
    }
    setOpen(false);
  };

  const getAssetLogoUrl = (symbol: string | null) => {
    if (!symbol) return '';
    const asset = assets.find(a => a.symbol === symbol);
    return asset ? asset.logoUrl : '';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between bg-white/[0.08] hover:bg-white/5 border border-[rgba(255,255,255,0.18)] h-[42px] text-left px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 touch-feedback", 
            className
          )}
        >
          <div className="flex items-center">
            {selectedAsset ? (
              <>
                <div className="bg-secondary rounded-full p-1.5 mr-2">
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={getAssetLogoUrl(selectedAsset)}
                      alt={selectedAsset}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="font-normal text-white/60 text-sm">
                  {selectedAsset}
                </span>
              </>
            ) : (
              <span className="font-normal text-white/60 text-sm">Select an asset</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 border border-[#AF9EF9] bg-[#303030] z-50 mt-1 w-[var(--radix-popover-trigger-width)] shadow-md",
          isMobile && "popover-mobile-full asset-selector-popover"
        )}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={false}
        sideOffset={5}
      >
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
