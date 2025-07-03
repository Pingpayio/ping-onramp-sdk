/// <reference types="@cloudflare/workers-types" />
import type { TargetAsset } from "@pingpay/onramp-types";

export interface SessionData {
  location: { country: string; subdivision?: string };
  device: { userAgent: string | null };
  targetAsset: TargetAsset;
  origin: string;
}

export async function createSession(
  kv: KVNamespace,
  data: SessionData,
): Promise<string> {
  const sessionId = crypto.randomUUID();
  await kv.put(sessionId, JSON.stringify(data), { expirationTtl: 3600 }); // 1 hour expiration
  return sessionId;
}

export async function getSession(
  kv: KVNamespace,
  sessionId: string,
): Promise<SessionData | null> {
  const sessionData = await kv.get(sessionId);
  return sessionData ? JSON.parse(sessionData) : null;
}
