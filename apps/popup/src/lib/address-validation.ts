// ============================================================================
// Address Validation Configuration
// ============================================================================

/**
 * Chain identifiers (normalized to lowercase)
 */
export type ChainId = "btc" | "eth" | "sol" | "tron" | "xrp" | "zec" | "near" | "sui";

// ============================================================================
// Regex Patterns (cached for performance)
// ============================================================================

const IMPLICIT_ACCOUNT_REGEX = /^[0-9a-f]{64}$/;
const NEAR_ACCOUNT_CHARS_REGEX = /^[a-z0-9._-]+$/;
const SEPARATOR_START_END_REGEX = /^[._-]|[._-]$/;
const CONSECUTIVE_SEPARATORS_REGEX = /[._-]{2,}/;
const BASIC_ADDRESS_CHARS_REGEX = /^[a-zA-Z0-9._-]+$/;
const SUI_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const BITCOIN_ADDRESS_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const TRON_ADDRESS_REGEX = /^T[A-Za-z1-9]{33}$/;
const XRP_ADDRESS_REGEX = /^r[0-9a-zA-Z]{25,34}$/;
const ZCASH_ADDRESS_REGEX = /^(t|z)[a-zA-Z0-9]{34}$/;

// ============================================================================
// Chain-Specific Validators
// ============================================================================

/**
 * Validates a NEAR account address
 * Supports:
 * - Named accounts: alice.near, bob.testnet
 * - Implicit accounts: 64-character hex string
 */
export function isValidNearAddress(address: string): boolean {
  const length = address.length;
  if (length < 2 || length > 64) {
    return false;
  }

  // Check for implicit account (64 character hex string)
  if (length === 64 && IMPLICIT_ACCOUNT_REGEX.test(address)) {
    return true;
  }

  // Check for named account (.near)
  if (address.endsWith(".near")) {
    const accountName = address.slice(0, -5);
    const nameLength = accountName.length;
    if (nameLength < 2 || nameLength > 59) {
      return false;
    }
    return validateNearAccountName(accountName);
  }

  // Check for testnet account (.testnet)
  if (address.endsWith(".testnet")) {
    const accountName = address.slice(0, -8);
    const nameLength = accountName.length;
    if (nameLength < 2 || nameLength > 56) {
      return false;
    }
    return validateNearAccountName(accountName);
  }

  return false;
}

/**
 * Validates a NEAR account name (without suffix)
 */
function validateNearAccountName(accountName: string): boolean {
  if (!NEAR_ACCOUNT_CHARS_REGEX.test(accountName)) {
    return false;
  }
  if (SEPARATOR_START_END_REGEX.test(accountName)) {
    return false;
  }
  if (CONSECUTIVE_SEPARATORS_REGEX.test(accountName)) {
    return false;
  }
  return true;
}

/**
 * Validates a SUI address
 * Format: 64-character hex string, optionally prefixed with 0x
 */
export function isValidSuiAddress(address: string): boolean {
  return SUI_ADDRESS_REGEX.test(address);
}

/**
 * Validates an Ethereum address
 * Format: 0x followed by 40 hex characters
 */
export function isValidEthereumAddress(address: string): boolean {
  return ETHEREUM_ADDRESS_REGEX.test(address);
}

/**
 * Validates a Bitcoin address
 * Supports: Legacy (1...), SegWit (3...), and Bech32 (bc1...)
 */
export function isValidBitcoinAddress(address: string): boolean {
  return BITCOIN_ADDRESS_REGEX.test(address);
}

/**
 * Validates a Solana address
 * Format: Base58 encoded, 32-44 characters
 */
export function isValidSolanaAddress(address: string): boolean {
  return SOLANA_ADDRESS_REGEX.test(address);
}

/**
 * Validates a TRON address
 * Format: T followed by 33 alphanumeric characters
 */
export function isValidTronAddress(address: string): boolean {
  return TRON_ADDRESS_REGEX.test(address);
}

/**
 * Validates an XRP address
 * Format: r followed by 25-34 alphanumeric characters
 */
export function isValidXrpAddress(address: string): boolean {
  return XRP_ADDRESS_REGEX.test(address);
}

/**
 * Validates a Zcash address
 * Format: t or z prefix followed by 34 alphanumeric characters
 */
export function isValidZcashAddress(address: string): boolean {
  return ZCASH_ADDRESS_REGEX.test(address);
}

// ============================================================================
// Chain Validator Map
// ============================================================================

/**
 * Map of chain IDs to their validation functions
 */
const CHAIN_VALIDATORS: Record<ChainId, (address: string) => boolean> = {
  near: isValidNearAddress,
  sui: isValidSuiAddress,
  eth: isValidEthereumAddress,
  btc: isValidBitcoinAddress,
  sol: isValidSolanaAddress,
  tron: isValidTronAddress,
  xrp: isValidXrpAddress,
  zec: isValidZcashAddress,
};

/**
 * Map of chain IDs to their error messages
 */
const CHAIN_ERROR_MESSAGES: Record<ChainId, string> = {
  near: "Please enter a valid NEAR account ID (e.g., alice.near or 64-character hex)",
  sui: "Please enter a valid SUI address (64-character hex, optionally prefixed with 0x)",
  eth: "Please enter a valid Ethereum address (0x followed by 40 hex characters)",
  btc: "Please enter a valid Bitcoin address",
  sol: "Please enter a valid Solana address",
  tron: "Please enter a valid TRON address (starts with T)",
  xrp: "Please enter a valid XRP address (starts with r)",
  zec: "Please enter a valid Zcash address (starts with t or z)",
};

// ============================================================================
// Main Validation Logic
// ============================================================================

/**
 * Validates a recipient address based on the selected network/chain
 * 
 * The address format is determined solely by the chain/network, not the asset.
 * For example:
 * - Ethereum network → Ethereum address format (regardless of ETH, USDC, USDT)
 * - NEAR network → NEAR address format (regardless of NEAR, USDC, USDT)
 * - Bitcoin network → Bitcoin address format
 * 
 * @param address - The address to validate
 * @param network - The blockchain network (e.g., "near", "btc", "eth")
 * @returns Error message string if invalid, undefined if valid
 */
export function validateRecipientAddress(
  address: string,
  network: string,
): string | undefined {
  // Early return for empty/whitespace
  const trimmedAddress = address.trim();
  if (!trimmedAddress) {
    return "Recipient wallet address is required";
  }

  try {
    // Normalize network to lowercase chain ID
    const networkLower = network.toLowerCase() as ChainId;
    
    // Get the appropriate validator for this chain
    const validator = CHAIN_VALIDATORS[networkLower];
    
    if (!validator) {
      // Fallback for unknown chains - basic validation
      return validateBasicAddress(trimmedAddress);
    }
    
    // Validate using chain-specific validator
    if (!validator(trimmedAddress)) {
      return CHAIN_ERROR_MESSAGES[networkLower];
    }
    
    return undefined;
  } catch (error) {
    // Fallback to basic validation on error
    return validateBasicAddress(trimmedAddress);
  }
}

/**
 * Basic address validation fallback for unknown chains
 */
function validateBasicAddress(address: string): string | undefined {
  const addressLength = address.length;

  if (addressLength < 10) {
    return "Address appears to be too short";
  }

  if (addressLength > 100) {
    return "Address appears to be too long";
  }

  if (!BASIC_ADDRESS_CHARS_REGEX.test(address)) {
    return "Address contains invalid characters";
  }

  return undefined;
}

// ============================================================================
// Memoized Validation (for React Hook Form)
// ============================================================================

let lastAddress = "";
let lastNetwork = "";
let lastAsset = "";
let lastResult: string | undefined;

/**
 * Memoized version of validateRecipientAddress for React Hook Form
 * Avoids re-validating the same input on every render
 */
export function memoizedValidateRecipientAddress(
  address: string,
  network: string,
): string | undefined {
  // Simple memoization to avoid re-validating the same input
  if (address === lastAddress && network === lastNetwork) {
    return lastResult;
  }

  lastAddress = address;
  lastNetwork = network;
  lastResult = validateRecipientAddress(address, network);

  return lastResult;
}
