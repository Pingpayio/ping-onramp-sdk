// internal types
import { z } from "zod";

export interface NearIntentsDisplayInfo {
  logoUrl?: string;
  contractName?: string;
  message?: string;
  amountIn?: number; // e.g., fiat amount or initial crypto amount
  amountOut?: number; // e.g., final crypto amount received by user
  explorerUrl?: string;
}

export const onrampCallbackSearchSchema = z.object({
  type: z.literal("intents"),
  action: z.literal("withdraw"),
  depositAddress: z.string(),
  network: z.string(),
  asset: z.coerce.string(),
  amount: z.coerce.string(),
  recipient: z.string(),
  ping_sdk_opener_origin: z.string().optional(),
});

export type OnrampCallbackParams = z.infer<typeof onrampCallbackSearchSchema>;
