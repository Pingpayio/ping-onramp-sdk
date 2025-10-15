import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <img
            src="https://onramp.pingpay.io/ping-pay-logo.png"
            alt="PING Logo"
            className="h-6"
          />
        </div>
      ),
    },
    githubUrl: "https://github.com/Pingpayio/ping-onramp-sdk",
  };
}
