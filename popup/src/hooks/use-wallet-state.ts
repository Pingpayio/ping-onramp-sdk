import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAccount } from "wagmi";
import { walletStateAtom } from "@/state/atoms";

export function useWalletState() {
  const { address, chainId, isConnected } = useAccount();
  const setWalletState = useSetAtom(walletStateAtom);

  useEffect(() => {
    if (isConnected && address) {
      setWalletState({
        address,
        chainId: chainId?.toString(),
      });
    } else {
      setWalletState(null);
    }
  }, [address, chainId, isConnected, setWalletState]);
}