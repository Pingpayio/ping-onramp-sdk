
import { stablecoins, stablecoinSymbols } from './stablecoins';
import { majorCoins } from './majorCoins';
import { defiTokens } from './defiTokens';
import { layer1Tokens } from './layer1Tokens';
import { memesAndNftTokens } from './memesAndNftTokens';
import { nearEcosystem } from './nearEcosystem';

// Combine all assets into a single array
export const assets = [
  ...stablecoins,
  ...majorCoins,
  ...layer1Tokens,
  ...defiTokens,
  ...memesAndNftTokens,
  ...nearEcosystem,
];

// Export each category separately for use elsewhere if needed
export {
  stablecoins,
  stablecoinSymbols,
  majorCoins,
  defiTokens,
  layer1Tokens,
  memesAndNftTokens,
  nearEcosystem,
};

// Asset type definition for better type safety
export interface CryptoAsset {
  name: string;
  symbol: string;
  logoUrl: string;
}
