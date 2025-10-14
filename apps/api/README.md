# Pingpay Onramp API

This directory contains the backend service for the Pingpay Onramp SDK, built as a serverless application on Cloudflare Workers using the [Hono](https://hono.dev/) web framework.

## Overview

The Onramp API serves as a crucial middleware component in the Pingpay ecosystem. It functions as a facade, abstracting the complexities of interacting with various third-party financial services and providing a simple, unified interface for the onramp popup application.

Its primary responsibilities include:
-   Fetching cryptocurrency exchange rates and quotes.
-   Initiating onramp transactions.
-   Aggregating data from multiple providers to find the best options for the user.

## Core Technologies

-   **Cloudflare Workers**: The API is deployed as a serverless function on Cloudflare's edge network, ensuring low latency and high availability.
-   **Hono**: A small, simple, and ultrafast web framework for the edge. It provides the routing and request handling logic for the API.
-   **TypeScript**: The entire codebase is written in TypeScript, ensuring type safety and improved developer experience.

## Architecture

The API is designed to be a stateless and scalable service. It exposes a set of RESTful endpoints that the onramp popup consumes.

1.  **Popup Interaction**: The `@pingpay/onramp-popup` application makes requests to this API to get configuration, fetch quotes, and initiate transactions.
2.  **Third-Party Integration**: The API integrates with external services like [Coinbase](https://www.coinbase.com/) and [1Click](https://1click.fi/) to handle the underlying onramp and swap operations. It contains the necessary logic to communicate with their respective APIs, handle authentication, and normalize the data.
3.  **Aggregation**: A key feature of this API is its ability to aggregate results from multiple onramp providers. It fetches quotes from each registered provider and presents the best option to the user via the popup, abstracting the provider-specific details.

## Key Endpoints

-   `/config`: Provides the initial configuration to the popup, including supported tokens and payment methods.
-   `/quote`: Fetches real-time quotes for a given transaction amount and currency pair.
-   `/init`: Initiates the onramp process with the selected provider.

## Getting Started

To run this service locally, you can use the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/), the command-line tool for building Cloudflare Workers.

1.  Install dependencies:
    ```bash
    bun install
    ```
2.  Run the development server:
    ```bash
    bun run dev
