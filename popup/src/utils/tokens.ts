import type { BaseTokenInfo, UnifiedTokenInfo } from "near-intents-sdk";

// Minimal list of tokens required for the USDC onramp to NEAR flow.
// Ensure these symbols and chainNames match what near-intents-sdk expects
// and what your onramp provider (e.g., Coinbase) supports for deposits.

// IMPORTANT: The `defuseAssetId` should be correctly configured based on
// the actual IDs used by the Defuse/Intents SDK for these tokens.
// The values provided below are placeholders and might need adjustment.

const USDC_BASE: BaseTokenInfo = {
  defuseAssetId: "USDC.base", // Example: Check actual ID from SDK/Defuse
  symbol: "USDC",
  chainName: "base", // Assuming deposit is on Base network
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Official USDC on Base
  decimals: 6,
  name: "USD Coin on Base",
  icon: "", // Placeholder icon URL
  bridge: "base", // Or appropriate bridge identifier
};

const USDC_NEAR: BaseTokenInfo = {
  defuseAssetId: "USDC.near", // Example: Check actual ID
  symbol: "USDC",
  chainName: "near",
  address: "usdc.fakes.testnet", // Placeholder, use actual NEP-141 address
  decimals: 6,
  name: "USD Coin on NEAR",
  icon: "", // Placeholder icon URL
  bridge: "near", // Or appropriate bridge identifier
};

const NEAR_NEAR: BaseTokenInfo = {
  defuseAssetId: "NEAR.near", // Example: Check actual ID
  symbol: "NEAR",
  chainName: "near",
  address: "wrap.near", // Or system for native NEAR
  decimals: 24,
  name: "NEAR Protocol",
  icon: "", // Placeholder icon URL
  bridge: "near", // Or appropriate bridge identifier
};

// This list will be used by the processNearIntentWithdrawal function.
// It can be expanded as needed.
export const LIST_TOKENS: (BaseTokenInfo | UnifiedTokenInfo)[] = [
  USDC_BASE,
  USDC_NEAR,
  NEAR_NEAR,
  // Example of a UnifiedTokenInfo if you had multiple representations of USDC
  // {
  //   defuseAssetId: "USDC", // Unified ID
  //   symbol: "USDC",
  //   groupedTokens: [USDC_BASE, USDC_NEAR],
  //   decimals: 6, // Typically the most common decimal count
  //   logoUrl: "/cryptologos/usd-coin-usdc-logo.svg",
  //   name: "USD Coin (Unified)"
  // }
];

export const findTokenFromList = (
  symbol: string,
  chainName: string,
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]
): BaseTokenInfo | undefined => {
  for (const item of tokenList) {
    if ('chainName' in item && 'address' in item) { // Heuristic to check if it's BaseTokenInfo
      const baseToken = item as BaseTokenInfo;
      if (baseToken.symbol === symbol && baseToken.chainName === chainName) {
        return baseToken;
      }
    } else {
      // It's a UnifiedTokenInfo, check its groupedTokens
      const unifiedToken = item as UnifiedTokenInfo;
      const foundInGroup = unifiedToken.groupedTokens.find(
        (bt) => bt.symbol === symbol && bt.chainName === chainName
      );
      if (foundInGroup) {
        return foundInGroup;
      }
    }
  }
  return undefined;
};

// Helper function to fetch and validate required tokens for the onramp process
export const getOnrampTokens = (
  assetSymbol: string, // e.g., "USDC"
  depositChainName: string, // e.g., "base"
  targetChainName: string, // e.g., "near"
  storageTokenSymbol: string, // e.g., "NEAR"
  storageTokenChainName: string, // e.g., "near"
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]
): { tokenIn: BaseTokenInfo; tokenOut: BaseTokenInfo; nearStorageTokenDef: BaseTokenInfo } | null => {
  const tokenIn = findTokenFromList(assetSymbol, depositChainName, tokenList);
  const tokenOut = findTokenFromList(assetSymbol, targetChainName, tokenList);
  const nearStorageTokenDef = findTokenFromList(storageTokenSymbol, storageTokenChainName, tokenList);

  if (!tokenIn || !tokenOut || !nearStorageTokenDef) {
    console.error("SDK: Critical onramp tokens not found in token list.", {
      assetSymbol,
      depositChainName,
      targetChainName,
      foundTokenIn: !!tokenIn,
      foundTokenOut: !!tokenOut,
      foundNearStorageToken: !!nearStorageTokenDef,
    });
    return null;
  }
  return { tokenIn, tokenOut, nearStorageTokenDef };
};
