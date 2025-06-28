// Cached regex patterns for better performance
const IMPLICIT_ACCOUNT_REGEX = /^[0-9a-f]{64}$/;
const NEAR_ACCOUNT_CHARS_REGEX = /^[a-z0-9._-]+$/;
const SEPARATOR_START_END_REGEX = /^[._-]|[._-]$/;
const CONSECUTIVE_SEPARATORS_REGEX = /[._-]{2,}/;
const BASIC_ADDRESS_CHARS_REGEX = /^[a-zA-Z0-9._-]+$/;

// Basic NEAR account validation with performance optimizations
function isValidNearAccount(address: string): boolean {
  // NEAR account ID rules:
  // - 2-64 characters
  // - Can contain lowercase letters, digits, and separators (- _ .)
  // - Cannot start or end with separator
  // - Cannot have consecutive separators
  // - Must end with .near for named accounts or be implicit account (64 hex chars)

  const length = address.length;
  if (length < 2 || length > 64) {
    return false;
  }

  // Check for implicit account (64 character hex string) - fastest check first
  if (length === 64 && IMPLICIT_ACCOUNT_REGEX.test(address)) {
    return true;
  }

  // Check for named account (.near)
  if (address.endsWith(".near")) {
    const accountName = address.slice(0, -5); // Remove .near suffix
    const nameLength = accountName.length;

    if (nameLength < 2 || nameLength > 59) {
      return false;
    }

    return validateAccountName(accountName);
  }

  // Check for testnet account (.testnet)
  if (address.endsWith(".testnet")) {
    const accountName = address.slice(0, -8); // Remove .testnet suffix
    const nameLength = accountName.length;

    if (nameLength < 2 || nameLength > 56) {
      return false;
    }

    return validateAccountName(accountName);
  }

  return false;
}

// Extracted account name validation for reuse
function validateAccountName(accountName: string): boolean {
  // Check valid characters first (fastest rejection)
  if (!NEAR_ACCOUNT_CHARS_REGEX.test(accountName)) {
    return false;
  }

  // Check for separators at start/end
  if (SEPARATOR_START_END_REGEX.test(accountName)) {
    return false;
  }

  // Check for consecutive separators
  if (CONSECUTIVE_SEPARATORS_REGEX.test(accountName)) {
    return false;
  }

  return true;
}

// Basic address validation for different chains with performance optimizations
export function validateRecipientAddress(
  address: string,
  targetChain: string,
): string | undefined {
  // Early return for empty/whitespace
  const trimmedAddress = address.trim();
  if (!trimmedAddress) {
    return "Recipient wallet address is required";
  }

  const chainLower = targetChain.toLowerCase();

  // NEAR chain validation
  if (chainLower === "near") {
    if (!isValidNearAccount(trimmedAddress)) {
      return "Please enter a valid NEAR account ID (e.g., alice.near or 64-character hex)";
    }
    return undefined;
  }

  // For other chains, basic length and format checks
  const addressLength = trimmedAddress.length;

  if (addressLength < 10) {
    return "Address appears to be too short";
  }

  if (addressLength > 100) {
    return "Address appears to be too long";
  }

  // Check for obviously invalid characters (basic sanity check)
  if (!BASIC_ADDRESS_CHARS_REGEX.test(trimmedAddress)) {
    return "Address contains invalid characters";
  }

  return undefined;
}

// Memoized validation function for React Hook Form
let lastAddress = "";
let lastChain = "";
let lastResult: string | undefined;

export function memoizedValidateRecipientAddress(
  address: string,
  targetChain: string,
): string | undefined {
  // Simple memoization to avoid re-validating the same input
  if (address === lastAddress && targetChain === lastChain) {
    return lastResult;
  }

  lastAddress = address;
  lastChain = targetChain;
  lastResult = validateRecipientAddress(address, targetChain);

  return lastResult;
}
