import React from "react";
import { cn } from "@/lib/utils";

interface CryptoAssetProps {
  name: string;
  symbol: string;
  logoUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
}

// This is now a helper component for rendering assets in the dropdown
const CryptoAsset = ({
  name,
  symbol,
  logoUrl,
  isSelected = false,
  onClick,
}: CryptoAssetProps) => {
  return (
    <div
      className={cn(
        "flex items-center p-2 cursor-pointer transition-all duration-200",
        isSelected ? "bg-accent" : "hover:bg-accent/50",
      )}
      onClick={onClick}
    >
      <div className="h-8 w-8 mr-3 flex-shrink-0">
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{symbol}</span>
      </div>
    </div>
  );
};

export default CryptoAsset;
