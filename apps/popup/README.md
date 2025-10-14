# Onramp Popup

This directory contains the React application that runs inside the popup window. It provides the user interface for the onramp process and communicates with the parent window (the application that opened it) via the Onramp SDK.

## Core Concepts

- **React Application**: A modern, component-based UI built with React and TypeScript.
- **Routing**: Uses TanStack Router to manage navigation between different steps of the onramp flow (e.g., form entry, processing).
- **State Management**: Leverages Jotai for global state management, handling data such as the onramp target and transaction results.
- **Data Fetching**: Utilizes TanStack Query to fetch data from the backend API, such as onramp configuration and quotes.
- **Communication**: Implements the client-side of the `post-me` communication channel, allowing it to send messages and report its status to the SDK.

## Interaction

The popup application is responsible for:
1.  Establishing a secure handshake with the SDK upon loading.
2.  Receiving the initial onramp configuration from the SDK.
3.  Guiding the user through the onramp process to submit the onramp form.
4.  Communicating with the backend API to fetch quotes and initiate the onramp transaction.
5.  Sending status updates and the final result back to the SDK.
