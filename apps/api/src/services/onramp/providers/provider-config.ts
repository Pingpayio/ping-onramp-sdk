export interface ProviderConfig {
  id: string;
  name: string;
  purchaseNetwork: string;
  purchaseAsset: string;
  description?: string;
  // max amount?
}

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  coinbase: {
    id: "coinbase",
    name: "Coinbase",
    purchaseNetwork: "base",
    purchaseAsset: "USDC",
    description: "Purchases USDC on Base",
  },
};

// Default provider to use for onramp flows
export const DEFAULT_PROVIDER = PROVIDER_CONFIGS.coinbase;
