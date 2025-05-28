// popup/src/services/coinbase-service.ts

// Assuming you've installed @coinbase/onchainkit
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
// Import other necessary types/functions from OnchainKit

// Initialize Coinbase Wallet SDK (configure with your app details)
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: 'Pingpay Onramp',
  appLogoUrl: '', // Replace with your logo - Leaving empty as per spec example
  darkMode: false,
});

// Get the Ethereum provider
// The spec has 'make  EVMProvider' which seems like a typo, should be 'makeWeb3Provider' or similar
// Based on common usage and older SDK versions, makeWeb3Provider is typical.
// If using a newer version of @coinbase/wallet-sdk, this might need adjustment.
// For now, I'll assume makeWeb3Provider or a similar method that returns an EIP-1193 provider.
// Let's assume `makeWeb3Provider` for now, which returns an EIP-1193 provider.
const ethereum = coinbaseWallet.makeWeb3Provider();


export async function connectCoinbaseWallet(): Promise<{ address: string; chainId: string }> {
  try {
    // Request accounts using the standard Ethereum provider API
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No Coinbase Wallet account selected or permission denied.");
    }
    const address = accounts[0];

    // Get chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' }) as string;


    if (!address) {
      // This check is redundant if the one above catches empty accounts array
      throw new Error("No Coinbase Wallet account selected.");
    }

    return { address, chainId };
  } catch (error: any) {
    console.error("Coinbase Wallet connection failed:", error);
    // It's better to throw the original error or a new error with more context
    // instead of just error.message, which might be a generic string.
    if (error instanceof Error) {
        throw new Error(`Coinbase Wallet connection failed: ${error.message}`);
    }
    throw new Error(`Coinbase Wallet connection failed: An unknown error occurred.`);
  }
}

// You might have other functions here for interacting with Coinbase Onramp features
// if OnchainKit supports initiating those within this context.
// e.g., export async function initiateCoinbaseOnrampFlow(params: any): Promise<any> { ... }
