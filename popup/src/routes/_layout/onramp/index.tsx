import { ErrorView } from "@/components/steps/error-view";
import { LoadingView } from "@/components/steps/loading-view";
import { getTargetAsset } from "@/lib/popup-connection";
import { onrampTargetAtom } from "@/state/atoms";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/onramp/")({
  errorComponent: ({ error, reset }) => (
    <ErrorView
      error={error.message || "Failed to initialize onramp."}
      onRetry={reset}
    />
  ),
  loader: async ({ context }) => {
    const targetAsset = await getTargetAsset();

    if (!targetAsset) {
      throw new Error("Target asset not provided by SDK.");
    }

    context.store.set(onrampTargetAtom, targetAsset);

    redirect({
      to: "/onramp/form-entry",
      replace: true,
      throw: true
    });
  },
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  return <LoadingView />;
}
