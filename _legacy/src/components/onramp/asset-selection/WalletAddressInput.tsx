import React from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
}

const WalletAddressInput = ({
  walletAddress,
  onWalletAddressChange,
  placeholder = "Enter address",
  isError = false,
  errorMessage = "Please enter a recipient address",
}: WalletAddressInputProps) => {
  return (
    <div className="w-full">
      <Input
        type="text"
        value={walletAddress}
        onChange={onWalletAddressChange}
        placeholder={placeholder}
        className={cn(
          "rounded-lg transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[44px] md:h-[42px] text-white/60 flex items-center px-3 text-sm font-normal focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 placeholder:text-white/60",
          isError &&
            "border-[#ea384c] border-[1.5px] animate-pulse-slow focus-visible:border-[#ea384c] hover:border-[#ea384c]",
        )}
      />
      {isError && (
        <div className="flex items-center gap-1 mt-1 text-[#ea384c] text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default WalletAddressInput;
