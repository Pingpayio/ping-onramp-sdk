import LoadingSpinner from "@/components/loading-spinner";
import { getSwapStatus } from "@/lib/one-click-api";
import {
  useSetNearIntentsDisplayInfo,
  useSetOneClickStatus,
  useSetOnrampResult,
} from "@/state/hooks";
import { onrampCallbackSearchSchema } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_layout/onramp/callback/")({
  component: RouteComponent,
  validateSearch: (search) => onrampCallbackSearchSchema.parse(search),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const setOnrampResultAtom = useSetOnrampResult();
  const setOneClickStatus = useSetOneClickStatus();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();
  const pollingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Poll for swap status
  const pollStatus = async (depositAddress: string) => {
    const POLLING_INTERVAL = 5000; // 5 seconds

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
          setOnrampResultAtom({
            success: true,
            message: "1Click swap successful.",
            data: {
              service: "1Click",
              transactionId:
                statusResponse.swapDetails?.destinationChainTxHashes?.[0]
                  ?.hash || depositAddress,
              details: statusResponse,
            },
          });
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }

          void navigate({
            to: "/onramp/complete",
          });
          break;
        case "REFUNDED":
        case "FAILED":
        case "EXPIRED":
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }

          void navigate({
            to: "/onramp/error",
            search: {
              error: `Swap ${statusResponse.status.toLowerCase()}. Check details.`,
            },
          });
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
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }

          void navigate({
            to: "/onramp/error",
            search: {
              error: `Unhandled swap status: ${statusResponse.status}`,
            },
          });
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
      ); // Longer delay on error
    }
  };

  useEffect(() => {
    if (searchParams.type === "intents" && searchParams.depositAddress) {
      void navigate({
        to: "/onramp/processing",
      });

      setNearIntentsDisplayInfo({
        message: "Verifying deposit status with 1Click...",
      });

      // Start polling for status
      void pollStatus(searchParams.depositAddress);
    } else {
      void navigate({
        to: "/onramp/error",
        search: {
          error: "Invalid onramp callback parameters.",
        },
      });
    }

    // Cleanup function to clear any active polling timer
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
        pollingTimerRef.current = undefined;
      }
    };
  }, [
    searchParams,
    navigate,
    setOnrampResultAtom,
    setOneClickStatus,
    setNearIntentsDisplayInfo,
  ]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <LoadingSpinner size="medium" />
      <p className="mt-3 text-sm text-muted-foreground">
        Finalizing your transaction...
      </p>
    </div>
  );
}
