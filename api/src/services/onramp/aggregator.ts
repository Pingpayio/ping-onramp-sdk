import { coinbaseProvider } from './providers/coinbase';
import type { OnrampConfigResponse, OnrampInitResponse, TargetAsset } from '@pingpay/onramp-types';
import { createSession, getSession } from './session-store';

export async function getAggregatedOnrampConfig(
  env: any,
  location: { country: string; subdivision?: string, currency: string },
  device: { userAgent: string | null },
  targetAsset: TargetAsset,
): Promise<OnrampConfigResponse> {
  const coinbaseOptions = await coinbaseProvider.getOnrampOptions(env, location, device);

  const paymentCurrencies = coinbaseOptions.paymentCurrencies!.filter(
    (currency) => currency.id === location.currency,
  );
  const purchaseCurrencies = coinbaseOptions.purchaseCurrencies!.filter(
    (currency) => currency.symbol === 'USDC',
  );

  const aggregatedOptions = {
    paymentMethods: coinbaseOptions.paymentMethods,
    paymentCurrencies,
    purchaseCurrencies,
    isIosDevice: coinbaseOptions.isIosDevice,
  };

  const sessionId = await createSession(env.SESSIONS, { location, device, targetAsset });

  return {
    sessionId,
    ...aggregatedOptions,
  } as OnrampConfigResponse;
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
  const { redirectUrl } = await coinbaseProvider.generateOnrampUrl(env, formData);

  return { redirectUrl };
}
