
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface NetworkBadgeProps {
  selectedAsset: string | null;
}

const NetworkBadge = ({ selectedAsset }: NetworkBadgeProps) => {
  return (
    <div className="flex justify-start">
      <button className="rounded-full border bg-secondary/50 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ping-600">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div>
          <span className="font-medium">Network: {selectedAsset && selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default NetworkBadge;
