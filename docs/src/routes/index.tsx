import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout
      nav={{
        title: 'PingPay Docs',
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://onramp.pingpay.io/ping-pay-logo.png"
          alt="PingPay Logo"
          className="w-48 h-auto mb-8"
        />
        <div className="flex space-x-4">
          <Button asChild>
            <Link
              to="/docs/$"
              params={{
                _splat: '',
              }}
            >
              Open Docs
            </Link>
          </Button>
          <Button asChild>
            <a href="https://demo.onramp.pingpay.io" target="_blank">
              Use Demo
            </a>
          </Button>
        </div>
      </div>
    </HomeLayout>
  );
}
