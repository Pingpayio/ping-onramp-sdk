// src/types.ts

import type { OnrampFlowStep, TargetAsset as ChannelTargetAsset, OnrampResult as ChannelOnrampResult } from './internal/communication/messages';

/**
 * Configuration for the PingpayOnramp SDK.
 */
export interface PingpayOnrampConfig {
  /**
   * The URL of the popup window to be opened.
   * Defaults to '/popup/index.html' if not provided.
   * This allows hosting the popup on a different domain or path.
   */
  popupUrl?: string;

  /**
   * Optional callback function that is invoked whenever the onramp flow step changes.
   * @param step The current step in the onramp flow.
   * @param details Optional additional details about the current step.
   */
  onStepChange?: (step: OnrampFlowStep, details?: any) => void;

  // Potentially other configuration options like API keys, default themes, etc.
}

/**
 * Represents the target asset and chain for the onramp process.
 * Re-exported from internal messages for public SDK use.
 */
export type TargetAsset = ChannelTargetAsset;

/**
 * Represents the result of the onramp process.
 * Re-exported from internal messages for public SDK use.
 */
export type OnrampResult = ChannelOnrampResult;
