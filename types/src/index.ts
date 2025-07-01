
import { z } from 'zod';

export const targetAssetSchema = z.object({
  chain: z.string(),
  asset: z.string(),
});

export type TargetAsset = z.infer<typeof targetAssetSchema>;

export enum OnrampProviderId {
  Coinbase = 'COINBASE',
}

export interface PaymentMethodLimit {
  id: string;
  min: string;
  max: string;
}

export interface PaymentCurrency {
  id: string;
  limits: PaymentMethodLimit[];
}

export interface Network {
  name: string;
  displayName: string;
  chainId: string;
  contractAddress: string;
}

export interface PurchaseCurrency {
  id: string;
  name: string;
  symbol: string;
  networks: Network[];
}

export interface OnrampConfigResponse {
  sessionId: string;
  paymentMethods: { id: string; }[];
  paymentCurrencies: PaymentCurrency[];
  purchaseCurrencies: PurchaseCurrency[];
  isIosDevice: boolean;
}

export interface OnrampInitResponse {
  redirectUrl: string;
}