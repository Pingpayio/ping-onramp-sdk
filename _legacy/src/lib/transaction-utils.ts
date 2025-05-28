
/**
 * Generates a mock transaction hash with a specific prefix
 * @param prefix String prefix for the hash (e.g., '0x7a')
 * @returns A transaction hash string
 */
export const generateTxHash = (prefix: string): string => {
  const baseHash = '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('');
  return `${prefix}${baseHash.substring(prefix.length)}`;
};
