import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ErrorView } from "../../../components/steps/error-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { z } from "zod";

const errorSearchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/_layout/onramp/error")({
  component: ErrorRoute,
  validateSearch: (search) => errorSearchSchema.parse(search),
});

function ErrorRoute() {
  const { connection } = usePopupConnection();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  // Report step change to parent application
  useEffect(() => {
    if (connection) {
      connection
        ?.remoteHandle()
        .call("reportStepChanged", { step: "error" })
        .catch((e: unknown) =>
          console.error("Error calling reportStepChanged", e)
        );

      if (searchParams.error) {
        connection
          ?.remoteHandle()
          .call("reportProcessFailed", {
            error: searchParams.error,
            step: "error",
          })
          .catch((e: unknown) =>
            console.error("Error calling reportProcessFailed", e)
          );
      }
    }
  }, [connection, searchParams.error]);

  const handleRetry = () => {
    navigate({ 
      to: "/onramp/form-entry"
    });
  };

  return (
    <ErrorView
      error={searchParams.error || "An unknown error occurred"}
      onRetry={handleRetry}
    />
  );
}
