import { Hono } from "hono";
import type { Bindings } from "../..";
import { SessionData } from "../../middleware/sessions";
import { Session } from "hono-sessions";

const health = new Hono<{
  Bindings: Bindings;
  Variables: {
    session: Session<SessionData>;
    session_key_rotation: boolean;
  };
}>();

health.get("/", (c) => {
  return c.json({ status: "ok" }, 200);
});

export default health;

