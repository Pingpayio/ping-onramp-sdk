// popup/src/components/transaction-step.tsx

import React from 'react';
// import { useAtom } from 'jotai';
// import { signedTransactionAtom, onrampStepAtom, onrampErrorAtom, onrampTargetAtom, walletStateAtom } from '../state/atoms';
// import { usePopupChannel } from '../internal/communication/channel';
// import { signNearTransaction, handleNearCallback } from '../services/near-service'; // Assuming this is for NEAR

const TransactionStep: React.FC = () => {
  // const { channel } = usePopupChannel();
  // const [targetAsset] = useAtom(onrampTargetAtom);
  // const [walletState] = useAtom(walletStateAtom);
  // const [, setSignedTransaction] = useAtom(signedTransactionAtom);
  // const [, setStep] = useAtom(onrampStepAtom);
  // const [, setError] = useAtom(onrampErrorAtom);

  // React.useEffect(() => {
  //   // This effect could handle the callback after a redirect from NEAR wallet
  //   const callbackResult = handleNearCallback();
  //   if (callbackResult) {
  //     const { signature, publicKey, accountId } = callbackResult;
  //     const txInfo = { signature, publicKey, walletName: walletState?.walletName || 'Near Wallet', transactionHash: callbackResult.transactionHashes };
  //     setSignedTransaction(txInfo);
  //     channel?.emit('transaction-signed', txInfo);
  //     setStep('processing-transaction');
  //   }
  // }, [channel, setSignedTransaction, setStep, walletState?.walletName]);

  // const handleSignNear = async () => {
  //   if (!targetAsset || !walletState) {
  //     setError("Missing target asset or wallet information for signing.");
  //     setStep('error');
  //     channel?.emit('process-failed', { error: "Missing info for signing", step: 'signing-transaction' });
  //     return;
  //   }

  //   try {
  //     setStep('signing-transaction'); // Indicate signing in progress
      
  //     // Construct transactionDetails based on targetAsset, formData, etc.
  //     const transactionDetails = {
  //       // Example:
  //       // receiverId: 'contract.near',
  //       // actions: [ { type: 'FunctionCall', params: { methodName: 'some_method', args: {}, gas: '...', deposit: '...' } } ],
  //       // This needs to be built based on the specific NEAR interaction required
  //     };

  //     // signNearTransaction might redirect, so the promise might not resolve here
  //     // The actual result is often handled by the useEffect above after callback
  //     await signNearTransaction(transactionDetails);
  //     // If signNearTransaction doesn't redirect but returns directly (e.g., for some embedded wallets):
  //     // const { signature, publicKey } = await signNearTransaction(transactionDetails);
  //     // const txInfo = { signature, publicKey, walletName: walletState?.walletName || 'Near Wallet' };
  //     // setSignedTransaction(txInfo);
  //     // channel?.emit('transaction-signed', txInfo);
  //     // setStep('processing-transaction');

  //   } catch (err) {
  //     console.error("NEAR signing error:", err);
  //     const errorMessage = err instanceof Error ? err.message : "Failed to sign NEAR transaction.";
  //     setError(errorMessage);
  //     setStep('error');
  //     channel?.emit('process-failed', { error: errorMessage, step: 'signing-transaction' });
  //   }
  // };

  return (
    <div>
      <h2>Transaction Signing Step</h2>
      <p>Please review and sign the transaction in your wallet.</p>
      {/*
      <button onClick={handleSignNear}>Sign NEAR Transaction</button>
      */}
      <p>Transaction details and signing UI will go here.</p>
    </div>
  );
};

export default TransactionStep;
