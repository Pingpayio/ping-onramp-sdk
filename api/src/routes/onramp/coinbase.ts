import { generateJwt } from '@coinbase/cdp-sdk/auth';
import { Hono } from 'hono';

type Bindings = {
	COINBASE_API_KEY: string;
	COINBASE_API_SECRET: string;
};

interface CoinbaseTokenResponse {
	data: {
		token: string;
	};
}

interface Country {
	id: string;
	name: string;
	supported_payment_methods: string[];
	states?: {
		id: string;
		name: string;
	}[];
}

interface CoinbaseConfigResponse {
	countries: Country[];
}

interface PaymentCurrency {
	id: string;
	name: string;
	min_amount: string;
	max_amount: string;
	payment_methods: {
		type: string;
		min_amount: string;
		max_amount: string;
	}[];
}

interface PurchaseCurrency {
	id: string;
	name: string;
}

interface CoinbaseOptionsResponse {
	payment_currencies: PaymentCurrency[];
	purchase_currencies: PurchaseCurrency[];
}

async function getCoinbaseAuthToken(
	apiKey: string,
	apiSecret: string,
	requestMethod: 'GET' | 'POST',
	requestPath: string,
): Promise<string> {
	const requestHost = 'api.developer.coinbase.com';
	return generateJwt({
		apiKeyId: apiKey,
		apiKeySecret: apiSecret,
		requestMethod,
		requestHost,
		requestPath,
	});
}

const coinbase = new Hono<{ Bindings: Bindings }>();

coinbase.post('/init', async (c) => {
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
		const requestPath = '/onramp/v1/token';
		const token = await getCoinbaseAuthToken(apiKey, apiSecret, 'POST', requestPath);

		const response = await fetch(`https://api.developer.coinbase.com${requestPath}`, {
			method: 'POST',
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
		console.error('Error fetching token:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: 'Failed to generate session token due to an internal error.', details: errorMessage }, 500);
	}
});

coinbase.get('/config', async (c) => {
	const apiKey = c.env.COINBASE_API_KEY;
	const apiSecret = c.env.COINBASE_API_SECRET;

	if (!apiKey || !apiSecret) {
		return c.json({ error: 'API keys not configured' }, 500);
	}

	try {
		const requestPath = '/onramp/v1/buy/config';
		const token = await getCoinbaseAuthToken(apiKey, apiSecret, 'GET', requestPath);

		const response = await fetch(`https://api.developer.coinbase.com${requestPath}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			return c.json({ error: 'Failed to get config', details: errorText }, response.status as any);
		}

		const data = (await response.json()) as CoinbaseConfigResponse;
		return c.json(data);
	} catch (error) {
		console.error('Error fetching config:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: 'Failed to fetch config due to an internal error.', details: errorMessage }, 500);
	}
});

coinbase.get('/options', async (c) => {
	const { country, subdivision } = c.req.query();

	if (!country) {
		return c.json({ error: 'Missing country parameter' }, 400);
	}

	const apiKey = c.env.COINBASE_API_KEY;
	const apiSecret = c.env.COINBASE_API_SECRET;

	if (!apiKey || !apiSecret) {
		return c.json({ error: 'API keys not configured' }, 500);
	}

	try {
		const params = new URLSearchParams({ country });
		if (subdivision) {
			params.append('subdivision', subdivision);
		}
		const requestPath = `/onramp/v1/buy/options`;
		const token = await getCoinbaseAuthToken(apiKey, apiSecret, 'GET', requestPath);

		const response = await fetch(`https://api.developer.coinbase.com${requestPath}?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			return c.json({ error: 'Failed to get options', details: errorText }, response.status as any);
		}

		const data = (await response.json()) as CoinbaseOptionsResponse;
		return c.json(data);
	} catch (error) {
		console.error('Error fetching options:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.json({ error: 'Failed to fetch options due to an internal error.', details: errorMessage }, 500);
	}
});

export default coinbase;
