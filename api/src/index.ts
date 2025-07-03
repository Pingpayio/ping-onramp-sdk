import { Hono } from "hono";
import { cors } from "hono/cors";
import { ApiError } from "./lib/errors";
import onramp from "./routes/onramp";

export type Bindings = {
  COINBASE_API_KEY: string;
  COINBASE_API_SECRET: string;
  CORS_ORIGIN: string;
  ENVIRONMENT: string;
  SESSIONS: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowedOrigins = (c.env.CORS_ORIGIN || "").split(",");
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return allowedOrigins.includes(origin) ? origin : undefined;
    },
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

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
