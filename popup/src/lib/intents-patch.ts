import {
  createPublicClient,
  http,
  erc20Abi,
  getAddress,
  type Chain,
} from "viem";
import { base, mainnet, arbitrum, polygon } from "viem/chains";

// --- Helper to map chainName string to viem Chain object and RPC ---
interface ChainConfig {
  viemChain: Chain;
  rpcUrl: string;
}

// IMPORTANT: Configure this function with your actual RPC URLs and supported chains.
// Using environment variables for RPC URLs is highly recommended.
export function getChainConfig(chainName: string): ChainConfig {
  const lowerChainName = chainName.toLowerCase();
  switch (lowerChainName) {
    case "base":
      // Ensure process.env.BASE_RPC_URL is set in your environment
      if (!process.env.BASE_RPC_URL)
        throw new Error("BASE_RPC_URL environment variable not set.");
      return { viemChain: base, rpcUrl: process.env.BASE_RPC_URL };
    case "ethereum": // or 'eth'
      if (!process.env.ETHEREUM_RPC_URL)
        throw new Error("ETHEREUM_RPC_URL environment variable not set.");
      return { viemChain: mainnet, rpcUrl: process.env.ETHEREUM_RPC_URL };
    case "arbitrum":
      if (!process.env.ARBITRUM_RPC_URL)
        throw new Error("ARBITRUM_RPC_URL environment variable not set.");
      return { viemChain: arbitrum, rpcUrl: process.env.ARBITRUM_RPC_URL };
    case "polygon":
      if (!process.env.POLYGON_RPC_URL)
        throw new Error("POLYGON_RPC_URL environment variable not set.");
      return { viemChain: polygon, rpcUrl: process.env.POLYGON_RPC_URL };
    // Add other chains your application supports for deposits
    default:
      throw new Error(
        `Unsupported chain for balance check: ${chainName}. Please configure its RPC URL and viem chain object in getChainConfig.`,
      );
  }
}
// --- End Helper ---

export async function getCurrentTokenBalance(
  userAddress: string,
  tokenContractAddress: string,
  chainName: string,
): Promise<bigint> {
  try {
    const { viemChain, rpcUrl } = getChainConfig(chainName);
    const publicClient = createPublicClient({
      chain: viemChain,
      transport: http(rpcUrl),
    });

    const balance = await publicClient.readContract({
      address: getAddress(tokenContractAddress),
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [getAddress(userAddress)],
    });
    return balance;
  } catch (error) {
    console.error(
      `Error fetching balance for ${tokenContractAddress} on ${chainName} for ${userAddress}:`,
      error,
    );
    // Consider if you want to re-throw or handle differently for retries within pollForDepositConfirmation
    throw new Error(`Failed to fetch balance: ${(error as Error).message}`);
  }
}

export async function pollForDepositConfirmation(
  userAddress: string,
  tokenContractAddress: string,
  chainName: string,
  initialBalance: bigint,
  expectedMinimumIncrease: bigint,
  options?: {
    pollIntervalMs?: number;
    timeoutMs?: number;
    onPoll?: (currentBalance: bigint, attempts: number) => void;
  },
): Promise<bigint> {
  const pollInterval = options?.pollIntervalMs || 7000; // Increased default poll interval slightly
  const timeout = options?.timeoutMs || 10 * 60 * 1000; // Increased default timeout to 10 minutes
  const startTime = Date.now();
  let attempts = 0;

  console.log(
    `Polling for deposit: Addr=${userAddress}, Token=${tokenContractAddress}, Chain=${chainName}, InitialBalance=${initialBalance}, ExpectedIncrease=${expectedMinimumIncrease}`,
  );

  while (Date.now() - startTime < timeout) {
    attempts++;
    try {
      const currentBalance = await getCurrentTokenBalance(
        userAddress,
        tokenContractAddress,
        chainName,
      );
      if (options?.onPoll) {
        options.onPoll(currentBalance, attempts);
      }

      if (currentBalance >= initialBalance + expectedMinimumIncrease) {
        console.log(
          `Deposit confirmed for ${userAddress}. New balance: ${currentBalance}. Increase: ${currentBalance - initialBalance}`,
        );
        return currentBalance;
      }
    } catch (error) {
      // Log error from getCurrentTokenBalance but continue polling unless it's a fatal config error
      console.warn(
        `Attempt ${attempts}: Error polling for balance (will retry):`,
        (error as Error).message,
      );
      if (
        (error as Error).message.includes("Unsupported chain") ||
        (error as Error).message.includes("environment variable not set")
      ) {
        // If it's a configuration error from getChainConfig, rethrow to stop polling.
        throw error;
      }
    }
    // Wait before the next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
  throw new Error(
    `Timeout waiting for deposit confirmation for ${userAddress} on ${tokenContractAddress}. Expected increase of ${expectedMinimumIncrease} over initial ${initialBalance} not observed.`,
  );
}
