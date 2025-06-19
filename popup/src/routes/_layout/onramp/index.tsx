import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWalletState } from "../../../state/hooks";

export const Route = createFileRoute("/_layout/onramp/")({
  component: OnrampIndexRoute,
  beforeLoad: async () => {
    return redirect({
      to: "/onramp/connect-wallet",
    });
  },
});

function OnrampIndexRoute() {
  const [walletState] = useWalletState();
  const navigate = Route.useNavigate();

  useEffect(() => {
    // If wallet is already connected, redirect to form-entry
    if (walletState && walletState.address) {
      navigate({ to: "/onramp/form-entry" });
    }
  }, [walletState, navigate]);

  // This component should never render as we always redirect
  return null;
}
