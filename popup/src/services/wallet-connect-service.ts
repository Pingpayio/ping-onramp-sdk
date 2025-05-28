// popup/src/services/wallet-connect-service.ts

// Placeholder for WalletConnect v2 integration if needed in the future.
// The current primary focus is Coinbase Wallet via @coinbase/onchainkit.

// import { EthereumProvider } from '@walletconnect/ethereum-provider';

// Example initialization (would require project ID and metadata)
// export async function getWalletConnectProvider() {
//   const provider = await EthereumProvider.init({
//     projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your WalletConnect Project ID
//     chains: [1], // Example: Ethereum Mainnet
//     showQrModal: true, // Show QR code modal for mobile connection
//     metadata: {
//       name: 'Pingpay Onramp Popup',
//       description: 'Connect your wallet for Pingpay Onramp',
//       url: window.location.origin,
//       icons: ['YOUR_APP_ICON_URL'], // Replace with your app icon URL
//     },
//   });
//   return provider;
// }

// export async function connectWithWalletConnect(): Promise<{ address: string; chainId: string } | null> {
//   try {
//     const provider = await getWalletConnectProvider();
//     await provider.enable(); // Opens modal and prompts user to connect

//     const accounts = await provider.request({ method: 'eth_accounts' });
//     if (!accounts || accounts.length === 0) {
//       throw new Error('No accounts returned from WalletConnect.');
//     }
//     const address = accounts[0] as string;

//     const chainIdHex = await provider.request({ method: 'eth_chainId' });
//     const chainId = parseInt(chainIdHex as string, 16).toString();
    
//     return { address, chainId };
//   } catch (error) {
//     console.error('WalletConnect connection failed:', error);
//     throw new Error(`WalletConnect connection failed: ${error instanceof Error ? error.message : String(error)}`);
//   }
// }

console.info("WalletConnect service placeholder. Integration not yet implemented.");

// Add any WalletConnect specific utility functions here if needed.
