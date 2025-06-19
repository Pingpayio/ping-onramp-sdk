import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
  beforeLoad: async () => {
    // Redirect to the onramp route
    return redirect({
      to: "/onramp",
    });
  },
});

function RouteComponent() {
  // This component should never render as we always redirect
  return null;
}
