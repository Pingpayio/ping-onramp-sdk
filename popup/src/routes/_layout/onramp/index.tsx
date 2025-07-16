import { ErrorView } from "@/components/steps/error-view";
import { LoadingView } from "@/components/steps/loading-view";
import { connectionPromise } from "@/lib/connection-guard";
import { onrampConfigQueryOptions } from "@/lib/pingpay-api";
import { onrampTargetAtom } from "@/state/atoms";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAtomValue } from "jotai";

export const Route = createFileRoute("/_layout/onramp/")({
  errorComponent: ({ error, reset }) => (
    <ErrorView error={error.message} onRetry={reset} />
  ),
  beforeLoad: async () => {
    await connectionPromise;

    redirect({
      to: "/onramp/form-entry",
      replace: true,
      throw: true,
    });
  },
  // loader: ({ context }) => {
  //   const targetAsset = context.store.get(onrampTargetAtom);
  //   return context.queryClient.fetchQuery(onrampConfigQueryOptions(targetAsset));
  // },
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  const targetAsset = useAtomValue(onrampTargetAtom);
  const { isLoading } = useQuery(onrampConfigQueryOptions(targetAsset));

  if (isLoading) {
    return <LoadingView />;
  }

  // This component will redirect, so we don't need to render anything here.
  // The redirect happens in the beforeLoad function.
  return null;
}
