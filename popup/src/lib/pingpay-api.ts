import { PINGPAY_API_URL } from "@/config";
import type { FormValues } from "@/routes/_layout/onramp/form-entry";
import type {
  OnrampConfigResponse,
  OnrampInitResponse,
  OnrampQuoteRequest,
  OnrampQuoteResponse,
  TargetAsset,
} from "@pingpay/onramp-types";

const API_BASE_URL = import.meta.env.DEV ? "" : PINGPAY_API_URL;

export const onrampConfigQueryOptions = (targetAsset: TargetAsset | null) => ({
  queryKey: ["onramp", "config", targetAsset],
  queryFn: async (): Promise<OnrampConfigResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onramp/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetAsset, currency: "USD" }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch onramp config");
    }
    return response.json() as Promise<OnrampConfigResponse>;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
  enabled: !!targetAsset,
});

export const onrampQuoteQueryOptions = (formData: OnrampQuoteRequest) => ({
  queryKey: ["onramp", "quote", formData],
  queryFn: async (): Promise<OnrampQuoteResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onramp/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch onramp quote");
    }
    return response.json() as Promise<OnrampQuoteResponse>;
  },
  staleTime: 1000 * 30, // 30 seconds
});

export async function initOnramp(
  formData: FormValues,
): Promise<OnrampInitResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onramp/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to initialize onramp");
  }
  return response.json() as Promise<OnrampInitResponse>;
}
