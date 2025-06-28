// import { PingpayOnramp } from "../../dist/index.js"; // don't commit this to main
import { PingpayOnramp } from "@pingpay/onramp-sdk";

const openOnrampButton = document.getElementById("openOnrampButton");

if (openOnrampButton) {
  openOnrampButton.addEventListener("click", () => {
    try {
      const targetAssetDetails = { chain: "NEAR", asset: "wNEAR" };
      const onramp = new PingpayOnramp({
        // popupUrl: "http://localhost:5173",
        onPopupReady: () => console.log("Example: Popup is ready"),
        onProcessComplete: (result) =>
          console.log("Example: Process complete", result),
        onProcessFailed: (errorInfo) =>
          console.error("Example: Process failed", errorInfo),
        onPopupClose: () => console.log("Example: Popup was closed"),
      });
      onramp.initiateOnramp(targetAssetDetails); // Call initiateOnramp with targetAsset
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

// Simple error display
const appElement = document.getElementById("app");
if (appElement) {
  const errorMessageElement = document.createElement("p");
  errorMessageElement.id = "errorMessage";
  errorMessageElement.style.color = "red";
  appElement.appendChild(errorMessageElement);
}
