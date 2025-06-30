/// <reference types="@cloudflare/workers-types" />
import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  location: { country: string; subdivision?: string };
  device: { userAgent: string | null };
  // Add other session data as needed
}

export async function createSession(kv: KVNamespace, data: SessionData): Promise<string> {
  const sessionId = uuidv4();
  await kv.put(sessionId, JSON.stringify(data), { expirationTtl: 3600 }); // 1 hour expiration
  return sessionId;
}

export async function getSession(kv: KVNamespace, sessionId: string): Promise<SessionData | null> {
  const sessionData = await kv.get(sessionId);
  return sessionData ? JSON.parse(sessionData) : null;
}
