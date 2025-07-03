import { TargetAsset } from "@pingpay/onramp-types";
import { Session } from "hono-sessions";
import { createMiddleware } from "hono/factory";
import { Location, SessionData } from "./sessions";

export interface OnrampSessionContext {
  location: Location;
  targetAsset: TargetAsset;
  origin: string;
}

export const onrampSessionDataMiddleware = createMiddleware<{
  Variables: {
    session: Session<SessionData>;
    onrampContext: Partial<OnrampSessionContext>;
  };
}>(async (c, next) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ error: "Session not found" }, 400);
  }

  const onrampContext: Partial<OnrampSessionContext> = {};

  if (c.req.path.endsWith("/quote")) {
    const location = session.get("location");
    if (!location) {
      return c.json({ error: "Location not found in session" }, 400);
    }
    onrampContext.location = location;
  } else {
    const location = session.get("location");
    const targetAsset = session.get("targetAsset");
    const origin = session.get("origin");

    if (!location || !targetAsset || !origin) {
      return c.json({ error: "Incomplete session data" }, 400);
    }
    onrampContext.location = location;
    onrampContext.targetAsset = targetAsset;
    onrampContext.origin = origin;
  }

  c.set("onrampContext", onrampContext);

  await next();
});
