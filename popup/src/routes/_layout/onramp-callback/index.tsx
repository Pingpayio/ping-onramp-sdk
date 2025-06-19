import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { z } from "zod";
import LoadingSpinner from "../../../components/loading-spinner";
import { getSwapStatus } from "../../../lib/one-click-api";
import {
  useOnrampFlow,
  useSetNearIntentsDisplayInfo,
  useSetOneClickStatus,
  useSetOnrampResult,
} from "../../../state/hooks";

const onrampCallbackSearchSchema = z.object({
  type: z.literal("intents"),
  action: z.literal("withdraw"),
  depositAddress: z.string(),
  network: z.string(),
  asset: z.string(),
  amount: z.string(),
  recipient: z.string(),
});

export type OnrampCallbackParams = z.infer<typeof onrampCallbackSearchSchema>;

export const Route = createFileRoute("/_layout/onramp-callback/")({
  component: RouteComponent,
  validateSearch: (search) => onrampCallbackSearchSchema.parse(search),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { goToStep, setFlowError } = useOnrampFlow();
  const setOnrampResultAtom = useSetOnrampResult();
  const setOneClickStatus = useSetOneClickStatus();
  const setNearIntentsDisplayInfo = useSetNearIntentsDisplayInfo();
  const pollingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  console.log("Onramp Callback Search Params:", searchParams);

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
          statusResponse.quoteResponse.quote.amountInFormatted
        ),
        amountOut: parseFloat(
          statusResponse.quoteResponse.quote.amountOutFormatted
        ),
        explorerUrl: explorerLink,
      });

      switch (statusResponse.status) {
        case "SUCCESS":
          goToStep("complete");
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
          break;
        case "REFUNDED":
        case "FAILED":
        case "EXPIRED":
          setFlowError(
            `Swap ${statusResponse.status.toLowerCase()}. Check details.`,
            "processing-transaction"
          );
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }
          break;
        case "PENDING_DEPOSIT":
        case "KNOWN_DEPOSIT_TX":
        case "PROCESSING":
          // Continue polling
          pollingTimerRef.current = setTimeout(
            () => pollStatus(depositAddress),
            POLLING_INTERVAL
          );
          break;
        default:
          console.warn("Unhandled 1Click status:", statusResponse.status);
          if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = undefined;
          }
          setFlowError(
            `Unhandled swap status: ${statusResponse.status}`,
            "processing-transaction"
          );
      }
    } catch (pollError) {
      console.error("Error polling 1Click status:", pollError);
      setFlowError(
        `Error polling swap status: ${
          (pollError as Error).message
        }. Retrying...`,
        "processing-transaction"
      );
      // Retry polling after a delay
      pollingTimerRef.current = setTimeout(
        () => pollStatus(depositAddress),
        POLLING_INTERVAL * 2
      ); // Longer delay on error
    }
  };

  useEffect(() => {
    if (searchParams.type === "intents" && searchParams.depositAddress) {
      goToStep("processing-transaction");
      setNearIntentsDisplayInfo({
        message: "Verifying deposit status with 1Click...",
      });

      // Start polling for status
      pollStatus(searchParams.depositAddress);
    } else {
      // Handle invalid params
      setFlowError("Invalid onramp callback parameters.", "error");
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
    goToStep,
    setFlowError,
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
