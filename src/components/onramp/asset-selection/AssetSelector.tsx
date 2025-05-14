
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  return (
    <Button
      variant="ghost"
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full justify-between bg-transparent hover:bg-white/5 hover:shadow-none p-0 h-full focus:ring-[#AF9EF9] focus:ring-1", 
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
      <ChevronDown className="h-4 w-4 text-white/60 mr-3" />
    </Button>
  );
};

export default AssetSelector;
