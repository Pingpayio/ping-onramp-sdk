import { useAtom } from "jotai";
import { onrampErrorAtom } from "@/state/atoms";

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
