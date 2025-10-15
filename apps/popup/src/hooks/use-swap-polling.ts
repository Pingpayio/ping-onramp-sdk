import { getSwapStatus } from "@/lib/one-click-api";
import { useAtom, useSetAtom } from "jotai";
import {
  nearIntentsDisplayInfoAtom,
  oneClickStatusAtom,
  onrampResultAtom,
} from "@/state/atoms";
import { useState } from "react";
import { useEffect, useRef } from "react";

export type PollingStatus = "idle" | "polling" | "success" | "failed";

export interface PollingResult {
  status: PollingStatus;
  error?: string;
}

export function useSwapPolling(depositAddress: string) {
  const [oneClickStatus, setOneClickStatus] = useAtom(oneClickStatusAtom);
  const setOnrampResult = useSetAtom(onrampResultAtom);
  const setNearIntentsDisplayInfo = useSetAtom(nearIntentsDisplayInfoAtom);

  const [pollingStatus, setPollingStatus] = useState<PollingStatus>("idle");
  const [pollingError, setPollingError] = useState<string>("");

  const pollingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Poll for swap status
  const pollStatus = async (depositAddress: string) => {
    const POLLING_INTERVAL = 5000; // 5 seconds

    setPollingStatus("polling");
    setPollingError("");

    try {
      const statusResponse = await getSwapStatus(depositAddress);
      setOneClickStatus(statusResponse);
      const destTxHash =
        statusResponse.swapDetails?.destinationChainTxHashes?.[0]?.hash;
      // Construct the explorer URL if a destination transaction hash is available
      const explorerLink = destTxHash
        ? `https://nearblocks.io/txns/${destTxHash}`
        : statusResponse.swapDetails?.destinationChainTxHashes?.[0]
            ?.explorerUrl; // Fallback to existing explorerUrl

      setNearIntentsDisplayInfo({
        message: `Swap status: ${statusResponse.status}`,
        amountIn: parseFloat(
          statusResponse.quoteResponse.quote.amountInFormatted,
        ),
        amountOut: parseFloat(
          statusResponse.quoteResponse.quote.amountOutFormatted,
        ),
        explorerUrl: explorerLink,
      });

      switch (statusResponse.status) {
        case "SUCCESS":
          setPollingStatus("success");
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
          }
          break;
        case "REFUNDED":
        case "FAILED":
        case "EXPIRED":
          setPollingStatus("failed");
          setPollingError(
            `Swap ${statusResponse.status.toLowerCase()}. Check details.`,
          );
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
          }
          break;
        case "PENDING_DEPOSIT":
        case "KNOWN_DEPOSIT_TX":
        case "PROCESSING":
          // Continue polling
          pollingTimerRef.current = setTimeout(
            () => void pollStatus(depositAddress),
            POLLING_INTERVAL,
          );
          break;
        default:
          console.warn("Unhandled 1Click status:", statusResponse.status);
          setPollingStatus("failed");
          setPollingError(`Unhandled swap status: ${statusResponse.status}`);
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
          }
          break;
      }
    } catch (pollError) {
      console.error("Error polling 1Click status:", pollError);
      setNearIntentsDisplayInfo({
        message: `Error polling swap status: ${
          (pollError as Error).message
        }. Retrying...`,
      });
      // Retry polling after a delay
      pollingTimerRef.current = setTimeout(
        () => void pollStatus(depositAddress),
        POLLING_INTERVAL * 2,
      );
    }
  };

  useEffect(() => {
    if (depositAddress) {
      setPollingStatus("idle");
      setPollingError("");
      void pollStatus(depositAddress);
    }

    // Cleanup function to clear any active polling timer
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, [depositAddress]);

  return {
    oneClickStatus,
    pollingStatus,
    pollingError,
  };
}
