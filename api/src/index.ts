import { Hono } from 'hono';
import { cors } from 'hono/cors';
import coinbase from './routes/onramp/coinbase';

type Bindings = {
	COINBASE_API_KEY: string;
	COINBASE_API_SECRET: string;
	CORS_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.use('*', async (c, next) => {
	const corsMiddlewareHandler = cors({
		origin: c.env.CORS_ORIGIN,
	});
	return corsMiddlewareHandler(c, next);
});

app.route('/onramp/coinbase', coinbase);

export default app;
