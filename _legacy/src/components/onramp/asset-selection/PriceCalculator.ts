// Mock prices for demonstration purposes - in a real app, these would come from an API
const mockPrices: Record<string, number> = {
  USDT: 1,
  USDC: 1,
  DAI: 1,
  BTC: 65000,
  ETH: 3500,
  NEAR: 2.51, // Updated NEAR price from 8.12 to 2.51
  SOL: 145,
  AVAX: 35,
  DOT: 8.5,
  MATIC: 0.75,
  // Add more tokens as needed
};

export function calculateEstimatedAmount(
  selectedAsset: string | null,
  amount: string,
): string {
  if (selectedAsset && amount && !isNaN(parseFloat(amount))) {
    const assetPrice = mockPrices[selectedAsset] || 1;
    const estimatedTokens = parseFloat(amount) / assetPrice;

    // Format based on value - show more decimal places for higher value tokens
    if (assetPrice >= 1000) {
      return estimatedTokens.toFixed(5);
    } else if (assetPrice >= 100) {
      return estimatedTokens.toFixed(4);
    } else {
      return estimatedTokens.toFixed(2);
    }
  }
  return "0";
}

export { mockPrices };
