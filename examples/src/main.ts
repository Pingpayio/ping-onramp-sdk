import { PingpayOnramp } from '../../dist/index.js';

const openOnrampButton = document.getElementById('openOnrampButton');

if (openOnrampButton) {
  openOnrampButton.addEventListener('click', () => {
    try {
      // Replace 'YOUR_API_KEY_HERE' with an actual API key if needed for testing.
      const targetAssetDetails = { chain: 'NEAR', asset: 'USDC' }; // Define target asset
      const onramp = new PingpayOnramp({
        popupUrl: 'http://localhost:5173/',
        // targetAsset can optionally be in config if it's a default,
        // but initiateOnramp will take the specific target for a flow.
        // For this example, we'll pass it directly to initiateOnramp.
        // Optional: Add event handlers here
        onPopupReady: () => console.log('Example: Popup is ready'),
        onProcessComplete: (result) => console.log('Example: Process complete', result),
        onProcessFailed: (errorInfo) => console.error('Example: Process failed', errorInfo),
        onPopupClose: () => console.log('Example: Popup was closed'),
      });
      onramp.initiateOnramp(targetAssetDetails); // Call initiateOnramp with targetAsset
    } catch (error) {
      console.error('Error initializing or opening PingPay Onramp:', error);
      const errorElement = document.getElementById('errorMessage');
      if (errorElement && error instanceof Error) {
        errorElement.textContent = `Failed to open PingPay Onramp: ${error.message}. Check console.`;
      } else if (errorElement) {
        errorElement.textContent = 'Failed to open PingPay Onramp. Check console for details.';
      }
    }
  });
} else {
  console.error('Could not find the #openOnrampButton element.');
}

// Simple error display
const appElement = document.getElementById('app');
if (appElement) {
    const errorMessageElement = document.createElement('p');
    errorMessageElement.id = 'errorMessage';
    errorMessageElement.style.color = 'red';
    appElement.appendChild(errorMessageElement);
}
