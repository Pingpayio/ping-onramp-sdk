
import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, Wallet } from 'lucide-react';

interface OnrampCardProps {
  title: string;
  description: string;
  icon: 'card' | 'wallet';
  provider: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const OnrampCard = ({
  title,
  description,
  icon,
  provider,
  isSelected = false,
  onClick
}: OnrampCardProps) => {
  return (
    <div 
      className={cn(
        "card-gradient-hover flex flex-col p-6 rounded-lg border relative transition-all duration-200",
        isSelected ? "border-2 border-ping-700 shadow-lg ping-shadow" : "border-border hover:shadow-md"
      )}
      onClick={onClick}
    >
      <div className="z-10 flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-ping-100 p-2 rounded-full mr-3">
            {icon === 'card' ? (
              <CreditCard className="h-6 w-6 text-ping-700" />
            ) : (
              <Wallet className="h-6 w-6 text-ping-700" />
            )}
          </div>
          <h3 className="font-semibold text-xl">{title}</h3>
        </div>
        {isSelected && (
          <div className="bg-ping-700 h-6 w-6 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>
      <p className="text-muted-foreground mb-4 z-10">{description}</p>
      <div className="mt-auto text-sm font-medium text-ping-700 z-10">Powered by {provider}</div>
    </div>
  );
};

export default OnrampCard;
