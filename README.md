<div align="center">

![Banner](https://pingpay.gitbook.io/docs/~gitbook/image?url=https%3A%2F%2F2412975227-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F4y2jIy2xuLBz44dN9ue8%252Fuploads%252FSQyN4aaPibfbicyP1LXZ%252FThe%2520Payment%2520Layer%2520for%2520the%2520Future%2520of%2520Commerce%2520%283%29.png%3Falt%3Dmedia%26token%3D4252f999-18ef-4435-8fca-517d0f4657ad&width=768&dpr=2&quality=100&sign=6277647b&sv=2)

[website](https://pingpay.io) | [docs](https://docs.pingpay.io) | [@pingpay_io](https://x.com/pingpay_io)

</div>

## Partner Onboarding & Requests

Use the following forms to get started or request support:

* [**Pingpay Partner Interest Form**](https://pingpay.notion.site/2c67fbe37dcb816091aec9fdc3af6919?pvs=105)
* [**Request New Chain / Asset Support Form**](https://pingpay.notion.site/2b67fbe37dcb8111895dd72e8ade634d)
* [**Additional Onramp Provider Onboarding Form**](https://pingpay.notion.site/2b67fbe37dcb81ed93c5f1474b141768)

## Usage

### Installation

```bash
npm install @pingpay/onramp-sdk
```

### Basic Usage

```typescript
import type { TargetAsset, OnrampResult, PingpayOnrampError } from "@pingpay/onramp-sdk";
import { PingpayOnramp } from "@pingpay/onramp-sdk";

const onramp = new PingpayOnramp();

const targetAsset: TargetAsset = {
  chain: "NEAR",
  asset: "wNEAR",
};

async function handleOnramp() {
  try {
    const result: OnrampResult = await onramp.initiateOnramp(targetAsset);
    console.log("Onramp successful:", result);
  } catch (error) {
    if (error instanceof PingpayOnrampError) {
      console.error("Onramp failed:", error.message);
    } else {
      console.error("Onramp failed:", error);
    }
  }
}

const button = document.getElementById("onrampButton");
if (button) {
  button.addEventListener("click", handleOnramp);
}
```

```html
<button id="onrampButton">Buy Crypto</button>
```

### Advanced Usage

The SDK provides configuration options and callbacks to customize the onramp experience.

```typescript
import type { PingpayOnrampConfig, OneClickFee } from "@pingpay/onramp-sdk";
import { PingpayOnramp } from "@pingpay/onramp-sdk";

// Configure app fees (example: 1% fee)
const appFees: OneClickFee[] = [
  {
    recipient: "YOUR_FEE_RECIPIENT.near",
    fee: 100, // 100 basis points = 1%
  },
];

const config: PingpayOnrampConfig = {
  targetAsset: { chain: "NEAR", asset: "wNEAR" },
  appFees,
  onPopupReady: () => {
    console.log("SDK: Popup is ready.");
  },
  onPopupClose: () => {
    console.log("SDK: Popup was closed.");
  },
};

const onramp = new PingpayOnramp(config);

async function handleOnramp() {
  try {
    const result = await onramp.initiateOnramp();
    console.log("Onramp successful:", result);
  } catch (error) {
    if (error instanceof PingpayOnrampError) {
      console.error("Onramp failed:", error.message);
    } else {
      console.error("Onramp failed:", error);
    }
  }
}
```

### Configuration

The `PingpayOnrampConfig` interface supports the following options:

- `targetAsset?: TargetAsset` - The target asset and chain for the onramp process. If not provided, users can select from available options in the popup.
- `appFees?: OneClickFee[]` - Application fees to be applied to the onramp process.
- `popupUrl?: string` - URL to render in popup (useful for development and testing).
- `onPopupReady?: () => void` - Optional callback invoked when the popup window signals it's ready.
- `onPopupClose?: () => void` - Optional callback invoked when the popup window is closed, either by the user or programmatically.

### App Fees

Configure application fees using the `OneClickFee[]` array:

```typescript
type OneClickFee = {
  recipient: string;  // Fee recipient address
  fee: number;        // Fee in basis points (100 = 1%)
};
```

### Error Handling

The SDK provides a dedicated `PingpayOnrampError` class for error handling:

```typescript
try {
  const result = await onramp.initiateOnramp(targetAsset);
  // Handle success
} catch (error) {
  if (error instanceof PingpayOnrampError) {
    console.error("Onramp failed:", error.message);
    // Access additional error details if needed
    // error.details
    // error.step
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Closing the Onramp

You can programmatically close the onramp popup and clean up resources by calling the `close()` method:

```typescript
onramp.close();
```

This is useful if your application needs to interrupt the onramp flow.
The `onPopupClose` callback will also be triggered.

### Type Definitions

#### `TargetAsset`
```typescript
type TargetAsset = {
  chain: string;   // Target blockchain (e.g., "NEAR")
  asset: string;   // Asset symbol (e.g., "wNEAR", "USDC")
};
```

#### `OnrampResult`
```typescript
type OnrampResult = {
  type: "intents";
  action: "withdraw";
  depositAddress: string;
  network: string;
  asset: string;
  amount: string;
  recipient: string;
};
```

#### `PingpayOnrampError`
```typescript
class PingpayOnrampError extends Error {
  message: string;
  details?: unknown;
  step?: string;
}
```

## Development

To install dependencies:

```bash
bun install
```

To run all dev servers:

```bash
bun run dev
```

This uses Turborepo to orchestrate development servers across the monorepo:

- Watches for changes to the SDK ([packages/sdk](./packages/sdk))
- Starts the popup dev server ([apps/popup](./apps/popup))
- Runs the API dev server ([apps/api](./apps/api))
- Runs example apps ([examples/](./examples/))

**Dev Server URLs:**

- `http://localhost:3000` - Example app (demo)
- `http://localhost:3001` - Example app (sui)
- `https://pingpay.local.gd:5173` - Popup app
- `http://localhost:8787` - API server

**Note:** The demo apps can be accessed via `localhost`, but the popup must run on `https://pingpay.local.gd:5173` for Coinbase redirects to work. Always access the popup through the example apps, not directly.

To build all packages:

```bash
bun run build
```

To run all tests:

```bash
bun run test
```
