import { useReportStep } from "@/hooks/use-parent-messenger";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";

const initiatingSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/initiating")({
  component: InitiatingRoute,
  validateSearch: (search) => initiatingSearchSchema.parse(search),
});

function InitiatingRoute() {
  useReportStep("initiating-onramp-service");

  return <ProcessingOnramp step={0} />;
}
