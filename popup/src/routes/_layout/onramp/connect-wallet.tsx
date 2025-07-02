import { useReportStep } from "@/hooks/use-parent-messenger";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ConnectWalletView } from "../../../components/steps/connect-wallet-view";

const connectWalletSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/connect-wallet")({
  component: ConnectWalletRoute,
  validateSearch: (search) => connectWalletSearchSchema.parse(search),
});

function ConnectWalletRoute() {
  const navigate = Route.useNavigate();

  useReportStep("connect-wallet");

  const handleWalletConnected = async () => {
    await navigate({
      to: "/onramp/form-entry",
      replace: true,
    });
  };

  return <ConnectWalletView onConnected={handleWalletConnected} />;
}
