import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { z } from "zod";

// Define the search parameters schema
const initiatingSearchSchema = z.object({
  ping_sdk_opener_origin: z.string().optional(),
});

export const Route = createFileRoute("/_layout/onramp/initiating")({
  component: InitiatingRoute,
  validateSearch: (search) => initiatingSearchSchema.parse(search),
});

function InitiatingRoute() {
  const { connection } = usePopupConnection();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  // Report step change to parent application
  useEffect(() => {
    if (connection) {
      connection
        .remoteHandle()
        .call("reportStepChanged", { step: "initiating-onramp-service" })
        .catch((e: unknown) => {
          console.error("Error calling reportStepChanged", e);
          
          // Create error search params and preserve ping_sdk_opener_origin
          const errorSearch: Record<string, string> = { 
            error: "Failed to report step change." 
          };
          
          // Add ping_sdk_opener_origin if it exists
          if (searchParams.ping_sdk_opener_origin) {
            errorSearch.ping_sdk_opener_origin = searchParams.ping_sdk_opener_origin;
          }
          
          navigate({ 
            to: "/onramp/error",
            search: errorSearch
          });
        });
    }
  }, [connection, navigate, searchParams]);

  return <ProcessingOnramp step={0} />;
}
