import { useReportStep } from "@/hooks/use-parent-messenger";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";

const processingSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/processing")({
  component: ProcessingRoute,
  validateSearch: (search) => processingSearchSchema.parse(search),
});

function ProcessingRoute() {
  useReportStep("processing-transaction");

  return <ProcessingOnramp step={2} />;
}
