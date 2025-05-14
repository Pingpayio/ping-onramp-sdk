
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { User, CheckCircle2 } from 'lucide-react';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WalletAddressInput = ({
  walletAddress,
  onWalletAddressChange
}: WalletAddressInputProps) => {
  const [isValid, setIsValid] = useState(false);
  
  // Validation for wallet addresses
  useEffect(() => {
    // Check if it's a NEAR address (ends with .near)
    const isNearAddress = walletAddress.trim().endsWith('.near');
    
    // Check if it's a standard blockchain address (at least 42 characters)
    const isStandardAddress = walletAddress.length >= 42;
    
    // Address is valid if it's either a NEAR address or a standard blockchain address
    setIsValid(isNearAddress || isStandardAddress);
  }, [walletAddress]);

  return (
    <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center">
      <div className="flex items-center w-full px-3">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={walletAddress}
            onChange={onWalletAddressChange}
            placeholder="Enter destination wallet address"
            className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 text-base md:text-sm text-foreground bg-transparent h-8"
          />
        </div>
        {isValid && (
          <div className="ml-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletAddressInput;
