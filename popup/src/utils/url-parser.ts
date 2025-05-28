// popup/src/utils/url-parser.ts

/**
 * Parses query parameters from the current URL's search string.
 * @returns A URLSearchParams object containing the query parameters.
 */
export function getUrlQueryParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Parses query parameters from the current URL's hash string.
 * Useful if parameters are passed in the hash (e.g., #param1=value1&param2=value2).
 * @returns A URLSearchParams object containing the hash parameters.
 */
export function getUrlHashParams(): URLSearchParams {
  // Remove the leading '#' before parsing
  const hash = window.location.hash.substring(1);
  return new URLSearchParams(hash);
}

/**
 * Retrieves a specific query parameter from the URL.
 * @param paramName The name of the parameter to retrieve.
 * @returns The value of the parameter, or null if not found.
 */
export function getQueryParam(paramName: string): string | null {
  const params = getUrlQueryParams();
  return params.get(paramName);
}

/**
 * Retrieves a specific hash parameter from the URL.
 * @param paramName The name of the parameter to retrieve from the hash.
 * @returns The value of the hash parameter, or null if not found.
 */
export function getHashParam(paramName: string): string | null {
  const params = getUrlHashParams();
  return params.get(paramName);
}

/**
 * Clears specific query parameters from the URL without reloading the page.
 * This is useful for cleaning up callback parameters after they've been processed.
 * @param paramsToRemove An array of parameter names to remove.
 */
export function clearUrlQueryParams(paramsToRemove: string[]): void {
  const currentUrl = new URL(window.location.href);
  let updated = false;

  paramsToRemove.forEach(param => {
    if (currentUrl.searchParams.has(param)) {
      currentUrl.searchParams.delete(param);
      updated = true;
    }
  });

  if (updated) {
    window.history.replaceState({}, document.title, currentUrl.toString());
  }
}

/**
 * Clears specific hash parameters from the URL without reloading the page.
 * @param paramsToRemove An array of parameter names to remove from the hash.
 */
export function clearUrlHashParams(paramsToRemove: string[]): void {
  const currentHash = window.location.hash.substring(1);
  if (!currentHash) return;

  const params = new URLSearchParams(currentHash);
  let updated = false;

  paramsToRemove.forEach(param => {
    if (params.has(param)) {
      params.delete(param);
      updated = true;
    }
  });

  if (updated) {
    const newHash = params.toString();
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}${newHash ? '#' + newHash : ''}`);
  }
}

// Example usage for NEAR callback (as mentioned in near-service.ts)
// This would typically be called in the main App.tsx or a relevant effect hook.
// export interface NearCallbackParams {
//   transactionHashes?: string;
//   account_id?: string;
//   public_key?: string;
//   all_keys?: string;
//   errorCode?: string; // For errors
//   errorMessage?: string; // For errors
// }
//
// export function parseNearWalletCallbackParams(): NearCallbackParams {
//   const queryParams = getUrlQueryParams();
//   const result: NearCallbackParams = {};
//
//   if (queryParams.has('transactionHashes')) {
//     result.transactionHashes = queryParams.get('transactionHashes')!;
//   }
//   if (queryParams.has('account_id')) {
//     result.account_id = queryParams.get('account_id')!;
//   }
//   // For function call access key addition/redirection
//   if (queryParams.has('public_key')) {
//     result.public_key = queryParams.get('public_key')!;
//   }
//   if (queryParams.has('all_keys')) {
//     result.all_keys = queryParams.get('all_keys')!;
//   }
//   // For errors
//   if (queryParams.has('errorCode')) {
//     result.errorCode = queryParams.get('errorCode')!;
//   }
//   if (queryParams.has('errorMessage')) { // Or 'error' depending on wallet
//     result.errorMessage = queryParams.get('errorMessage')!;
//   }
//
//   // Clean up URL after parsing
//   // clearUrlQueryParams(['transactionHashes', 'account_id', 'public_key', 'all_keys', 'errorCode', 'errorMessage']);
//
//   return result;
// }
