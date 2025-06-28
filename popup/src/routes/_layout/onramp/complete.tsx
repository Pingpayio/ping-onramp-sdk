import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";
import { usePopupConnection } from "../../../internal/communication/usePopupConnection";
import { useOnrampResult } from "../../../state/hooks";
import { z } from "zod";

const completeSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/complete")({
  component: CompleteRoute,
  validateSearch: (search) => completeSearchSchema.parse(search),
});

function CompleteRoute() {
  const { connection } = usePopupConnection();
  const [onrampResult] = useOnrampResult();

  // Report step change to parent application
  useEffect(() => {
    if (connection) {
      connection
        ?.remoteHandle()
        .call("reportStepChanged", { step: "complete" })
        .catch((e: unknown) =>
          console.error("Error calling reportStepChanged", e),
        );

      if (onrampResult) {
        connection
          ?.remoteHandle()
          .call("reportProcessComplete", { result: onrampResult })
          .catch((e: unknown) =>
            console.error("Error calling reportProcessComplete", e),
          );
      }
    }
  }, [connection, onrampResult]);

  return <ProcessingOnramp step={3} result={onrampResult} />;
}
