import { ErrorView } from "@/components/steps/error-view";
import { LoadingView } from "@/components/steps/loading-view";
import { onrampTargetAtom } from "@/state/atoms";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const onrampSearchSchema = z.object({
  chain: z.string(),
  asset: z.string(),
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
