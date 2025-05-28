import type { BaseTokenInfo, UnifiedTokenInfo } from "near-intents-sdk";

import { useFlatTokenList } from "./use-flat-token-list";
import { useSearchParams } from "react-router-dom";

export function useTokenList(tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]) {
  let list = useFlatTokenList(tokenList);
  const searchParams = useSearchParams();

  list = sortTokensByMarketCap(list);

  if (searchParams["fms"]) {
    list = [
      ...list,
      {
        defuseAssetId:
          "nep141:base-0xa5c67d8d37b88c2d88647814da5578128e2c93b2.omft.near",
        address: "0xa5c67d8d37b88c2d88647814da5578128e2c93b2",
        decimals: 18,
        icon: "/static/icons/icon-fms.svg",
        chainName: "base",
        bridge: "poa",
        symbol: "FMS",
        name: "FOMO SOLVER",
      },
      {
        defuseAssetId:
          "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/3408.png",
        chainName: "eth",
        bridge: "poa",
        symbol: "USDC",
        name: "USD Coin",
      },
    ];
  }

  return list;
}

function compareTokens(
  a: BaseTokenInfo | UnifiedTokenInfo,
  b: BaseTokenInfo | UnifiedTokenInfo
): number {
  const aTags = (a as { tags?: string[] }).tags || [];
  const bTags = (b as { tags?: string[] }).tags || [];

  const aIsStable = aTags.some((tag) => tag === "type:stablecoin");
  const bIsStable = bTags.some((tag) => tag === "type:stablecoin");

  // Sort stablecoins first
  if (aIsStable && !bIsStable) return -1;
  if (!aIsStable && bIsStable) return 1;

  const aMarketCap = getMarketCapOrder(aTags);
  const bMarketCap = getMarketCapOrder(bTags);

  // Sort by market cap if both have it
  if (aMarketCap !== undefined && bMarketCap !== undefined) {
    return aMarketCap - bMarketCap;
  }

  // Put tokens with market cap before those without
  if (aMarketCap !== undefined) return -1;
  if (bMarketCap !== undefined) return 1;

  return 0;
}

function getMarketCapOrder(tags: string[]): number | undefined {
  const mcTag = tags.find((tag) => tag.startsWith("mc:"));
  if (!mcTag) return undefined;
  return Number.parseInt(mcTag.split(":")[1]);
}

function sortTokensByMarketCap(
  tokens: (BaseTokenInfo | UnifiedTokenInfo)[]
): (BaseTokenInfo | UnifiedTokenInfo)[] {
  return Array.from(tokens).sort(compareTokens);
}