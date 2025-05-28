// popup/src/components/wallet-connect-step.tsx

import React from 'react';
// import { useAtom } from 'jotai';
// import { walletStateAtom, onrampStepAtom, onrampErrorAtom } from '../state/atoms';
// import { usePopupChannel } from '../internal/communication/channel';
// import { connectCoinbaseWallet } from '../services/coinbase-service';
// Potentially import other wallet connection services

const WalletConnectStep: React.FC = () => {
  // const { channel } = usePopupChannel();
  // const [, setWalletState] = useAtom(walletStateAtom);
  // const [, setStep] = useAtom(onrampStepAtom);
  // const [, setError] = useAtom(onrampErrorAtom);

  // const handleConnectCoinbase = async () => {
  //   try {
  //     setStep('connecting-wallet'); // Indicate loading/connecting state
  //     const { address, chainId } = await connectCoinbaseWallet();
  //     const walletInfo = { address, chainId, walletName: 'Coinbase Wallet' };
  //     setWalletState(walletInfo);
  //     channel?.emit('wallet-connected', walletInfo);
  //     setStep('initiating-onramp-service'); // Or next appropriate step
  //   } catch (err) {
  //     console.error("Coinbase connection error:", err);
  //     const errorMessage = err instanceof Error ? err.message : "Failed to connect Coinbase Wallet.";
  //     setError(errorMessage);
  //     setStep('error');
  //     channel?.emit('process-failed', { error: errorMessage, step: 'connecting-wallet' });
  //   }
  // };

  return (
    <div>
      <h2>Wallet Connect Step</h2>
      <p>Please connect your wallet to proceed.</p>
      {/*
      <button onClick={handleConnectCoinbase}>Connect Coinbase Wallet</button>
      */}
      {/* Add buttons for other wallet types if needed */}
      <p>Wallet connection UI will go here.</p>
    </div>
  );
};

export default WalletConnectStep;
