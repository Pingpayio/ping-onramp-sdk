import { ErrorComponent } from "@/components/error";
import { WalletProvider } from "@/context/wallet-provider";
import type { RouterContext } from "@/main";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import React from "react";

export const Route = createRootRouteWithContext<RouterContext>()({
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
