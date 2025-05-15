
import React from 'react';
import { Input } from '@/components/ui/input';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const WalletAddressInput = ({ 
  walletAddress, 
  onWalletAddressChange,
  placeholder = "Enter address"
}: WalletAddressInputProps) => {
  return (
    <Input
      type="text"
      value={walletAddress}
      onChange={onWalletAddressChange}
      placeholder={placeholder}
      className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[42px] 
      text-white/60 flex items-center px-3 text-sm font-normal
      focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none
      focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70
      placeholder:text-white/60"
    />
  );
};

export default WalletAddressInput;
