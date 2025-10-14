import { useAtom, useSetAtom } from "jotai";
import type { NearIntentsDisplayInfo } from "../types";
import {
  nearIntentsDisplayInfoAtom,
  oneClickStatusAtom,
  onrampErrorAtom,
  onrampResultAtom,
  onrampTargetAtom,
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

export const useOneClickStatus = () => useAtom(oneClickStatusAtom);
export const useSetOneClickStatus = () => useSetAtom(oneClickStatusAtom);
