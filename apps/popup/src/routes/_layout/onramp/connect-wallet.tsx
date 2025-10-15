import { createFileRoute } from "@tanstack/react-router";
import { ConnectWalletView } from "../../../components/steps/connect-wallet-view";

export const Route = createFileRoute("/_layout/onramp/connect-wallet")({
  component: ConnectWalletRoute,
});

function ConnectWalletRoute() {
  const navigate = Route.useNavigate();

  const handleWalletConnected = async () => {
    await navigate({
      to: "/onramp/form-entry",
      replace: true,
    });
  };

  return <ConnectWalletView onConnected={handleWalletConnected} />;
}
