
import React from 'react';
import { cn } from '@/lib/utils';

interface CryptoAssetProps {
  name: string;
  symbol: string;
  logoUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const CryptoAsset = ({
  name,
  symbol,
  logoUrl,
  isSelected = false,
  onClick
}: CryptoAssetProps) => {
  return (
    <div 
      className={cn(
        "flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "border-2 border-ping-600 shadow-lg ping-shadow" : "border-border"
      )}
      onClick={onClick}
    >
      <div className="h-12 w-12 mr-3 flex-shrink-0">
        <img src={logoUrl} alt={name} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-lg">{name}</span>
        <span className="text-sm text-muted-foreground">{symbol}</span>
      </div>
    </div>
  );
};

export default CryptoAsset;
