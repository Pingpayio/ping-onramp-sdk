import { generateJwt } from "@coinbase/cdp-sdk/auth";
import type {
  OnrampConfigResponse,
  OnrampInitResponse,
  PaymentCurrency,
  PurchaseCurrency,
} from "@pingpay/onramp-types";
import { ProviderError } from "../../../lib/errors";
import type { OnrampProvider } from "./interface";

interface CoinbaseConfigResponse {
  countries: {
    id: string;
    subdivisions: string[];
    payment_methods: { id: string; name: string }[];
  }[];
}

interface CoinbaseOptionsResponse {
  payment_currencies: PaymentCurrency[];
  purchase_currencies: PurchaseCurrency[];
}

interface CoinbaseTokenResponse {
  token: string;
}

interface CoinbaseOnrampQuoteResponse {
  payment_total: {
    value: string;
    currency: string;
  };
  payment_subtotal: {
    value: string;
    currency: string;
  };
  purchase_amount: {
    value: string;
    currency: string;
  };
  coinbase_fee: {
    value: string;
    currency: string;
  };
  network_fee: {
    value: string;
    currency: string;
  };
  quote_id: string;
}

async function getCoinbaseAuthToken(
  apiKey: string,
  apiSecret: string,
  requestMethod: "GET" | "POST",
  requestPath: string,
): Promise<string> {
  const requestHost = "api.developer.coinbase.com";
  return generateJwt({
    apiKeyId: apiKey,
    apiKeySecret: apiSecret,
    requestMethod,
    requestHost,
    requestPath,
  });
}

class CoinbaseProvider implements OnrampProvider {
  async getOnrampOptions(
    env: any,
    location: { country: string; subdivision?: string },
    device: { userAgent: string | null },
  ): Promise<Partial<OnrampConfigResponse>> {
    const { country, subdivision } = location;
    const { COINBASE_API_KEY, COINBASE_API_SECRET } = env;

    const configPath = "/onramp/v1/buy/config";
    const configToken = await getCoinbaseAuthToken(
      COINBASE_API_KEY,
      COINBASE_API_SECRET,
      "GET",
      configPath,
    );
    const configResponse = await fetch(
      `https://api.developer.coinbase.com${configPath}`,
      {
        headers: { Authorization: `Bearer ${configToken}` },
      },
    );

    if (!configResponse.ok) {
      const errorBody = await configResponse.text();
      throw new ProviderError("Coinbase onramp config failed", {
        error: errorBody,
      });
    }

    const configData = (await configResponse.json()) as CoinbaseConfigResponse;
    const countryInfo = configData.countries.find((c) => c.id === country);

    const isIosDevice = /iPad|iPhone|iPod/.test(device.userAgent ?? "");

    if (!countryInfo) {
      return {
        paymentMethods: [],
        paymentCurrencies: [],
        purchaseCurrencies: [],
        isIosDevice,
      };
    }

    const optionsParams = new URLSearchParams({ country });
    if (subdivision) {
      optionsParams.append("subdivision", subdivision);
    }
    const optionsPath = `/onramp/v1/buy/options`;
    const optionsToken = await getCoinbaseAuthToken(
      COINBASE_API_KEY,
      COINBASE_API_SECRET,
      "GET",
      optionsPath,
    );
    const optionsResponse = await fetch(
      `https://api.developer.coinbase.com${optionsPath}?${optionsParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${optionsToken}` },
      },
    );

    if (!optionsResponse.ok) {
      const errorBody = await optionsResponse.text();
      throw new ProviderError("Coinbase onramp options failed", {
        error: errorBody,
      });
    }

    const optionsData =
      (await optionsResponse.json()) as CoinbaseOptionsResponse;

    return {
      paymentMethods: countryInfo.payment_methods,
      paymentCurrencies: optionsData.payment_currencies,
      purchaseCurrencies: optionsData.purchase_currencies,
      isIosDevice,
    };
  }

  async generateOnrampUrl(
    env: any,
    formData: any,
  ): Promise<OnrampInitResponse> {
    const { COINBASE_API_KEY, COINBASE_API_SECRET } = env;
    const {
      amount,
      asset,
      network,
      address,
      partnerUserId,
      redirectUrl,
      paymentCurrency,
      paymentMethod,
    } = formData;

    const tokenPath = "/onramp/v1/token";
    const tokenBody = {
      addresses: [{ address, blockchains: [network] }],
      assets: [asset],
    };
    console.log("tokenBody", tokenBody);
    const token = await getCoinbaseAuthToken(
      COINBASE_API_KEY,
      COINBASE_API_SECRET,
      "POST",
      tokenPath,
    );
    const tokenResponse = await fetch(
      `https://api.developer.coinbase.com${tokenPath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tokenBody),
      },
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      throw new ProviderError("Coinbase onramp session token failed", {
        error: errorBody,
      });
    }

    const { token: sessionToken } =
      (await tokenResponse.json()) as CoinbaseTokenResponse;

    const onrampUrl = new URL("https://pay.coinbase.com/buy/select-asset");
    onrampUrl.searchParams.set("appId", "b72ad924-2530-464b-b12f-00d1efc7dee6");
    // onrampUrl.searchParams.set("addresses", tokenBody.addresses);
    // onrampUrl.searchParams.set("defaultAsset", asset);
    onrampUrl.searchParams.set("defaultNetwork", "base");
    onrampUrl.searchParams.set("fiatCurrency", paymentCurrency);
    onrampUrl.searchParams.set("presetFiatAmount", amount);
    onrampUrl.searchParams.set("sessionToken", sessionToken);
    // onrampUrl.searchParams.set("partnerUserId", partnerUserId); // TODO: this could be used to track portfolio onramp
    onrampUrl.searchParams.set("redirectUrl", redirectUrl);

    return { redirectUrl: onrampUrl.toString() };
  }

  async getOnrampQuote(
    env: any,
    quoteParams: any,
  ): Promise<CoinbaseOnrampQuoteResponse> {
    const { COINBASE_API_KEY, COINBASE_API_SECRET } = env;
    const {
      purchase_amount,
      purchase_currency,
      purchase_network,
      payment_currency,
      country,
      subdivision,
      payment_method,
    } = quoteParams;

    const quotePath = "/onramp/v1/buy/quote";
    const quoteBody = {
      purchaseCurrency: purchase_currency,
      purchaseNetwork: purchase_network,
      paymentAmount: parseFloat(purchase_amount).toFixed(2),
      paymentCurrency: payment_currency,
      paymentMethod: payment_method,
      country,
      subdivision,
    };

    const quoteToken = await getCoinbaseAuthToken(
      COINBASE_API_KEY,
      COINBASE_API_SECRET,
      "POST",
      quotePath,
    );

    const quoteResponse = await fetch(
      `https://api.developer.coinbase.com${quotePath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${quoteToken}`,
        },
        body: JSON.stringify(quoteBody),
      },
    );

    if (!quoteResponse.ok) {
      const errorBody = await quoteResponse.text();
      throw new ProviderError("Coinbase quote failed", { error: errorBody });
    }

    const quoteData =
      (await quoteResponse.json()) as CoinbaseOnrampQuoteResponse;

    return quoteData;
  }
}

export const coinbaseProvider = new CoinbaseProvider();
