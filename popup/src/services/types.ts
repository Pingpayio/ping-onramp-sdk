// popup/src/services/types.ts

/**
 * Represents the common structure for wallet connection results.
 */
export interface WalletConnectionResult {
  address: string;
  chainId?: string; // Optional, as not all wallets/chains might return it consistently
  walletName: string; // e.g., "Coinbase Wallet", "MetaMask", "MyNearWallet"
}

/**
 * Represents the common structure for transaction signing results.
 */
export interface TransactionSignResult {
  signature: string;
  publicKey: string; // Public key corresponding to the signature
  transactionHash?: string; // Optional, as some signing methods might not return a hash immediately
  walletName?: string; // Name of the wallet used for signing
}

/**
 * Represents parameters for initiating an onramp service (e.g., Coinbase Onramp).
 * This is a generic type; specific services might have more detailed params.
 */
export interface InitiateOnrampParams {
  targetAsset: {
    chain: string; // e.g., "ethereum", "near"
    asset: string; // e.g., "USDC", "ETH"
  };
  fiatAmount: number;
  fiatCurrency: string; // e.g., "USD"
  userWalletAddress: string; // The user's address where the onramped asset will eventually go
  // Add other common parameters like redirect URLs, partner IDs, etc.
  [key: string]: any; // Allow for additional service-specific parameters
}

/**
 * Represents the result from an onramp service initiation.
 */
export interface OnrampInitiationResult {
  serviceName: string; // e.g., "Coinbase Onramp"
  redirectUrl?: string; // URL to redirect the user to, if applicable
  sessionId?: string; // Session ID or reference for the onramp process
  details?: any; // Any other relevant details from the service
}

// You can add more service-specific types or common interfaces here as needed.
// For example, if multiple onramp services share a common callback structure:
// export interface OnrampCallbackData { ... }
