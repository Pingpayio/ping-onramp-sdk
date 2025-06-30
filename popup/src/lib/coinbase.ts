import type { OnrampConfigResponse, OnrampInitResponse } from '../types/onramp';

const API_BASE_URL = import.meta.env.PROD ? 'https://api.onramp.pingpay.io' : '';

export const onrampConfigQueryOptions = {
  queryKey: ['onrampConfig'],
  queryFn: async (): Promise<OnrampConfigResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onramp/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch onramp config');
    }
    return response.json();
  },
};

export async function fetchOnrampConfig(): Promise<OnrampConfigResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onramp/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch onramp config');
  }
  return response.json();
}

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
