import React, { type ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { CDP_PROJECT_ID, ONCHAINKIT_API_KEY, PROJECT_NAME } from "../config";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const walletConnectProjectId = CDP_PROJECT_ID;
  const onchainKitApiKey = ONCHAINKIT_API_KEY;
  const projectName = PROJECT_NAME;
  const cdpProjectId = CDP_PROJECT_ID;

  console.log("WalletProvider configuration:", {
    walletConnectProjectId: walletConnectProjectId ? "Set" : "Not set",
    apiKey: onchainKitApiKey ? "Set" : "Not set",
    cdpProjectId: cdpProjectId ? "Set" : "Not set",
    projectName: projectName ? "Set" : "Not set",
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
