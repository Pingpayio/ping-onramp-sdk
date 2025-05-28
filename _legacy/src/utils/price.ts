// Utility functions for fetching cryptocurrency prices

// Cache prices to avoid excessive API calls
let priceCache: Record<string, number> = {};
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Fetch current prices for common cryptocurrencies
 * @returns A promise that resolves to a record of cryptocurrency symbols and their USD prices
 */
export async function fetchCryptoPrices(): Promise<Record<string, number>> {
  const now = Date.now();

  // Return cached prices if they're still fresh
  if (Object.keys(priceCache).length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return priceCache;
  }

  try {
    // Using CoinGecko API (free, no API key required for basic usage)
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin,solana,polygon,avalanche-2,chainlink,uniswap,dogecoin,shiba-inu,ripple,litecoin,bitcoin-cash&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Map CoinGecko IDs to our token symbols
    const idToSymbol: Record<string, string> = {
      "bitcoin": "BTC",
      "ethereum": "ETH",
      "usd-coin": "USDC",
      "solana": "SOL",
      "polygon": "MATIC",
      "avalanche-2": "AVAX",
      "chainlink": "LINK",
      "uniswap": "UNI",
      "dogecoin": "DOGE",
      "shiba-inu": "SHIB",
      "ripple": "XRP",
      "litecoin": "LTC",
      "bitcoin-cash": "BCH"
    };

    // Create a new price cache
    const newPriceCache: Record<string, number> = {};

    // Convert the response to our format
    for (const [id, priceData] of Object.entries(data)) {
      const symbol = idToSymbol[id];
      if (symbol && priceData && typeof priceData === 'object' && 'usd' in priceData && typeof priceData.usd === 'number') {
        newPriceCache[symbol] = priceData.usd;
      }
    }

    // Add fallback prices for any missing tokens
    const fallbackPrices: Record<string, number> = {
      "BTC": 67000,
      "ETH": 3500,
      "USDC": 1,
      "SOL": 140,
      "MATIC": 0.8,
      "AVAX": 35,
      "LINK": 15,
      "UNI": 8,
      "DOGE": 0.1,
      "SHIB": 0.00002,
      "XRP": 0.5,
      "LTC": 80,
      "BCH": 300
    };

    // Use fallback prices for any tokens not returned by the API
    for (const [symbol, price] of Object.entries(fallbackPrices)) {
      if (!newPriceCache[symbol]) {
        newPriceCache[symbol] = price;
      }
    }

    // Update the cache
    priceCache = newPriceCache;
    lastFetchTime = now;

    return priceCache;
  } catch (error) {
    console.error("Error fetching cryptocurrency prices:", error);

    // If API call fails, return fallback prices
    return {
      "BTC": 67000,
      "ETH": 3500,
      "USDC": 1,
      "SOL": 140,
      "MATIC": 0.8,
      "AVAX": 35,
      "LINK": 15,
      "UNI": 8,
      "DOGE": 0.1,
      "SHIB": 0.00002,
      "XRP": 0.5,
      "LTC": 80,
      "BCH": 300
    };
  }
}

/**
 * Get the current price for a specific cryptocurrency
 * @param symbol The cryptocurrency symbol (e.g., "BTC")
 * @returns A promise that resolves to the current price in USD
 */
export async function getCryptoPrice(symbol: string): Promise<number> {
  const prices = await fetchCryptoPrices();
  return prices[symbol] || 0;
}