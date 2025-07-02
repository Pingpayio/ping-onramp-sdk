import {
  useParentMessenger,
  useReportStep,
} from "@/hooks/use-parent-messenger";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { ProcessingOnramp } from "@/components/steps/processsing-onramp-view";
import { useOnrampResult } from "@/state/hooks";

const completeSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/complete")({
  component: CompleteRoute,
  validateSearch: (search) => completeSearchSchema.parse(search),
});

function CompleteRoute() {
  const [onrampResult] = useOnrampResult();
  const { call } = useParentMessenger();
  useReportStep("complete");

  useEffect(() => {
    if (onrampResult) {
      call("reportProcessComplete", { result: onrampResult })?.catch(
        (e: unknown) => {
          console.error("Failed to report process failure:", e);
        },
      );
    }
  }, [call, onrampResult]);

  return <ProcessingOnramp step={3} result={onrampResult} />;
}
