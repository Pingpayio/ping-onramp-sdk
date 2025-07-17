import { ProviderError } from "./errors";

const ONE_CLICK_API_BASE_URL = "https://1click.chaindefuser.com/v0";

export class OneClickClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${ONE_CLICK_API_BASE_URL}${endpoint}`;
    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => response.text())) as {
        message?: string;
      };
      console.error(`1Click API Error (${endpoint}):`, errorBody);
      throw new ProviderError(`Failed request to ${endpoint}`, {
        status: response.status,
        error: errorBody?.message || JSON.stringify(errorBody),
      });
    }

    return response.json();
  }

  public get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    body: any,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}
