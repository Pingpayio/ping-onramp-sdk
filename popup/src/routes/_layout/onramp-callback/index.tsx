import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const onrampCallbackSearchSchema = z.object({
  type: z.literal("intents"),
  action: z.literal("withdraw"),
  oneClickDepositAddress: z.string(),
  targetNetwork: z.string(),
  targetAssetSymbol: z.string(),
  fiatAmount: z.string(),
  nearRecipient: z.string(),
});

export type OnrampCallbackParams = z.infer<typeof onrampCallbackSearchSchema>;

export const Route = createFileRoute("/_layout/onramp-callback/")({
  component: RouteComponent,
  validateSearch: (search) => onrampCallbackSearchSchema.parse(search),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  console.log("Onramp Callback Search Params:", searchParams);
  return (
    <div>
      <h1>Onramp Callback</h1>
      <p>Processing your request...</p>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}
