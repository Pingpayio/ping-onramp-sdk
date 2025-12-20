import type { TargetAsset } from "@pingpay/onramp-types";

export interface OneClickFee {
  recipient: string;
  fee: number;
}

/**
 * Configuration for the PingpayOnramp SDK.
 */
export interface PingpayOnrampConfig {
  /**
   * The target asset and chain for the onramp process.
   * This specifies what the user is trying to acquire.
   */
  targetAsset?: TargetAsset;

  /**
   * appFees to be applied to the onramp process.
   */
  appFees?: OneClickFee[];

  /**
   * URL to render in popup, helpful for local dev + testing
   */
  popupUrl?: string;

  /**
   * Optional callback invoked when the popup window signals it's ready.
   */
  onPopupReady?: () => void;

  /**
   * Optional callback invoked when the popup window is closed, either by the user or programmatically.
   */
  onPopupClose?: () => void;
}
