import { ErrorComponent } from "@/components/error";
import { PopupConnectionProvider } from "@/context/popup-connection-provider";
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
      <PopupConnectionProvider>
        <WalletProvider>
          <Outlet />
        </WalletProvider>
      </PopupConnectionProvider>
    </React.Fragment>
  );
}
