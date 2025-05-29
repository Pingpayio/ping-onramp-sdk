import { jsonRPCRequest, type JSONRPCRequest, type RequestConfig } from "./rpc"

export type SupportedChainName =
  | "eth"
  | "near"
  | "base"
  | "arbitrum"
  | "bitcoin"
  | "solana"
  | "dogecoin"
  | "turbochain"
  | "tuxappchain"
  | "vertex"
  | "optima"
  | "coineasy"
  | "aurora"
  | "xrpledger"
  | "zcash"
  | "gnosis"
  | "berachain"
  | "tron"
  | "polygon"
  | "bsc"

export type IntentsUserId = string & { __brand: "IntentsUserId" }
/**
 * Values are PoA Bridge specific
 */
enum BlockchainEnum {
  // todo: remove NEAR because it's not supported by the bridge
  NEAR = "near:mainnet",
  ETHEREUM = "eth:1",
  BASE = "eth:8453",
  ARBITRUM = "eth:42161",
  BITCOIN = "btc:mainnet",
  SOLANA = "sol:mainnet",
  DOGECOIN = "doge:mainnet",
  XRPLEDGER = "xrp:mainnet",
  ZCASH = "zec:mainnet",
  GNOSIS = "eth:100",
  BERACHAIN = "eth:80094",
  TRON = "tron:mainnet",
  POLYGON = "eth:137",
  BSC = "eth:56",
  // todo: remove BELOW because they're not supported by the bridge
  TURBOCHAIN = "eth:1313161567",
  TUXAPPCHAIN = "eth:1313161573",
  VERTEX = "eth:1313161587",
  OPTIMA = "eth:1313161569",
  COINEASY = "eth:1313161752",
  AURORA = "eth:1313161554",
}


export const assetNetworkAdapter: Record<SupportedChainName, BlockchainEnum> = {
  near: BlockchainEnum.NEAR,
  eth: BlockchainEnum.ETHEREUM,
  base: BlockchainEnum.BASE,
  arbitrum: BlockchainEnum.ARBITRUM,
  bitcoin: BlockchainEnum.BITCOIN,
  solana: BlockchainEnum.SOLANA,
  dogecoin: BlockchainEnum.DOGECOIN,
  turbochain: BlockchainEnum.TURBOCHAIN,
  aurora: BlockchainEnum.AURORA,
  xrpledger: BlockchainEnum.XRPLEDGER,
  zcash: BlockchainEnum.ZCASH,
  gnosis: BlockchainEnum.GNOSIS,
  berachain: BlockchainEnum.BERACHAIN,
  tron: BlockchainEnum.TRON,
  tuxappchain: BlockchainEnum.TUXAPPCHAIN,
  vertex: BlockchainEnum.VERTEX,
  optima: BlockchainEnum.OPTIMA,
  coineasy: BlockchainEnum.COINEASY,
  polygon: BlockchainEnum.POLYGON,
  bsc: BlockchainEnum.BSC,
}

export const reverseAssetNetworkAdapter: Record<
  BlockchainEnum,
  SupportedChainName
> = {
  [BlockchainEnum.NEAR]: "near",
  [BlockchainEnum.ETHEREUM]: "eth",
  [BlockchainEnum.BASE]: "base",
  [BlockchainEnum.ARBITRUM]: "arbitrum",
  [BlockchainEnum.BITCOIN]: "bitcoin",
  [BlockchainEnum.SOLANA]: "solana",
  [BlockchainEnum.DOGECOIN]: "dogecoin",
  [BlockchainEnum.TURBOCHAIN]: "turbochain",
  [BlockchainEnum.AURORA]: "aurora",
  [BlockchainEnum.XRPLEDGER]: "xrpledger",
  [BlockchainEnum.ZCASH]: "zcash",
  [BlockchainEnum.GNOSIS]: "gnosis",
  [BlockchainEnum.BERACHAIN]: "berachain",
  [BlockchainEnum.TRON]: "tron",
  [BlockchainEnum.TUXAPPCHAIN]: "tuxappchain",
  [BlockchainEnum.VERTEX]: "vertex",
  [BlockchainEnum.OPTIMA]: "optima",
  [BlockchainEnum.COINEASY]: "coineasy",
  [BlockchainEnum.POLYGON]: "polygon",
  [BlockchainEnum.BSC]: "bsc",
}

export type JSONRPCResponse<Result> = {
  id: string
  jsonrpc: "2.0"
  result: Result
}

export type GetSupportedTokensRequest = JSONRPCRequest<
  "supported_tokens",
  {
    chains?: string[]
  }
>

export type GetSupportedTokensResponse = JSONRPCResponse<{
  tokens: {
    defuse_asset_identifier: string
    decimals: number
    asset_name: string
    near_token_id: string
    min_deposit_amount: string
    min_withdrawal_amount: string
    withdrawal_fee: string
  }[]
}>

export type GetDepositAddressRequest = JSONRPCRequest<
  "deposit_address",
  {
    account_id: string
    /** Chain is joined blockchain and network (e.g. eth:8453) */
    chain: string
  }
>

export type GetDepositAddressResponse = JSONRPCResponse<{
  address: string
  chain: string
}>

/**
 * Generates a NEAR Intents deposit address for a given EVM user.
 * @param evmAddress The user's EVM address.
 * @param chainName The supported chain name for which to generate the address (e.g., "base").
 * @returns A promise that resolves to the NEAR Intents deposit address string (e.g., "0xaddress.base").
 * @throws If the chain is unsupported or generation fails.
 */
export async function generateNearIntentsDepositAddress(
  evmAddress: string,
  chainName: SupportedChainName = "base"
): Promise<{ address: string, network: string }> {
  const chain = assetNetworkAdapter[chainName];
  if (!chain) {
    const errorMessage = `Unsupported chain for deposit address generation: ${chainName}`;
    console.error(errorMessage);
    // It's generally better to throw an error that can be caught and handled by the caller
    throw new Error(`Internal config error: Unsupported EVM chain for intents: ${chainName}.`);
  }
  // Ensure evmAddress is lowercase as IntentsUserId expects it.
  const intentsUserId = evmAddress.toLowerCase() as IntentsUserId;

  try {
    const depositAddr = await generateDepositAddress(intentsUserId, chain);
    return { address: depositAddr, network: chain };
  } catch (error) {
    console.error("Failed to generate NEAR Intents deposit address in SDK:", error);
    // Re-throw or throw a custom error to be handled by the caller
    throw new Error(error instanceof Error ? error.message : "Failed to generate deposit address via SDK.");
  }
}

/**
 * Generate a deposit address for the specified blockchain and asset through the POA bridge API call.
 *
 * @param userAddress - The user address from the wallet
 * @param chain - The blockchain for which to generate the address
 * @returns A Promise that resolves to the generated deposit address
 */
export async function generateDepositAddress(
  userAddress: IntentsUserId,
  chain: BlockchainEnum
): Promise<string> {
  try {
    const supportedTokens = await getSupportedTokens({
      chains: [chain],
    })

    if (supportedTokens.tokens.length === 0) {
      throw new Error("No supported tokens found")
    }

    const generatedDepositAddress = await getDepositAddress({
      account_id: userAddress,
      chain,
    })

    return generatedDepositAddress.address
  } catch (error) {
    console.error(
      new Error("Error generating deposit address", { cause: error })
    )
    throw error
  }
}

export async function getSupportedTokens(
  params: GetSupportedTokensRequest["params"][0],
  config: RequestConfig = {}
): Promise<GetSupportedTokensResponse["result"]> {
  const result = await jsonRPCRequest<GetSupportedTokensRequest>(
    "supported_tokens",
    params,
    config
  )
  return result as GetSupportedTokensResponse["result"];
}

export async function getDepositAddress(
  params: GetDepositAddressRequest["params"][0],
  config: RequestConfig = {}
): Promise<GetDepositAddressResponse["result"]> {
  const result = await jsonRPCRequest<GetDepositAddressRequest>(
    "deposit_address",
    params,
    config
  )
  return result as GetDepositAddressResponse["result"]
}
