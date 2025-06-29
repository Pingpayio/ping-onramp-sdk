import { generateJwt } from '@coinbase/cdp-sdk/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	COINBASE_API_KEY: string;
	COINBASE_API_SECRET: string;
	CORS_ORIGIN: string;
};

interface CoinbaseTokenResponse {
	data: {
		token: string;
	};
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})


app.post('/onramp/coinbase/init', async (c) => {
	const { addresses, assets } = await c.req.json();

	if (!addresses || !assets) {
		return c.json({ error: 'Missing addresses or assets' }, 400);
	}

	const apiKey = c.env.COINBASE_API_KEY;
	const apiSecret = c.env.COINBASE_API_SECRET;

	if (!apiKey || !apiSecret) {
		return c.json({ error: 'API keys not configured' }, 500);
	}

	try {
		const requestMethod = 'POST';
		const requestHost = 'api.developer.coinbase.com';
		const requestPath = '/onramp/v1/token';

		const token = await generateJwt({
			apiKeyId: apiKey,
			apiKeySecret: apiSecret,
			requestMethod,
			requestHost,
			requestPath,
		});

		const response = await fetch(`https://${requestHost}${requestPath}`, {
			method: requestMethod,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ addresses, assets }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			return c.json({ error: 'Failed to get session token', details: errorText }, response.status as any);
		}

		const data = (await response.json()) as CoinbaseTokenResponse;
		return c.json(data);
	} catch (error) {
		console.error('Error signing JWT or fetching token:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: 'Failed to generate session token due to an internal error.', details: errorMessage }, 500);
	}
});

export default app;
