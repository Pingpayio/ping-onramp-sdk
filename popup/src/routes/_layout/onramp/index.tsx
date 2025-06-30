import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoadingView } from "../../../components/steps/loading-view";
import { onrampConfigQueryOptions } from "../../../lib/coinbase";
import { walletStateAtom } from "../../../state/atoms";

export const Route = createFileRoute("/_layout/onramp/")({
  beforeLoad: ({ context }) => {
    const walletState = context.store.get(walletStateAtom);

    if (walletState && walletState.address) {
      throw redirect({
        to: "/onramp/form-entry",
        replace: true,
      });
    } else {
      throw redirect({
        to: "/onramp/connect-wallet",
        replace: true,
      });
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(onrampConfigQueryOptions),
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  return <LoadingView />;
}
