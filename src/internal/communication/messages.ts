// src/internal/communication/messages.ts

import { z } from 'zod'; // Using Zod for potential runtime validation

// Define Zod schemas for messages (optional but recommended)
const targetAssetSchema = z.object({
  chain: z.string(),
  asset: z.string(),
});

const initiateOnrampFlowPayloadSchema = z.object({
  target: targetAssetSchema,
  initialData: z.any().optional(), // Use z.any() or a more specific schema if possible
});

const formDataSubmittedPayloadSchema = z.object({
  formData: z.any(), // Define a more specific schema for your form data
});

const walletConnectedPayloadSchema = z.object({
  address: z.string(),
  chainId: z.string().optional(),
  walletName: z.string().optional(), // e.g., "Coinbase Wallet", "MetaMask", "MyNearWallet"
});

const transactionSignedPayloadSchema = z.object({
  signature: z.string(),
  publicKey: z.string(),
  transactionHash: z.string().optional(),
  walletName: z.string().optional(),
});

const onrampInitiatedPayloadSchema = z.object({
  serviceName: z.string(), // e.g., "Coinbase Onramp", "MoonPay", "Wyre"
  details: z.any().optional(),
});

const onrampResultSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().optional(),
});

const processCompletePayloadSchema = z.object({
  result: onrampResultSchema,
});

const processFailedPayloadSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
  step: z.string().optional(), // Corresponds to OnrampFlowStep
});

// Define possible steps in the onramp flow (as a Zod enum or TypeScript union)
export const onrampFlowStepSchema = z.enum([
  "loading",
  "form-entry",
  "connecting-wallet",
  "initiating-onramp-service",
  "signing-transaction",
  "processing-transaction",
  "complete",
  "error",
]);
export type OnrampFlowStep = z.infer<typeof onrampFlowStepSchema>;

// Messages sent from the SDK to the Popup
export type SdkToPopupMessages = {
  "initiate-onramp-flow": z.infer<typeof initiateOnrampFlowPayloadSchema>;
};

// Messages sent from the Popup to the SDK
export type PopupToSdkMessages = {
  "popup-ready": undefined; // Use undefined for messages with no payload
  "flow-started": z.infer<typeof initiateOnrampFlowPayloadSchema>; // Can send back the target data for confirmation
  "step-changed": { step: OnrampFlowStep; details?: any }; // Use the step type
  "form-data-submitted": z.infer<typeof formDataSubmittedPayloadSchema>;
  "wallet-connected": z.infer<typeof walletConnectedPayloadSchema>;
  "transaction-signed": z.infer<typeof transactionSignedPayloadSchema>;
  "onramp-initiated": z.infer<typeof onrampInitiatedPayloadSchema>;
  "process-complete": z.infer<typeof processCompletePayloadSchema>;
  "process-failed": z.infer<typeof processFailedPayloadSchema>;
  "popup-closed-by-user": undefined;
};

// Optional: Export schemas for runtime validation if needed
export {
  targetAssetSchema, // Added export for TargetAsset
  initiateOnrampFlowPayloadSchema,
  formDataSubmittedPayloadSchema,
  walletConnectedPayloadSchema,
  transactionSignedPayloadSchema,
  onrampInitiatedPayloadSchema,
  onrampResultSchema,
  processCompletePayloadSchema,
  processFailedPayloadSchema,
};

// Added TargetAsset and OnrampResult types for use in SDK and Popup state
export type TargetAsset = z.infer<typeof targetAssetSchema>;
export type OnrampResult = z.infer<typeof onrampResultSchema>;
