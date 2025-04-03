
import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  return (
    <div className="flex justify-start mb-1">
      <button className="rounded-full border bg-secondary/50 px-3 py-0.5 text-xs md:text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
        <div className="bg-secondary rounded-full p-1 mr-1.5">
          <Globe className="h-3 w-3 text-ping-600" />
        </div>
        <div>
          <span className="font-medium">
            Network: {selectedAsset ? (selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base') : ''}
          </span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default NetworkBadge;
