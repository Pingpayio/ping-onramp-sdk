import { createFileRoute } from "@tanstack/react-router";
import { ProcessingOnramp } from "../../../components/steps/processsing-onramp-view";

export const Route = createFileRoute("/_layout/onramp/initiating")({
  component: InitiatingRoute,
});

function InitiatingRoute() {
  return <ProcessingOnramp step={0} />;
}
