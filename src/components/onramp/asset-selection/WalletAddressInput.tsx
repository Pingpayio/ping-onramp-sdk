
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { User, CheckCircle2 } from 'lucide-react';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const WalletAddressInput = ({
  walletAddress,
  onWalletAddressChange,
  placeholder = "Enter destination wallet address"
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
    <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70">
      <div className="flex items-center w-full px-3">
        <div className="bg-secondary rounded-full p-1.5 mr-2">
          <User className="h-3.5 w-3.5 text-ping-700" />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={walletAddress}
            onChange={onWalletAddressChange}
            placeholder={placeholder}
            className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 text-sm font-normal text-white/60 bg-transparent h-8 placeholder:text-white/60"
          />
        </div>
        {isValid && (
          <div className="mr-0">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletAddressInput;
