import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { z } from "zod";

const initiatingSearchSchema = z.object({});

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
        ?.remoteHandle()
        .call("reportStepChanged", { step: "initiating-onramp-service" })
        .catch((e: unknown) => {
          console.error("Error calling reportStepChanged", e);

          navigate({
            to: "/onramp/error",
            search: {
              error: "Failed to report step change.",
            },
          });
        });
    }
  }, [connection, navigate, searchParams]);

  return <ProcessingOnramp step={0} />;
}
