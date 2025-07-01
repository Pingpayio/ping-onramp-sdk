import type { OnrampConfigResponse, OnrampInitResponse } from '@pingpay/onramp-types';

export interface OnrampProvider {
  getOnrampOptions(
    env: any,
    location: { country: string; subdivision?: string },
    device: { userAgent: string | null },
  ): Promise<Partial<OnrampConfigResponse>>;

  generateOnrampUrl(env: any, formData: any): Promise<OnrampInitResponse>;
}
