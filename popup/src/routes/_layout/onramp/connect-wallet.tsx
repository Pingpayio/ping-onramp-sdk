import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ConnectWalletView } from "../../../components/steps/connect-wallet-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { useWalletState } from "../../../state/hooks";

export const Route = createFileRoute("/_layout/onramp/connect-wallet")({
  component: ConnectWalletRoute,
});

function ConnectWalletRoute() {
  const { connection } = usePopupConnection();
  const [walletState] = useWalletState();
  const navigate = Route.useNavigate();

  // Report step change to parent application
  useEffect(() => {
    if (connection) {
      connection
        .remoteHandle()
        .call("reportStepChanged", { step: "connect-wallet" })
        .catch((e: unknown) =>
          console.error("Error calling reportStepChanged", e)
        );
    }
  }, [connection]);

  // If wallet is already connected, redirect to form-entry
  useEffect(() => {
    if (walletState && walletState.address) {
      navigate({ to: "/onramp/form-entry" });
    }
  }, [walletState, navigate]);

  const handleWalletConnected = () => {
    navigate({ to: "/onramp/form-entry" });
  };

  return <ConnectWalletView onConnected={handleWalletConnected} />;
}
