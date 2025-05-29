// popup/src/types/index.ts

// This file is for TypeScript types specific to the popup application.
// It can re-export types from shared locations or define new ones.

// Re-exporting shared types for convenience within the popup app
export type {
  OnrampFlowStep, OnrampResult, TargetAsset
} from '../../../src/internal/communication/messages';

// Re-exporting service-level types
export type {
  InitiateOnrampParams,
  OnrampInitiationResult, TransactionSignResult, WalletConnectionResult
} from '../services/types';


// Example of a popup-specific type, if needed:
// export interface PopupUISettings {
//   theme: 'light' | 'dark';
//   accentColor: string;
// }

// Add other popup-specific types below as the application grows.
// For instance, types for form data if not using Zod schemas directly from messages.ts,
// or types for specific UI component props that are complex and reused.

export interface YourSpecificFormData {
  // Define fields for your onramp form
  amount: number;
  fiatCurrency: string;
  // ... other fields like email, name, etc.
}
