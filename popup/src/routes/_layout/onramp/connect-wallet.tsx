import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ConnectWalletView } from "../../../components/steps/connect-wallet-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { z } from "zod";

// Define the search parameters schema
const connectWalletSearchSchema = z.object({
  ping_sdk_opener_origin: z.string().optional(),
});

export const Route = createFileRoute("/_layout/onramp/connect-wallet")({
  component: ConnectWalletRoute,
  validateSearch: (search) => connectWalletSearchSchema.parse(search),
});

function ConnectWalletRoute() {
  const { connection } = usePopupConnection();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

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
    // Preserve ping_sdk_opener_origin when navigating to form-entry
    const navigationSearch = searchParams.ping_sdk_opener_origin 
      ? { ping_sdk_opener_origin: searchParams.ping_sdk_opener_origin } 
      : {};
      
    navigate({ 
      to: "/onramp/form-entry", 
      search: navigationSearch,
      replace: true 
    });
  };

  return <ConnectWalletView onConnected={handleWalletConnected} />;
}
