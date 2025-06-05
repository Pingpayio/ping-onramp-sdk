import {
  type BaseTokenInfo,
  type UnifiedTokenInfo,
  isBaseToken,
} from "near-intents-sdk";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useFlatTokenList(
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[],
) {
  const searchParams = useSearchParams();
  const flatListIsEnabled = !!searchParams["flatTokenList"];

  return useMemo(() => {
    if (flatListIsEnabled) {
      return tokenList
        .flatMap((token) =>
          isBaseToken(token) ? [token] : token.groupedTokens,
        )
        .map((token) => ({
          ...token,
          symbol: `${token.symbol} (${token.chainName})`,
        }));
    }
    return tokenList;
  }, [flatListIsEnabled, tokenList]);
}
