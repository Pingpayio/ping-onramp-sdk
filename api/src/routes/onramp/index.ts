import { Hono } from 'hono';
import { getAggregatedOnrampConfig, generateOnrampUrl } from '../../services/onramp/aggregator';
import type { Bindings } from '../..';

const onramp = new Hono<{ Bindings: Bindings }>();

onramp.post('/config', async (c) => {
  let country = c.req.header('cf-ipcountry');
  let subdivision = c.req.header('cf-region-code');
  const userAgent = c.req.header('user-agent');
  const { targetAsset, currency } = await c.req.json();

  // Fallback for local development
  if (c.env.ENVIRONMENT === 'development' && !country) {
    country = 'US';
    subdivision = "IL";
  }

  if (!country) {
    return c.json({ error: 'Could not determine location' }, 400);
  }

  if (!targetAsset) {
    return c.json({ error: 'Missing targetAsset' }, 400);
  }

  const config = await getAggregatedOnrampConfig(
    c.env,
    { country, subdivision: subdivision ?? undefined, currency },
    { userAgent: userAgent ?? null },
    targetAsset,
  );

  return c.json(config);
});

onramp.post('/init', async (c) => {
  const { sessionId, ...formData } = await c.req.json();

  if (!sessionId) {
    return c.json({ error: 'Missing sessionId' }, 400);
  }

  const result = await generateOnrampUrl(c.env, sessionId, formData);
  return c.json(result);
});

export default onramp;
