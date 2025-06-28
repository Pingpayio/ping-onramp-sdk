import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoadingView } from "../../../components/steps/loading-view";
import { useWalletState } from "../../../state/hooks";

export const Route = createFileRoute("/_layout/onramp/")({
  component: OnrampIndexRoute,
});

function OnrampIndexRoute() {
  const [walletState] = useWalletState();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (walletState !== undefined) {
      if (walletState && walletState.address) {
        console.log(
          "[OnrampIndex] Wallet connected, navigating to form-entry.",
        );
        navigate({ to: "/onramp/form-entry", replace: true });
      } else {
        console.log(
          "[OnrampIndex] Wallet not connected, navigating to connect-wallet.",
        );
        navigate({ to: "/onramp/connect-wallet", replace: true });
      }
    }
  }, [walletState, navigate]);

  return <LoadingView />;
}
