
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
  
  // Simple validation for wallet address - should be at least 42 chars
  // This is a basic implementation - real validation would be more complex
  useEffect(() => {
    // Most blockchain addresses are at least 42 characters long
    setIsValid(walletAddress.length >= 42);
  }, [walletAddress]);

  return (
    <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow mt-3">
      <div className="flex items-center">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          value={walletAddress}
          onChange={onWalletAddressChange}
          placeholder="Enter destination wallet address"
          className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
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
