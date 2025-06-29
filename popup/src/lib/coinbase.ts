/**
 * Utility functions for Coinbase Onramp URL generation
 */
export interface OnrampURLParams {
	asset: string; // e.g., "USDC"
	amount: string; // Fiat amount, e.g., "10"
	network: string; // EVM network for deposit, e.g., "base"
	address: string; // EVM deposit address (e.g., NEAR Intents deposit address on Base)
	partnerUserId: string; // User's EVM wallet address
	redirectUrl: string; // Callback URL to this application
	paymentCurrency?: string;
	paymentMethod?: string;
	enableGuestCheckout?: boolean;
}

export interface Country {
	id: string;
	name: string;
	supported_payment_methods: string[];
	states?: {
		id: string;
		name: string;
	}[];
}

export interface CoinbaseConfig {
	countries: Country[];
}

export interface PaymentCurrency {
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

export interface PurchaseCurrency {
	id: string;
	name: string;
}

export interface CoinbaseOptions {
	payment_currencies: PaymentCurrency[];
	purchase_currencies: PurchaseCurrency[];
}

const API_BASE_URL = import.meta.env.PROD ? 'https://api.onramp.pingpay.io' : '';

export async function fetchOnrampConfig(): Promise<CoinbaseConfig> {
	const response = await fetch(`${API_BASE_URL}/api/onramp/coinbase/config`);
	if (!response.ok) {
		throw new Error('Failed to fetch onramp config');
	}
	return response.json();
}

export async function fetchOnrampOptions(country: string, subdivision?: string): Promise<CoinbaseOptions> {
	const params = new URLSearchParams({ country });
	if (subdivision) {
		params.append('subdivision', subdivision);
	}
	const response = await fetch(`${API_BASE_URL}/api/onramp/coinbase/options?${params.toString()}`);
	if (!response.ok) {
		throw new Error('Failed to fetch onramp options');
	}
	return response.json();
}

async function fetchSessionToken(address: string, network: string, assets: string[]): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/onramp/coinbase/init`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			addresses: [{ address, blockchains: [network] }],
			assets,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to fetch session token');
	}

	const { token } = await response.json();
	return token;
}

/**
 * Generates a Coinbase Onramp URL with the provided parameters
 */
export async function generateOnrampURL(params: OnrampURLParams): Promise<string> {
	const {
		asset,
		amount,
		network,
		address,
		partnerUserId,
		redirectUrl,
		paymentCurrency,
		paymentMethod,
		enableGuestCheckout,
	} = params;

	const numericAmount = parseFloat(amount);
	if (isNaN(numericAmount) || numericAmount <= 0) {
		throw new Error('Invalid or zero amount provided for onramp.');
	}

	const sessionToken = await fetchSessionToken(address, network, [asset]);

	const baseUrl = 'https://pay.coinbase.com/buy/select-asset';
	const queryParams = new URLSearchParams();

	queryParams.append('sessionToken', sessionToken);

	if (asset) {
		queryParams.append('defaultAsset', asset.toUpperCase());
	}

	if (network) {
		queryParams.append('defaultNetwork', network.toUpperCase());
	}

	if (paymentMethod) {
		const formattedPaymentMethod = paymentMethod.toUpperCase();
		queryParams.append('defaultPaymentMethod', formattedPaymentMethod);
	}

	if (numericAmount > 0) {
		queryParams.append('presetFiatAmount', numericAmount.toString());
	}

	if (paymentCurrency) {
		queryParams.append('fiatCurrency', paymentCurrency.toUpperCase());
	}

	queryParams.append('partnerUserId', partnerUserId.substring(0, 49));

	if (redirectUrl) {
		queryParams.append('redirectUrl', redirectUrl);
	}

	if (enableGuestCheckout !== undefined) {
		queryParams.append('enableGuestCheckout', enableGuestCheckout.toString());
	}

	return `${baseUrl}?${queryParams.toString()}`;
}
