<img width="565" alt="Screenshot 2025-05-29 at 1 52 36 PM" src="https://github.com/user-attachments/assets/c8a9caf3-2e20-4057-a2a1-b22c8e84473e" />

## Usage

### Installation

```bash
npm install @pingpay/onramp-sdk
```

### Basic Usage

```tsx
import { PingpayOnramp } from '@pingpay/onramp-sdk';
import type { TargetAsset, OnrampResult } from '@pingpay/onramp-sdk';

const onramp = new PingpayOnramp();

const targetAsset: TargetAsset = {
  chain: 'NEAR',
  asset: 'USDC'
};

async function handleOnramp() {
  try {
    const result: OnrampResult = await onramp.initiateOnramp(targetAsset);
    console.log('Onramp successful:', result);
  } catch (error) {
    console.error('Onramp failed:', error);
  }
}

return <button onClick={handleOnramp}>Pingpay Onramp</button>
```

### Advanced Usage

The SDK provides helper methods to hook into the onramp lifecycle.

```tsx
import { PingpayOnramp } from '@pingpay/onramp-sdk';
import type {
  TargetAsset,
  OnrampResult,
  PingpayOnrampConfig,
  OnrampFlowPayload,
  OnrampStep,
  OnrampStepDetails,
  FormDataSubmittedPayload,
  WalletConnectedPayload,
  TransactionSignedPayload,
  OnrampInitiatedPayload,
  ProcessFailedPayload,
  PingpayOnrampError,
} from '@pingpay/onramp-sdk';

const config: PingpayOnrampConfig = {
  onPopupReady: () => {
    console.log('SDK: Popup is ready.');
  },
  onFlowStarted: (payload: OnrampFlowPayload) => {
    console.log('SDK: Onramp flow started:', payload);
  },
  onStepChange: (step: OnrampStep, details?: OnrampStepDetails) => {
    console.log('SDK: Onramp step changed:', step, details);
  },
  onFormDataSubmitted: (payload: FormDataSubmittedPayload) => {
    console.log('SDK: Form data submitted:', payload);
  },
  onWalletConnected: (payload: WalletConnectedPayload) => {
    console.log('SDK: Wallet connected:', payload);
  },
  onTransactionSigned: (payload: TransactionSignedPayload) => {
    console.log('SDK: Transaction signed:', payload);
  },
  onOnrampInitiated: (payload: OnrampInitiatedPayload) => {
    console.log('SDK: Onramp initiated with service:', payload);
  },
  onProcessComplete: (result: OnrampResult) => {
    console.log('SDK: Onramp process complete:', result);
  },
  onProcessFailed: (payload: ProcessFailedPayload) => {
    console.error('SDK: Onramp process failed:', payload.error, payload.details, payload.step);
  },
  onPopupClose: () => {
    console.log('SDK: Popup was closed.');
  }
};

const onramp = new PingpayOnramp(config);

const targetAsset: TargetAsset = {
  chain: 'NEAR',
  asset: 'USDC'
};

async function handleOnramp() {
  try {
    const result: OnrampResult = await onramp.initiateOnramp(targetAsset);
    console.log('Onramp successful:', result);
  } catch (error) {
    if (error instanceof PingpayOnrampError) { // Use PingpayOnrampError for specific error handling
      console.error('Onramp failed specifically:', error.message, error.details, error.step);
    } else {
      console.error('Onramp failed generally:', error);
    }
  }
}

return <button onClick={handleOnramp}>Pingpay Onramp</button>
```

### Configuration

*   Event Handlers (all optional):
    *   `onPopupReady()`: Called when the popup window signals it's ready. (SDK logs this internally too)
    *   `onFlowStarted(payload: OnrampFlowPayload)`: Called when the onramp flow begins in the popup.
    *   `onStepChange(step: OnrampStep, details?: OnrampStepDetails)`: Called when the current step in the onramp process changes.
    *   `onFormDataSubmitted(payload: FormDataSubmittedPayload)`: Called when user submits form data.
    *   `onWalletConnected(payload: WalletConnectedPayload)`: Called when a wallet is successfully connected.
    *   `onTransactionSigned(payload: TransactionSignedPayload)`: Called when a transaction is signed by the user.
    *   `onOnrampInitiated(payload: OnrampInitiatedPayload)`: Called when the onramp process is initiated with the backend service.
    *   `onProcessComplete(result: OnrampResult)`: Called when the entire onramp process is successfully completed.
    *   `onProcessFailed(payload: ProcessFailedPayload)`: Called if the onramp process fails at any point.
    *   `onPopupClose()`: Called when the popup is closed, either by the user, an error, or programmatically.

### Closing the Onramp

You can programmatically close the onramp popup and clean up resources by calling the `close()` method:

```typescript
onramp.close();
```

This is useful if your application needs to interrupt the onramp flow.
The `onPopupClose` callback will also be triggered.

## Development

To install dependencies:

```bash
bun install
```

To run (example, adjust as per your project's actual run script for the SDK examples or tests):

```bash
bun run index.ts 
```
