import { Hono } from "hono";
import { Session } from "hono-sessions";
import { cors } from "hono/cors";
import { ApiError } from "./lib/errors";
import { cookieSessionMiddleware, SessionData } from "./middleware/sessions";
import onramp from "./routes/onramp";

export type Bindings = {
  COINBASE_API_KEY: string;
  COINBASE_API_SECRET: string;
  CORS_ORIGIN: string;
  ENVIRONMENT: string;
  SESSION_ENCRYPTION_KEY: string;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: {
    session: Session<SessionData>;
    session_key_rotation: boolean;
  };
}>().basePath("/api");

app.use("*").use(cookieSessionMiddleware);

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin, c) => {
      const allowedOriginsEnv = (c.env.CORS_ORIGIN || "")
        .split(",")
        .map((o: string) => o.trim())
        .filter(Boolean);

      const hardcodedAllowedOrigins = ["https://onramp.pingpay.io"];

      const allAllowedOrigins = [
        ...allowedOriginsEnv,
        ...hardcodedAllowedOrigins,
      ];

      if (allAllowedOrigins.includes("*")) {
        return "*";
      }

      if (origin && allAllowedOrigins.includes(origin)) {
        return origin;
      }

      return null;
    },
    allowMethods: ["GET", "OPTIONS", "POST"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

app.route("/onramp", onramp);

app.onError((err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      {
        error: err.message,
        details: err.details,
      },
      err.status,
    );
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
