import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { walletStateAtom } from "@/state/atoms";
import { Button } from "../components/ui/button";

export default function Header({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const setWalletState = useSetAtom(walletStateAtom);
  React.useEffect(() => {
    if (isConnected && address) {
      setWalletState({
        address,
        chainId: chainId?.toString(), // chainId can be undefined if not available
        // walletName could be added here if available from useAccount or another source
      });
    } else {
      // Set to null or an empty state if that's how disconnection is represented
      // For WalletState | null, setting to null is appropriate
      setWalletState(null);
    }
  }, [address, chainId, isConnected, setWalletState]);
  return (
    <div className="relative w-full">
      <header className="flex items-center justify-between">
        <a href="https://pingpay.io" target="_blank">
          <Logo />
        </a>
        <h3 className=" font-bold text-[24px]">{title}</h3>
        <div
          className="cursor-pointer z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="31"
            viewBox="0 0 30 31"
            fill="none"
          >
            <path
              d="M4 9H26M4 16H26M4 23H26"
              stroke="#AF9EF9"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </header>

      {isMenuOpen && (
        <div className="absolute z-50 right-0 top-full mt-2 w-48 rounded-md bg-gray-800 shadow-lg">
          <div className="py-1">
            {isConnected && (
              <Button
                type="button"
                onClick={() => {
                  disconnect();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-white/60 hover:bg-white/10 transition ease-in-out duration-150"
              >
                Disconnect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="31"
      viewBox="0 0 30 31"
      fill="none"
    >
      <path
        d="M19.2127 15.3177C21.0191 11.9601 19.7903 7.78935 16.4682 6.00215C13.1461 4.21495 8.81207 5.77293 7.00573 9.13059C3.34258 15.9397 5.4395 14.8633 9.55932 17.9929C12.8814 19.7801 17.4064 18.6754 19.2127 15.3177Z"
        fill="#AF9EF9"
      />
      <rect
        width="0.629025"
        height="6.59471"
        transform="matrix(0.880649 0.473769 0.473769 -0.880649 3.88135 14.9382)"
        fill="#AF9EF9"
      />
      <rect
        width="6.4475"
        height="1.44756"
        transform="matrix(0.880649 0.473769 0.473769 -0.880649 3.88135 14.9382)"
        fill="#AF9EF9"
      />
      <path
        d="M1.6027 19.1451C0.717541 20.7904 1.31966 22.8342 2.94757 23.71C4.57548 24.5858 6.69929 23.8223 7.58445 22.177C9.37949 18.8403 8.35194 19.3678 6.33312 17.8342C4.70521 16.9584 2.48785 17.4997 1.6027 19.1451Z"
        fill="#AF9EF9"
      />
      <rect
        width="0.308239"
        height="3.23159"
        transform="matrix(-0.880649 -0.473769 -0.473769 0.880649 9.11548 19.3311)"
        fill="#AF9EF9"
      />
      <rect
        width="3.15945"
        height="0.709345"
        transform="matrix(-0.880649 -0.473769 -0.473769 0.880649 9.11548 19.3311)"
        fill="#AF9EF9"
      />
    </svg>
  );
}
