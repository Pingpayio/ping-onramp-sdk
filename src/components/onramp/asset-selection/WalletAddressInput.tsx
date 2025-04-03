
import React from 'react';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WalletAddressInput = ({
  walletAddress,
  onWalletAddressChange
}: WalletAddressInputProps) => {
  return (
    <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
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
      </div>
    </div>
  );
};

export default WalletAddressInput;
