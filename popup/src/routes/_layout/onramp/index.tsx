import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoadingView } from '@/components/steps/loading-view';
import { onrampConfigQueryOptions } from '@/lib/coinbase';
import { onrampTargetAtom, walletStateAtom } from '@/state/atoms';
import { ErrorView } from '@/components/steps/error-view';

export const Route = createFileRoute('/_layout/onramp/')({
  errorComponent: ({ error, reset }) => <ErrorView error={error.message} onRetry={reset} />,
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
  loader: ({ context }) => {
    const targetAsset = context.store.get(onrampTargetAtom);
    return context.queryClient.ensureQueryData(onrampConfigQueryOptions(targetAsset));
  },
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  return <LoadingView />;
}
