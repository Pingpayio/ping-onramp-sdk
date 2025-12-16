import { PingpayOnramp, type PingpayOnrampConfig } from "@pingpay/onramp-sdk";

const openOnrampButton = document.getElementById("openOnrampButton");

if (openOnrampButton) {
  openOnrampButton.addEventListener("click", () => {
    try {
      const targetAssetDetails = { chain: "NEAR", asset: "wNEAR" };
      const onrampOptions: PingpayOnrampConfig = {
        // Example appFees: 100 basis points = 1%
        appFees: [
          {
            //replace with your actual fee recipient address
            recipient: "fees.pingpayio.near",
            fee: 100, // 100 basis points = 1%
          },
        ],
        onPopupReady: () => console.log("Example: Popup is ready"),
        onPopupClose: () => console.log("Example: Popup was closed"),
      };

      if (import.meta.env.POPUP_URL) {
        // override for local development
        onrampOptions.popupUrl = import.meta.env.POPUP_URL;
      }

      // Region popup is now hardcoded to show - will be replaced with API integration

      const onramp = new PingpayOnramp(onrampOptions);
      onramp.initiateOnramp(targetAssetDetails);
    } catch (error) {
      console.error("Error initializing or opening PingPay Onramp:", error);
      const errorElement = document.getElementById("errorMessage");
      if (errorElement && error instanceof Error) {
        errorElement.textContent = `Failed to open PingPay Onramp: ${error.message}. Check console.`;
      } else if (errorElement) {
        errorElement.textContent =
          "Failed to open PingPay Onramp. Check console for details.";
      }
    }
  });
} else {
  console.error("Could not find the #openOnrampButton element.");
}

const appElement = document.getElementById("app");
if (appElement) {
  const errorMessageElement = document.createElement("p");
  errorMessageElement.id = "errorMessage";
  errorMessageElement.style.color = "red";
  appElement.appendChild(errorMessageElement);
}
