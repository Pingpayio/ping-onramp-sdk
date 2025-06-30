import { Hono } from 'hono';
import { getAggregatedOnrampConfig, generateOnrampUrl } from '../../services/onramp/aggregator';
import type { Bindings } from '../..';

const onramp = new Hono<{ Bindings: Bindings }>();

onramp.get('/config', async (c) => {
  let country = c.req.header('cf-ipcountry');
  const subdivision = c.req.header('cf-region-code');
  const userAgent = c.req.header('user-agent');

  // Fallback for local development
  if (c.env.ENVIRONMENT === 'development' && !country) {
    country = 'US';
  }

  if (!country) {
    return c.json({ error: 'Could not determine location' }, 400);
  }

  const config = await getAggregatedOnrampConfig(
    c.env,
    { country, subdivision: subdivision ?? undefined },
    { userAgent: userAgent ?? null },
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
