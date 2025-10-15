import { ErrorComponent } from "@/components/error";
import type { RouterContext } from "@/main";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import React from "react";
import { z } from "zod";

// Validate URL search params from SDK
const rootSearchSchema = z.object({
  sessionId: z.string().default(""),
});

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: ErrorComponent,
  validateSearch: rootSearchSchema,
  beforeLoad: ({ search }) => {
    // Inject validated search params into context
    return {
      sessionId: search.sessionId,
      target: undefined,
    } as Pick<RouterContext, "sessionId" | "target">;
  },
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
