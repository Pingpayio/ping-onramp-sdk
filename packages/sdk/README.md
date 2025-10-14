# Onramp SDK

The Onramp SDK provides the core functionality for integrating the Pingpay Onramp into any web application. It exposes the `PingpayOnramp` class, which manages the entire onramp flow.

## Core Concepts

- **`PingpayOnramp` Class**: The main entry point for the SDK. It handles the creation and management of the onramp popup.
- **`initiateOnramp` Method**: This method starts the onramp process, opening a popup window and returning a promise that resolves with the onramp result.
- **Lifecycle Events**: The SDK provides a set of optional callbacks (e.g., `onPopupReady`, `onProcessComplete`, `onProcessFailed`) that allow developers to hook into the onramp lifecycle and respond to events.
- **Communication**: The SDK uses the `post-me` library to establish a secure communication channel with the popup window, allowing for the exchange of messages and data.

## Interaction

The SDK is responsible for:
1.  Opening the popup window with the specified URL.
2.  Establishing a secure handshake with the popup using `post-me`.
3.  Sending the initial onramp configuration to the popup.
4.  Listening for messages from the popup regarding the onramp status and progress.
5.  Resolving or rejecting the promise returned by `initiateOnramp` based on the final result from the popup.
