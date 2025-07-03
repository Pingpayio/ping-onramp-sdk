export enum OnrampProviderId {
  Coinbase = "COINBASE",
}

export interface OnrampConfigResponse {
  sessionId: string;
  paymentMethods: { id: string; name: string }[];
  supportedFiatCurrencies: { id: string; symbol: string }[];
  supportedCryptoAssets: { id: string; symbol: string }[];
}

export interface OnrampInitResponse {
  redirectUrl: string;
}
