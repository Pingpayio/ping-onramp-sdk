
import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  // If no asset is selected, don't render the network badge
  if (!selectedAsset) {
    return null;
  }

  return (
    <div className="flex justify-start">
      <button className="rounded-full border bg-secondary/50 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <Globe className="h-4 w-4 text-ping-600" />
        </div>
        <div>
          <span className="font-medium">Network: {selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default NetworkBadge;
