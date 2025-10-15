import LoadingSpinner from "@/components/loading-spinner";
import { useSwapPolling } from "@/hooks/use-swap-polling";
import { onrampResultAtom } from "@/state/atoms";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import z from "zod";

export const onrampCallbackSearchSchema = z.object({
  type: z.literal("intents"),
  action: z.literal("withdraw"),
  depositAddress: z.string(),
  network: z.string(),
  asset: z.coerce.string(),
  amount: z.coerce.string(),
  recipient: z.string(),
});

export const Route = createFileRoute("/_layout/onramp/callback/")({
  component: RouteComponent,
  validateSearch: (search) => onrampCallbackSearchSchema.parse(search),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  // Use the polling hook
  const { pollingStatus, pollingError } = useSwapPolling(
    searchParams.type === "intents" ? searchParams.depositAddress || "" : "",
  );

  useEffect(() => {
    if (searchParams.type === "intents" && searchParams.depositAddress) {
      // Navigate to processing initially
      void navigate({
        to: "/onramp/processing",
      });

      // Watch polling status and navigate based on result
      if (pollingStatus === "success") {
        // Store the result in the atom before navigating
        const { store } = Route.useRouteContext();
        store.set(onrampResultAtom, {
          type: searchParams.type,
          action: searchParams.action,
          depositAddress: searchParams.depositAddress,
          network: searchParams.network,
          asset: searchParams.asset,
          amount: searchParams.amount,
          recipient: searchParams.recipient,
        });

        void navigate({
          to: "/onramp/complete",
        });
      } else if (pollingStatus === "failed") {
        void navigate({
          to: "/onramp/error",
          search: {
            error: pollingError || "Swap failed.",
          },
        });
      }
    } else {
      void navigate({
        to: "/onramp/error",
        search: {
          error: "Invalid onramp callback parameters.",
        },
      });
    }
  }, [searchParams, navigate, pollingStatus, pollingError]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <LoadingSpinner size="medium" />
      <p className="mt-3 text-sm text-muted-foreground">
        Finalizing your transaction...
      </p>
    </div>
  );
}
