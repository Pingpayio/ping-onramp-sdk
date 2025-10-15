import { createFileRoute } from "@tanstack/react-router";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";

export const Route = createFileRoute("/_layout/onramp/processing")({
  component: ProcessingRoute,
});

function ProcessingRoute() {
  return <ProcessingOnramp step={2} />;
}
