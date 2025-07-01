import { generateJwt } from '@coinbase/cdp-sdk/auth';
import type { OnrampConfigResponse, OnrampInitResponse, PaymentCurrency, PurchaseCurrency } from '@pingpay/onramp-types';
import type { OnrampProvider } from './types';

interface CoinbaseConfigResponse {
  countries: { id: string; subdivisions: string[]; payment_methods: { id: string, name: string }[] }[];
}

interface CoinbaseOptionsResponse {
  payment_currencies: PaymentCurrency[];
  purchase_currencies: PurchaseCurrency[];
}

interface CoinbaseTokenResponse {
  token: string;
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

class CoinbaseProvider implements OnrampProvider {
  async getOnrampOptions(
    env: any,
    location: { country: string; subdivision?: string },
    device: { userAgent: string | null },
  ): Promise<Partial<OnrampConfigResponse>> {
    const { country, subdivision } = location;
    const { COINBASE_API_KEY, COINBASE_API_SECRET } = env;

    const configPath = '/onramp/v1/buy/config';
    const configToken = await getCoinbaseAuthToken(COINBASE_API_KEY, COINBASE_API_SECRET, 'GET', configPath);
    const configResponse = await fetch(`https://api.developer.coinbase.com${configPath}`, {
      headers: { Authorization: `Bearer ${configToken}` },
    });
    const configData = (await configResponse.json()) as CoinbaseConfigResponse;
    const countryInfo = configData.countries.find((c) => c.id === country);

    const isIosDevice = /iPad|iPhone|iPod/.test(device.userAgent ?? '');

    if (!countryInfo) {
      return {
        paymentMethods: [],
        paymentCurrencies: [],
        purchaseCurrencies: [],
        isIosDevice,
      };
    }

    const optionsParams = new URLSearchParams({ country });
    if (subdivision) {
      optionsParams.append('subdivision', subdivision);
    }
    const optionsPath = `/onramp/v1/buy/options`;
    const optionsToken = await getCoinbaseAuthToken(COINBASE_API_KEY, COINBASE_API_SECRET, 'GET', optionsPath);
    const optionsResponse = await fetch(`https://api.developer.coinbase.com${optionsPath}?${optionsParams.toString()}`, {
      headers: { Authorization: `Bearer ${optionsToken}` },
    });
    const optionsData = (await optionsResponse.json()) as CoinbaseOptionsResponse;

    return {
      paymentMethods: countryInfo.payment_methods,
      paymentCurrencies: optionsData.payment_currencies,
      purchaseCurrencies: optionsData.purchase_currencies,
      isIosDevice,
    };
  }

  async generateOnrampUrl(env: any, formData: any): Promise<OnrampInitResponse> {
    const { COINBASE_API_KEY, COINBASE_API_SECRET } = env;
    const { amount, asset, network, address, partnerUserId, redirectUrl, paymentCurrency, paymentMethod } = formData;

    const tokenPath = '/onramp/v1/token';
    const tokenBody = {
      addresses: [{ address, blockchains: [network] }],
      assets: [asset],
    };
    const token = await getCoinbaseAuthToken(COINBASE_API_KEY, COINBASE_API_SECRET, 'POST', tokenPath);
    const tokenResponse = await fetch(`https://api.developer.coinbase.com${tokenPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tokenBody),
    });
    const { token: sessionToken } = (await tokenResponse.json()) as CoinbaseTokenResponse;

    const onrampUrl = new URL('https://pay.coinbase.com/buy/select-asset');
    onrampUrl.searchParams.set('sessionToken', sessionToken);
    onrampUrl.searchParams.set('defaultAsset', asset);
    onrampUrl.searchParams.set('defaultNetwork', network);
    onrampUrl.searchParams.set('presetFiatAmount', amount);
    onrampUrl.searchParams.set('partnerUserId', partnerUserId);
    onrampUrl.searchParams.set('redirectUrl', redirectUrl);
    if (paymentCurrency) {
      onrampUrl.searchParams.set('fiatCurrency', paymentCurrency);
    }
    if (paymentMethod) {
      onrampUrl.searchParams.set('defaultPaymentMethod', paymentMethod);
    }

    return { redirectUrl: onrampUrl.toString() };
  }
}

export const coinbaseProvider = new CoinbaseProvider();
