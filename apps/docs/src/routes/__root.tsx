/// <reference types="vite/client" />
import appCss from "@/styles/app.css?url";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
import { RootProvider } from "fumadocs-ui/provider/base";
import { ThemeProvider } from "next-themes";
import * as React from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "PingPay | universal payment layer",
      },
      {
        name: "title",
        content: "PingPay | universal payment layer",
      },
      {
        name: "description",
        content:
          "Send and receive crypto payments from any blockchain.",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://plugin.everything.dev/",
      },
      {
        property: "og:title",
        content: "PingPay | universal payment layer",
      },
      {
        property: "og:description",
        content:
          "Send and receive crypto payments from any blockchain.",
      },
      {
        property: "og:image",
        content: "/metadata.jpg",
      },
      // X (Twitter)
      {
        property: "twitter:card",
        content: "summary_large_image",
      },
      {
        property: "twitter:url",
        content: "https://plugin.everything.dev/",
      },
      {
        property: "twitter:title",
        content: "PingPay | universal payment layer",
      },
      {
        property: "twitter:description",
        content:
          "Send and receive crypto payments from any blockchain.",
      },
      {
        property: "twitter:image",
        content: "/metadata.jpg",
      },
      // Additional SEO
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "author",
        content: "PingPay",
      },
      {
        name: "keywords",
        content:
          "web3 commerce onramp offramp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://docs.pingpay.io/" },
      { rel: "icon", href: "/favicon.svg" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang={"en"}>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <TanstackProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RootProvider>{children}</RootProvider>
          </ThemeProvider>
        </TanstackProvider>
        <Scripts />
      </body>
    </html>
  );
}
