import { z } from "zod";

// -------------------
// Base Schemas
// -------------------

export const targetAssetSchema = z.object({
  chain: z.string(),
  asset: z.string(),
});

export const onrampProviderIdSchema = z.nativeEnum({
  Coinbase: "COINBASE",
});

export const paymentMethodLimitSchema = z.object({
  id: z.string(),
  min: z.string(),
  max: z.string(),
});

export const paymentCurrencySchema = z.object({
  id: z.string(),
  limits: z.array(paymentMethodLimitSchema),
});

export const networkSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  chainId: z.string(),
  contractAddress: z.string(),
});

export const purchaseCurrencySchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  networks: z.array(networkSchema),
});

// -------------------
// API Request Schemas
// -------------------

export const onrampConfigRequestSchema = z.object({
  targetAsset: targetAssetSchema,
  currency: z.string(),
});

export const onrampQuoteRequestSchema = z.object({
  amount: z.coerce.string(),
  sourceCurrency: z.string(),
  destinationAsset: targetAssetSchema,
  paymentMethod: z.string(),
});

export const onrampInitRequestSchema = z.object({
  amount: z.coerce.string(),
  paymentMethod: z.string(),
  recipientAddress: z.string(),
  selectedAsset: z.string(),
  selectedNetwork: z.string(),
  selectedCurrency: z.string(),
});

// -------------------
// API Response Schemas
// -------------------

export const onrampConfigResponseSchema = z.object({
  paymentMethods: z.array(z.object({ id: z.string() })),
  paymentCurrencies: z.array(paymentCurrencySchema),
  purchaseCurrencies: z.array(purchaseCurrencySchema),
  isIosDevice: z.boolean(),
  isRegionSupported: z.boolean(),
});

export const onrampInitResponseSchema = z.object({
  redirectUrl: z.string(),
});

const swapQuoteRequestSchema = z.object({
  swapType: z.enum(["EXACT_INPUT", "EXACT_OUTPUT"]),
  slippageTolerance: z.number(),
  originAsset: z.string(),
  depositType: z.enum(["ORIGIN_CHAIN", "INTENTS"]),
  destinationAsset: z.string(),
  amount: z.string(),
  refundTo: z.string(),
  refundType: z.enum(["ORIGIN_CHAIN", "INTENTS"]),
  recipient: z.string(),
  recipientType: z.enum(["DESTINATION_CHAIN", "INTENTS"]),
  deadline: z.string(),
  dry: z.boolean().optional(),
  referral: z.string().optional(),
  quoteWaitingTimeMs: z.number().optional(),
  appFees: z
    .array(
      z.object({
        recipient: z.string(),
        fee: z.number(),
      }),
    )
    .optional(),
});

const swapQuoteSchema = z.object({
  timestamp: z.string(),
  signature: z.string(),
  quoteRequest: swapQuoteRequestSchema,
  quote: z.object({
    depositAddress: z.string(),
    amountIn: z.string(),
    amountInFormatted: z.string(),
    amountInUsd: z.string(),
    minAmountIn: z.string().optional(),
    amountOut: z.string(),
    amountOutFormatted: z.string(),
    amountOutUsd: z.string(),
    minAmountOut: z.string().optional(),
    deadline: z.string(),
    timeWhenInactive: z.string(),
    timeEstimate: z.number(),
  }),
});

const onrampQuoteSchema = z.object({
  payment_total: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  payment_subtotal: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  purchase_amount: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  coinbase_fee: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  network_fee: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  quote_id: z.string(),
});

export const onrampQuoteResponseSchema = z.object({
  swapQuote: swapQuoteSchema,
  onrampQuote: onrampQuoteSchema,
  estimatedReceiveAmount: z.string(),
  fees: z.object({
    maxSlippage: z.string(),
    networkFee: z.string(),
    providerFee: z.string(),
    pingpayFee: z.string(),
    totalFee: z.string(),
    swapFee: z.string(),
  }),
});

// -------------------
// Onramp Result Schema
// -------------------

export const onrampResultSchema = z.object({
  type: z.literal("intents"),
  action: z.literal("withdraw"),
  depositAddress: z.string(),
  network: z.string(),
  asset: z.string(),
  amount: z.string(),
  recipient: z.string(),
});

export type OnrampResult = z.infer<typeof onrampResultSchema>;

// -------------------
// Broadcast Channel Message Schemas
// -------------------

export const broadcastCompleteMessageSchema = z.object({
  sessionId: z.string(),
  type: z.literal("complete"),
  data: z.object({
    result: onrampResultSchema,
  }),
});

export const broadcastErrorMessageSchema = z.object({
  sessionId: z.string(),
  type: z.literal("error"),
  data: z.object({
    error: z.string(),
    details: z.unknown().optional(),
    step: z.string(),
  }),
});

export const broadcastMessageSchema = z.discriminatedUnion("type", [
  broadcastCompleteMessageSchema,
  broadcastErrorMessageSchema,
]);

export type BroadcastCompleteMessage = z.infer<
  typeof broadcastCompleteMessageSchema
>;
export type BroadcastErrorMessage = z.infer<typeof broadcastErrorMessageSchema>;
export type BroadcastMessage = z.infer<typeof broadcastMessageSchema>;

// -------------------
// Inferred Types
// -------------------

export type TargetAsset = z.infer<typeof targetAssetSchema>;
export type OnrampProviderId = z.infer<typeof onrampProviderIdSchema>;
export type PaymentMethodLimit = z.infer<typeof paymentMethodLimitSchema>;
export type PaymentCurrency = z.infer<typeof paymentCurrencySchema>;
export type Network = z.infer<typeof networkSchema>;
export type PurchaseCurrency = z.infer<typeof purchaseCurrencySchema>;

// Request Types
export type OnrampConfigRequest = z.infer<typeof onrampConfigRequestSchema>;
export type OnrampQuoteRequest = z.infer<typeof onrampQuoteRequestSchema>;
export type OnrampInitRequest = z.infer<typeof onrampInitRequestSchema>;

// Response Types
export type OnrampConfigResponse = z.infer<typeof onrampConfigResponseSchema>;
export type OnrampInitResponse = z.infer<typeof onrampInitResponseSchema>;

export type OnrampQuoteResponse = z.infer<typeof onrampQuoteResponseSchema>;
