import { zValidator } from "@hono/zod-validator";
import {
  onrampConfigRequestSchema,
  onrampInitRequestSchema,
  onrampQuoteRequestSchema,
} from "@pingpay/onramp-types";
import { Hono } from "hono";
import { Session } from "hono-sessions";
import type { Bindings } from "../..";
import {
  OnrampSessionContext,
  onrampSessionDataMiddleware,
} from "../../middleware/onramp-session";
import { SessionData } from "../../middleware/sessions";
import {
  generateOnrampUrl,
  getAggregatedOnrampConfig,
} from "../../services/onramp/aggregator";
import { getCombinedQuote } from "../../services/onramp/quote";

const onramp = new Hono<{
  Bindings: Bindings;
  Variables: {
    session: Session<SessionData>;
    session_key_rotation: boolean;
    onrampContext: OnrampSessionContext;
  };
}>();

onramp.post(
  "/config",
  zValidator("json", onrampConfigRequestSchema),
  async (c) => {
    let country = c.req.header("cf-ipcountry");
    let subdivision = c.req.header("cf-region-code");
    const userAgent = c.req.header("user-agent");
    const origin = c.req.header("origin");
    const { targetAsset, currency } = c.req.valid("json");
    const session = c.get("session");

    if (!origin) {
      return c.json({ error: "Origin header not found" }, 400);
    }

    // Fallback for local development
    if (c.env.ENVIRONMENT === "development" && !country) {
      country = "US";
      subdivision = "IL";
    }

    if (!country) {
      return c.json({ error: "Could not determine location" }, 400);
    }

    const sessionData: Partial<SessionData> = {
      location: { country, subdivision: subdivision ?? undefined },
      targetAsset,
      origin,
      device: { userAgent: userAgent ?? null },
    };

    for (const [key, value] of Object.entries(sessionData)) {
      session.set(key as keyof SessionData, value);
    }

    const config = await getAggregatedOnrampConfig(
      c.env,
      { country, subdivision: subdivision ?? undefined, currency },
      { userAgent: userAgent ?? null },
    );

    return c.json(config);
  },
);

onramp.post(
  "/init",
  onrampSessionDataMiddleware,
  zValidator("json", onrampInitRequestSchema),
  async (c) => {
    const onrampContext = c.var.onrampContext;
    if (
      !onrampContext.location ||
      !onrampContext.targetAsset ||
      !onrampContext.origin
    ) {
      return c.json({ error: "Incomplete session data" }, 400);
    }
    const formData = c.req.valid("json");
    const result = await generateOnrampUrl(
      c.env,
      onrampContext as OnrampSessionContext,
      formData,
    );
    return c.json(result);
  },
);

onramp.post(
  "/quote",
  onrampSessionDataMiddleware,
  zValidator("json", onrampQuoteRequestSchema),
  async (c) => {
    const { location } = c.var.onrampContext;
    if (!location) {
      return c.json({ error: "Location not found in session" }, 400);
    }
    const formData = c.req.valid("json");
    const quote = await getCombinedQuote(c.env, formData, location.country);
    return c.json(quote);
  },
);

export default onramp;
