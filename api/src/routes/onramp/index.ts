import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  onrampConfigRequestSchema,
  onrampInitRequestSchema,
  onrampQuoteRequestSchema,
} from '@pingpay/onramp-types';
import { getAggregatedOnrampConfig, generateOnrampUrl } from '../../services/onramp/aggregator';
import { getCombinedQuote } from '../../services/onramp/quote';
import { getSession } from '../../services/onramp/session-store';
import type { Bindings } from '../..';

const onramp = new Hono<{ Bindings: Bindings }>();

onramp.post('/config', zValidator('json', onrampConfigRequestSchema), async (c) => {
  let country = c.req.header('cf-ipcountry');
  let subdivision = c.req.header('cf-region-code');
  const userAgent = c.req.header('user-agent');
  const { targetAsset, currency } = c.req.valid('json');

  // Fallback for local development
  if (c.env.ENVIRONMENT === 'development' && !country) {
    country = 'US';
    subdivision = 'IL';
  }

  if (!country) {
    return c.json({ error: 'Could not determine location' }, 400);
  }

  const config = await getAggregatedOnrampConfig(
    c.env,
    { country, subdivision: subdivision ?? undefined, currency },
    { userAgent: userAgent ?? null },
    targetAsset,
  );

  return c.json(config);
});

onramp.post('/init', zValidator('json', onrampInitRequestSchema), async (c) => {
  const { sessionId, ...formData } = c.req.valid('json');

  const result = await generateOnrampUrl(c.env, sessionId, formData);
  return c.json(result);
});

onramp.post('/quote', zValidator('json', onrampQuoteRequestSchema), async (c) => {
  const { sessionId, ...formData } = c.req.valid('json');

  const session = await getSession(c.env.SESSIONS, sessionId);
  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 400);
  }

  const quote = await getCombinedQuote(c.env, formData, session.location.country);
  return c.json(quote);
});

export default onramp;
