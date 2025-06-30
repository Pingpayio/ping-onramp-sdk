import { getCoinbaseOnrampOptions, generateCoinbaseOnrampUrl } from './coinbase';
import type { OnrampConfigResponse, OnrampInitResponse } from './types';
import { createSession, getSession } from './session-store';

export async function getAggregatedOnrampConfig(
  env: any,
  location: { country: string; subdivision?: string },
  device: { userAgent: string | null },
): Promise<OnrampConfigResponse> {
  const coinbaseOptions = await getCoinbaseOnrampOptions(env, location, device);

  const aggregatedOptions = {
    paymentMethods: coinbaseOptions.paymentMethods,
    supportedFiatCurrencies: coinbaseOptions.supportedFiatCurrencies,
    supportedCryptoAssets: coinbaseOptions.supportedCryptoAssets,
  };

  const sessionId = await createSession(env.SESSIONS, { location, device });

  return {
    sessionId,
    ...aggregatedOptions,
  };
}

export async function generateOnrampUrl(
  env: any,
  sessionId: string,
  formData: any,
): Promise<OnrampInitResponse> {
  const session = await getSession(env.SESSIONS, sessionId);
  if (!session) {
    throw new Error('Invalid session ID');
  }

  // In the future, we would use the session and form data to decide which provider to use.
  // For now, we'll always use Coinbase.
  const redirectUrl = await generateCoinbaseOnrampUrl(env, formData);

  return { redirectUrl };
}
