import { Outlet, createRootRoute } from "@tanstack/react-router";
import { WalletProvider } from "@/context/wallet-provider";
import React from "react";
import { ErrorComponent } from "@/components/error";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <WalletProvider>
        <Outlet />
      </WalletProvider>
    </React.Fragment>
  );
}
