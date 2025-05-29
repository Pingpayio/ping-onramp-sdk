import React, { type ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

// TODO: These should ideally be passed from the SDK via initialData
// or configured in a way that the popup can access them securely.
// Using defaults for now as placeholders.
const DEFAULT_CDP_PROJECT_ID = "a353ad87-5af2-4bc7-af5b-884e6aabf088";
const DEFAULT_ONCHAINKIT_API_KEY = "HCBY5TstODcJYjYbCoC9re0PFwZ75DDe";
const DEFAULT_PROJECT_NAME = "Ping Onramp";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // In a popup environment, `import.meta.env` might not be directly available
  // or might not reflect the parent application's environment.
  // For now, we'll use the defaults.
  const walletConnectProjectId = DEFAULT_CDP_PROJECT_ID;
  const onchainKitApiKey = DEFAULT_ONCHAINKIT_API_KEY;
  const projectName = DEFAULT_PROJECT_NAME;
  const cdpProjectId = DEFAULT_CDP_PROJECT_ID;

  console.log("WalletProvider configuration:", {
    walletConnectProjectId: walletConnectProjectId ? "Set (Default)" : "Not set",
    apiKey: onchainKitApiKey ? "Set (Default)" : "Not set",
    cdpProjectId: cdpProjectId ? "Set (Default)" : "Not set",
    projectName: projectName ? "Set (Default)" : "Not set",
  });

  return (
    <OnchainKitProvider
      chain={base}
      projectId={cdpProjectId}
      apiKey={onchainKitApiKey}
      config={{
        appearance: {
          name: projectName,
          theme: "default",
          mode: "light",
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
};
