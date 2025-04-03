
export const stablecoins = [
  {
    name: "Tether USD",
    symbol: "USDT",
    logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029",
  },
  {
    name: "DAI",
    symbol: "DAI",
    logoUrl: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=029",
  },
  {
    name: "Frax",
    symbol: "FRAX",
    logoUrl: "https://cryptologos.cc/logos/frax-frax-logo.svg?v=029",
  },
  {
    name: "Wrapped USDC",
    symbol: "USDC.e",
    logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029",
  },
  {
    name: "USDR",
    symbol: "USDR",
    logoUrl: "https://www.tangible.store/assets/images/USDR-d90b34ec.svg",
  },
];

// Export the symbol list for easy checking if a coin is a stablecoin
export const stablecoinSymbols = stablecoins.map(coin => coin.symbol);
