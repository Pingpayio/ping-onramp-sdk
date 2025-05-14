import React from 'react';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const WalletAddressInput = ({
  walletAddress,
  onWalletAddressChange,
  placeholder = "Enter wallet address"
}: WalletAddressInputProps) => {
  return (
    <input
      type="text"
      id="wallet-address"
      className="w-full h-[50px] px-3 rounded-lg bg-white/[0.08] border border-[rgba(255,255,255,0.18)] focus-within:border-[#AF9EF9] focus-within:border-[1.5px] hover:border-[#AF9EF9]/70 text-white/60 text-sm font-normal focus:outline-none focus:ring-0"
      placeholder={placeholder}
      value={walletAddress}
      onChange={onWalletAddressChange}
    />
  );
};

export default WalletAddressInput;
