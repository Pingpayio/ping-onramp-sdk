import { useNavigate } from "@tanstack/react-router";
import { forwardRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./ui/button";

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderMenu = forwardRef<HTMLDivElement, HeaderMenuProps>(
  ({ isOpen, onClose }, ref) => {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const navigate = useNavigate();

    const handleDisconnect = () => {
      disconnect();
      onClose();
      void navigate({ to: "/onramp/connect-wallet", replace: true });
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="absolute z-50 right-0 top-full mt-2 w-48 rounded-md bg-gray-800 shadow-lg"
      >
        <div className="py-1">
          {isConnected && (
            <Button
              type="button"
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2 text-white/60 hover:bg-white/10 transition ease-in-out duration-150"
            >
              Disconnect Wallet
            </Button>
          )}
        </div>
      </div>
    );
  },
);

HeaderMenu.displayName = "HeaderMenu";
