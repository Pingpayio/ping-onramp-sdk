import { ErrorView } from "@/components/steps/error-view";
import { LoadingView } from "@/components/steps/loading-view";
import { onrampTargetAtom, appFeesAtom } from "@/state/atoms";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import type { OneClickFee } from "@/lib/one-click-api";

const onrampSearchSchema = z.object({
  chain: z.string(),
  asset: z.string(),
  appFees: z.union([z.string(), z.array(z.object({ recipient: z.string(), fee: z.number() }))]).optional(),
});

export const Route = createFileRoute("/_layout/onramp/")({
  errorComponent: ({ error, reset }) => (
    <ErrorView
      error={error.message || "Failed to initialize onramp."}
      onRetry={reset}
    />
  ),
  validateSearch: onrampSearchSchema,
  beforeLoad: ({ context, search }) => {
    const targetAsset = { chain: search.chain, asset: search.asset };
    context.store.set(onrampTargetAtom, targetAsset);
    context.target = targetAsset;
    // Parse and store appFees if provided
    if (search.appFees) {
      try {
        let appFees: OneClickFee[];
        
        // Handle both cases: already parsed as array, or JSON string
        if (Array.isArray(search.appFees)) {
          // Already an array, use it directly
          appFees = search.appFees as OneClickFee[];
        } else if (typeof search.appFees === "string") {
          // Parse JSON string
          appFees = JSON.parse(search.appFees);
        } else {
          throw new Error(`Unexpected appFees type: ${typeof search.appFees}`);
        }
        
        // Validate structure
        if (!Array.isArray(appFees) || appFees.length === 0) {
          throw new Error("appFees must be a non-empty array");
        }
        
        // Validate each fee object
        for (const fee of appFees) {
          if (!fee.recipient || typeof fee.recipient !== "string") {
            throw new Error("Each appFee must have a recipient string");
          }
          if (typeof fee.fee !== "number") {
            throw new Error("Each appFee must have a fee number");
          }
        }
        
        context.store.set(appFeesAtom, appFees);
      } catch (error) {
        console.warn("Popup: Failed to parse appFees:", error);
        // Don't throw - continue without appFees
      }
    } else {
      console.log("Popup: No appFees in URL params");
    }

    throw redirect({
      to: "/onramp/form-entry",
      replace: true,
    });
  },
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  return <LoadingView />;
}
