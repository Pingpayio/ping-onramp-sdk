import type { OnrampConfigResponse, OnrampInitResponse, TargetAsset } from '@pingpay/onramp-types';

const API_BASE_URL = import.meta.env.PROD ? 'https://api.onramp.pingpay.io' : '';

export const onrampConfigQueryOptions = (targetAsset: TargetAsset) => ({
  queryKey: ['onramp', 'config', targetAsset],
  queryFn: async (): Promise<OnrampConfigResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onramp/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetAsset, currency: "USD" }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch onramp config');
    }
    return response.json();
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export async function initOnramp(sessionId: string, formData: any): Promise<OnrampInitResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onramp/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      ...formData,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize onramp');
  }

  return response.json();
}
