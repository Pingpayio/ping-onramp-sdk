import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ConnectWalletView } from "../../../components/steps/connect-wallet-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";

export const Route = createFileRoute("/_layout/onramp/connect-wallet")({
  component: ConnectWalletRoute,
});

function ConnectWalletRoute() {
  const { connection } = usePopupConnection();
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

  const handleWalletConnected = () => {
    navigate({ to: "/onramp/form-entry", replace: true });
  };

  return <ConnectWalletView onConnected={handleWalletConnected} />;
}
