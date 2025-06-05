import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AssetList from "./AssetList";
import { assets } from "@/data/assets";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [searchQuery, setSearchQuery] = React.useState("");
  const isMobile = useIsMobile();

  const handleAssetSelect = (symbol: string) => {
    if (onAssetSelect) {
      onAssetSelect(symbol);
    }
    setOpen(false);
  };

  const getAssetLogoUrl = (symbol: string | null) => {
    if (!symbol) return "";
    const asset = assets.find((a) => a.symbol === symbol);
    return asset ? asset.logoUrl : "";
  };

  // Handle open state manually to match the API of the previous Popover implementation
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Select
      open={open}
      onOpenChange={handleOpenChange}
      value={selectedAsset || ""}
      onValueChange={handleAssetSelect}
      disabled
    >
      <SelectTrigger
        className={cn(
          "w-full justify-between bg-white/[0.08] hover:bg-white/5 border border-[rgba(255,255,255,0.18)] h-[42px] text-left px-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 touch-feedback",
          className,
        )}
      >
        <SelectValue placeholder="Select an asset">
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
              <span className="font-normal text-white/60 text-sm">
                Select an asset
              </span>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "p-0 border border-[#AF9EF9] bg-[#303030] z-50 w-full shadow-md",
          isMobile && "max-h-[50vh]",
        )}
      >
        <AssetList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAssetSelect={handleAssetSelect}
          selectedAsset={selectedAsset}
        />
      </SelectContent>
    </Select>
  );
};

export default AssetSelector;
