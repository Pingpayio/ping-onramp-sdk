import { ErrorView } from "@/components/steps/error-view";
import { LoadingView } from "@/components/steps/loading-view";
import { onrampConfigQueryOptions } from "@/lib/pingpay-api";
import { onrampTargetAtom, walletStateAtom } from "@/state/atoms";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/onramp/")({
  errorComponent: ({ error, reset }) => (
    <ErrorView error={error.message} onRetry={reset} />
  ),
  beforeLoad: ({ context }) => {
    const walletState = context.store.get(walletStateAtom);

    if (walletState?.address) {
      redirect({
        to: "/onramp/form-entry",
        replace: true,
        throw: true,
      });
    } else {
      redirect({
        to: "/onramp/connect-wallet",
        replace: true,
        throw: true,
      });
    }
  },
  loader: ({ context }) => {
    const targetAsset = context.store.get(onrampTargetAtom);
    return context.queryClient.ensureQueryData(
      onrampConfigQueryOptions(targetAsset),
    );
  },
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  return <LoadingView />;
}
