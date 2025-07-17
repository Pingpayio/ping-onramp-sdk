import type { OnrampFlowStep, OnrampResult } from "./messages";
import {
  initiateOnrampFlowPayloadSchema,
  formDataSubmittedPayloadSchema,
  walletConnectedPayloadSchema,
  transactionSignedPayloadSchema,
  onrampInitiatedPayloadSchema,
  processFailedPayloadSchema,
} from "./messages";
import { z } from "zod";

export type InitiateOnrampFlowPayload = z.infer<
  typeof initiateOnrampFlowPayloadSchema
>;
export type FormDataSubmittedPayload = z.infer<
  typeof formDataSubmittedPayloadSchema
>;
export type WalletConnectedPayload = z.infer<
  typeof walletConnectedPayloadSchema
>;
export type TransactionSignedPayload = z.infer<
  typeof transactionSignedPayloadSchema
>;
export type OnrampInitiatedPayload = z.infer<
  typeof onrampInitiatedPayloadSchema
>;
export type ProcessFailedPayload = z.infer<typeof processFailedPayloadSchema>;

// Methods the SDK (Parent) will expose, for the Popup (Child) to call
export type SdkListenerMethods = {
  reportPopupReady: () => Promise<void>;
  reportFlowStarted: (payload: InitiateOnrampFlowPayload) => Promise<void>;
  reportStepChanged: (payload: {
    step: OnrampFlowStep;
    details?: any;
  }) => Promise<void>;
  reportFormDataSubmitted: (payload: FormDataSubmittedPayload) => Promise<void>;
  reportWalletConnected: (payload: WalletConnectedPayload) => Promise<void>;
  reportTransactionSigned: (payload: TransactionSignedPayload) => Promise<void>;
  reportOnrampInitiated: (payload: OnrampInitiatedPayload) => Promise<void>;
  reportProcessComplete: (payload: { result: OnrampResult }) => Promise<void>;
  reportProcessFailed: (payload: ProcessFailedPayload) => Promise<void>;
  reportPopupClosedByUser: () => Promise<void>;
};

// Methods the Popup (Child) will expose, for the SDK (Parent) to call
export type PopupActionMethods = {
  initiateOnrampInPopup: (payload: InitiateOnrampFlowPayload) => void;
};
