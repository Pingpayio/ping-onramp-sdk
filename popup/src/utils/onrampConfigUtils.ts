import { fetchOnrampConfig, type OnrampConfigResponseData, type OnrampPaymentMethod as SDKOnrampPaymentMethod } from '@coinbase/onchainkit/fund';

// Local interface for country structure, using the SDK's PaymentMethod type
interface LocalOnrampCountry {
  id: string;
  subdivisions: string[] | null;
  paymentMethods: SDKOnrampPaymentMethod[];
  // Add other properties if they exist on the country objects within OnrampConfigResponseData
}

export interface UserLocation {
  countryCode: string | null;
  subdivision: string | null;
  error?: string;
}

export interface CoinbaseOptimalOption {
  network: string;
  asset: string;
  paymentMethodId?: string; // Optional, as it might be derived or not always needed directly
  currency?: string;      // Optional, similar to paymentMethodId
}

/**
 * Fetches the user's approximate geolocation (country/subdivision) based on IP address.
 */
export const getUserGeolocation = async (): Promise<UserLocation> => {
  try {
    // Note: Using 'http' as 'https' for ip-api.com might require a paid plan for some features/reliability.
    // For development, 'http' is often sufficient for their free tier.
    const response = await fetch('http://ip-api.com/json/?fields=status,message,countryCode,region');
    if (!response.ok) {
      throw new Error(`IP Geolocation API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === 'success') {
      return {
        countryCode: data.countryCode || null,
        subdivision: data.region || null,
      };
    } else {
      throw new Error(`IP Geolocation API returned status: ${data.status}, message: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("Could not get user IP geolocation:", errorMessage);
    return { countryCode: null, subdivision: null, error: errorMessage };
  }
};

/**
 * Fetches the Coinbase onramp configuration.
 */
export const getCoinbaseOnrampConfig = async (): Promise<OnrampConfigResponseData | null> => {
  try {
    const config = await fetchOnrampConfig();
    console.log("Coinbase Onramp Config fetched:", config);
    return config;
  } catch (error) {
    console.error("Failed to fetch Coinbase onramp config:", error);
    return null;
  }
};

/**
 * Determines the best Coinbase network and asset based on user location and onramp config.
 * This function currently serves as a placeholder for more complex decision logic.
 */
export const determineCoinbaseNetworkAndAsset = (
  userLocation: UserLocation,
  config: OnrampConfigResponseData | null,
  preferredAsset: string // e.g., "USDC" - the asset user wants to buy
): CoinbaseOptimalOption | null => {
  console.log("Attempting to determine Coinbase network/asset with Location:", userLocation, "Config:", config ? "Available" : "Not Available", "Preferred Asset:", preferredAsset);

  if (userLocation.error || !config || !config.countries || config.countries.length === 0) {
    console.warn("Cannot determine optimal option due to location error, missing config, or empty countries list.");
    return null;
  }

  // Use the local interface for type hinting during iteration
  const targetCountry = config.countries.find((c: LocalOnrampCountry) => c.id === userLocation.countryCode);

  if (!targetCountry) {
    console.log(`User country ${userLocation.countryCode} not found in Coinbase config.`);
    return null;
  }

  const isSubdivisionAllowed = !targetCountry.subdivisions || targetCountry.subdivisions.length === 0 || (userLocation.subdivision && targetCountry.subdivisions.includes(userLocation.subdivision));

  if (!isSubdivisionAllowed) {
    console.log(`User subdivision ${userLocation.subdivision} not allowed in country ${userLocation.countryCode}.`);
    return null;
  }

  // Placeholder logic:
  // This needs to be refined based on how assets and networks are structured within paymentMethods.
  // For now, assume if the country and subdivision (if applicable) are valid,
  // we can use a default network (e.g., "base") and the user's preferred asset.
  // A real implementation would iterate paymentMethods, check supported currencies, and find asset/network pairs.
  // The current OnrampConfig example doesn't clearly show where the on-chain network (like "base") is specified.

  // Example: Find a card payment method.
  // The check for 'pm.currencies' has been removed as the SDKOnrampPaymentMethod type
  // does not seem to expose 'currencies' directly according to the TypeScript error.
  // This part of the logic will need to be revisited when the actual structure for
  // determining currency support per payment method is clear from the SDK.
  const cardPaymentMethod = targetCountry.paymentMethods.find((pm: SDKOnrampPaymentMethod) => 
    pm.id === "CARD"
    // Cannot check pm.currencies here due to type error.
    // && pm.currencies && pm.currencies.includes("USD") 
  );

  if (cardPaymentMethod) {
    // Assuming 'preferredAsset' (e.g., USDC) is generally available on a common network like 'base'
    // This assumption is stronger now without the currency check.
    // if card payments in USD are possible in this region.
    // This is a significant assumption and needs validation against the actual config structure.
    return {
      network: "base", // Placeholder: This needs to be confirmed or derived from config
      asset: preferredAsset, // Assuming preferred asset is usable
      paymentMethodId: "CARD",
      currency: "USD"
    };
  }

  console.log(`No suitable payment method (e.g., CARD with USD) found for ${userLocation.countryCode}.`);
  return null;
};
