import { TargetAsset } from "@pingpay/onramp-types";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { createMiddleware } from "hono/factory";

export interface Location {
  country: string;
  subdivision?: string;
}

export interface SessionData {
  location: Location;
  device: { userAgent: string | null };
  targetAsset: TargetAsset;
  origin: string;
}

export const cookieSessionMiddleware = createMiddleware(async (c, next) => {
  const store = new CookieStore({ sessionCookieName: "session", encryptionKey: c.env.SESSION_ENCRYPTION_KEY });
  const isProd = c.env.ENVIRONMENT === "production";

  const m = sessionMiddleware({
    store,
    encryptionKey: c.env.SESSION_ENCRYPTION_KEY,
    expireAfterSeconds: 604800,
    cookieOptions: {
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      httpOnly: true,
      secure: isProd,
    },
  });

  return m(c, next);
});
