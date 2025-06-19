import { useAtom, useSetAtom } from "jotai";
import type { NearIntentsDisplayInfo } from "../types/onramp";
import {
  nearIntentsDisplayInfoAtom,
  oneClickStatusAtom,
  oneClickSupportedTokensAtom,
  onrampErrorAtom,
  onrampResultAtom,
  onrampTargetAtom,
  walletStateAtom
} from "./atoms";

/**
 * Hook for managing global error state
 * @returns Object with error state and setFlowError function
 */
export const useOnrampFlow = () => {
  const [error, setError] = useAtom(onrampErrorAtom);

  const setFlowError = (errorMessage: string) => {
    setError(errorMessage);
    console.error("Global error set:", errorMessage);
  };

  return { error, setFlowError };
};

export const useOnrampTarget = () => useAtom(onrampTargetAtom);
export const useSetOnrampTarget = () => useSetAtom(onrampTargetAtom);
export const useWalletState = () => useAtom(walletStateAtom);
export const useSetWalletState = () => useSetAtom(walletStateAtom);
export const useOnrampResult = () => useAtom(onrampResultAtom);
export const useSetOnrampResult = () => useSetAtom(onrampResultAtom);

export const useNearIntentsDisplayInfo = (): [
  NearIntentsDisplayInfo,
  (
    update:
      | NearIntentsDisplayInfo
      | ((prev: NearIntentsDisplayInfo) => NearIntentsDisplayInfo),
  ) => void,
] => useAtom(nearIntentsDisplayInfoAtom);

export const useSetNearIntentsDisplayInfo = (): ((
  update:
    | NearIntentsDisplayInfo
    | ((prev: NearIntentsDisplayInfo) => NearIntentsDisplayInfo),
) => void) => useSetAtom(nearIntentsDisplayInfoAtom);

// Hooks for 1Click API state
export const useOneClickSupportedTokens = () =>
  useAtom(oneClickSupportedTokensAtom);
export const useSetOneClickSupportedTokens = () =>
  useSetAtom(oneClickSupportedTokensAtom);

export const useOneClickStatus = () => useAtom(oneClickStatusAtom);
export const useSetOneClickStatus = () => useSetAtom(oneClickStatusAtom);
