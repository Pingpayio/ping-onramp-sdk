import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  // Maybe one day we'll put a landing page, or onramp vs offramp
  return null;
}
