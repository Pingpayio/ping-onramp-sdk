import { Outlet, createRootRoute } from "@tanstack/react-router";
import { WalletProvider } from "@/context/wallet-provider";
import React from "react";

export const Route = createRootRoute({
  component: RootComponent,
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
