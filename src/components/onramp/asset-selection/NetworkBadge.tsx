
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  return (
    <div className="flex justify-start">
      <button className="rounded-full border bg-secondary/50 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
        <div className="bg-primary/10 rounded-full p-1 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ping-600">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <span>Network: {selectedAsset && selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}</span>
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
      </button>
    </div>
  );
};

export default NetworkBadge;
