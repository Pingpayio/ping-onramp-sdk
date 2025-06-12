import type { OnrampConfigResponseData } from '@coinbase/onchainkit/fund';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
  coinbaseConfigLoadingAtom,
  coinbaseOnrampConfigAtom,
  optimalCoinbaseOptionAtom,
  userLocationAtom,
} from '../state/atoms';
import type { UserLocation } from '../utils/onrampConfigUtils';
import {
  determineCoinbaseNetworkAndAsset,
  getCoinbaseOnrampConfig,
  getUserGeolocation,
} from '../utils/onrampConfigUtils';

interface UseCoinbaseConfigProps {
  selectedAsset: string; // The asset the user intends to buy (e.g., "USDC")
}

export const useCoinbaseConfig = ({ selectedAsset }: UseCoinbaseConfigProps) => {
  const [userLocation, setUserLocation] = useAtom(userLocationAtom);
  const [coinbaseConfig, setCoinbaseConfig] = useAtom(coinbaseOnrampConfigAtom);
  const [optimalCoinbaseOption, setOptimalCoinbaseOption] = useAtom(optimalCoinbaseOptionAtom);
  const [isInitialConfigLoading, setIsInitialConfigLoading] = useAtom(coinbaseConfigLoadingAtom);

  // Effect to fetch geolocation and Coinbase config on mount or if not already loaded
  useEffect(() => {
    const loadInitialConfigs = async () => {
      // Prevent re-fetching if already loaded and not in an error state from a previous attempt
      if (userLocation && coinbaseConfig && !userLocation.error && !isInitialConfigLoading) {
        // If already loaded, try to determine option if selectedAsset is available
        if (selectedAsset && userLocation && coinbaseConfig) {
          const option = determineCoinbaseNetworkAndAsset(
            userLocation,
            coinbaseConfig,
            selectedAsset
          );
          setOptimalCoinbaseOption(option);
        }
        return;
      }
      // Avoid fetching if already loading
      if (isInitialConfigLoading && !userLocation && !coinbaseConfig) return;


      setIsInitialConfigLoading(true);
      let currentLocation: UserLocation | null = userLocation;
      let currentConfig: OnrampConfigResponseData | null = coinbaseConfig;

      try {
        if (!currentLocation || currentLocation.error) {
          currentLocation = await getUserGeolocation();
          setUserLocation(currentLocation);
        }

        if (!currentConfig && (!currentLocation || !currentLocation.error)) { // Only fetch config if location is good
          currentConfig = await getCoinbaseOnrampConfig();
          setCoinbaseConfig(currentConfig);
        }

        if (currentLocation && !currentLocation.error && currentConfig && selectedAsset) {
          const option = determineCoinbaseNetworkAndAsset(
            currentLocation,
            currentConfig,
            selectedAsset
          );
          setOptimalCoinbaseOption(option);
        } else if (currentLocation?.error) {
          setOptimalCoinbaseOption(null); // Clear option if location error
        }
      } catch (error) {
        console.error("Error loading initial onramp configurations in hook:", error);
        setOptimalCoinbaseOption(null); // Clear option on error
      } finally {
        setIsInitialConfigLoading(false);
      }
    };

    loadInitialConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedAsset]); // Re-run if selectedAsset changes, to re-evaluate optimal option. Initial load handled by internal checks.

  // This effect specifically re-evaluates the optimal option when selectedAsset, userLocation, or coinbaseConfig changes.
  // It's distinct from the initial loading effect.
  useEffect(() => {
    if (userLocation && !userLocation.error && coinbaseConfig && selectedAsset) {
      const option = determineCoinbaseNetworkAndAsset(
        userLocation,
        coinbaseConfig,
        selectedAsset
      );
      setOptimalCoinbaseOption(option);
    } else if (userLocation?.error) {
      setOptimalCoinbaseOption(null); // Clear if there's a location error
    }
  }, [userLocation, coinbaseConfig, selectedAsset, setOptimalCoinbaseOption]);


  return {
    optimalCoinbaseOption,
    isInitialConfigLoading,
    userLocation,
    coinbaseConfig,
  };
};
