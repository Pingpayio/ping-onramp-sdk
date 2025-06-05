import type {
  OnrampFlowStep,
  TargetAsset as ChannelTargetAsset,
  OnrampResult as ChannelOnrampResult,
  initiateOnrampFlowPayloadSchema,
  formDataSubmittedPayloadSchema,
  walletConnectedPayloadSchema,
  transactionSignedPayloadSchema,
  onrampInitiatedPayloadSchema,
  processFailedPayloadSchema,
} from './internal/communication/messages';
import { z } from 'zod';

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
   * URL to render in popup, helpful for local dev + testing
   */
  popupUrl?: string;

  /**
   * Optional callback invoked when the popup window signals it's ready.
   */
  onPopupReady?: () => void;

  /**
   * Optional callback invoked when the onramp flow is confirmed as started by the popup.
   * @param data The initiation data including target and any initialData.
   */
  onFlowStarted?: (data: z.infer<typeof initiateOnrampFlowPayloadSchema>) => void;

  /**
   * Optional callback function that is invoked whenever the onramp flow step changes.
   * @param step The current step in the onramp flow.
   * @param details Optional additional details about the current step.
   */
  onStepChange?: (step: OnrampFlowStep, details?: any) => void;

  /**
   * Optional callback invoked when form data is submitted from the popup.
   * @param payload The submitted form data payload.
   */
  onFormDataSubmitted?: (payload: z.infer<typeof formDataSubmittedPayloadSchema>) => void;

  /**
   * Optional callback invoked when a wallet is connected in the popup.
   * @param walletInfo Information about the connected wallet.
   */
  onWalletConnected?: (walletInfo: z.infer<typeof walletConnectedPayloadSchema>) => void;

  /**
   * Optional callback invoked when a transaction is signed in the popup.
   * @param txInfo Information about the signed transaction.
   */
  onTransactionSigned?: (txInfo: z.infer<typeof transactionSignedPayloadSchema>) => void;

  /**
   * Optional callback invoked when an external onramp service is initiated by the popup.
   * @param serviceInfo Information about the initiated onramp service.
   */
  onOnrampInitiated?: (serviceInfo: z.infer<typeof onrampInitiatedPayloadSchema>) => void;

  /**
   * Optional callback invoked when the onramp process completes successfully.
   * @param result The result of the onramp process.
   */
  onProcessComplete?: (result: ChannelOnrampResult) => void;

  /**
   * Optional callback invoked when the onramp process fails at any step.
   * @param errorInfo Details about the failure.
   */
  onProcessFailed?: (errorInfo: z.infer<typeof processFailedPayloadSchema>) => void;

  /**
   * Optional callback invoked when the popup window is closed, either by the user or programmatically.
   */
  onPopupClose?: () => void;
}

/**
 * Represents the target asset and chain for the onramp process.
 */
export type TargetAsset = ChannelTargetAsset;

/**
 * Represents the result of the onramp process.
 */
export type OnrampResult = ChannelOnrampResult;
