
import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  return (
    <div className="flex justify-start">
      <button className="rounded-full bg-secondary/50 px-3 py-1 text-xs md:text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
        <div className="bg-secondary rounded-full p-1.5 mr-2">
          <Globe className="h-3.5 w-3.5 text-ping-700" />
        </div>
        <div>
          <span className="font-medium">
            Network: {selectedAsset ? (selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base') : ''}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
};

export default NetworkBadge;
