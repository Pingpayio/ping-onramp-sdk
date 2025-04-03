import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ArrowRight, CreditCard, Wallet } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ping-50">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
              alt="Ping Logo" 
              className="h-10 mr-2" 
            />
            <span className="text-xl font-bold tracking-tight">Pingpay</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/docs" className="text-muted-foreground hover:text-foreground">Docs</Link>
            <Link to="/start" className="text-muted-foreground hover:text-foreground">Get Started</Link>
            <Link to="/onramp">
              <Button variant="gradient">Launch App</Button>
            </Link>
          </div>
        </header>

        <main>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                The simplest way to onramp to <span className="text-ping-600">NEAR</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Seamlessly convert fiat to NEAR and other supported assets with minimal steps and maximum efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/onramp">
                  <Button size="lg" variant="gradient" withArrow>
                    Start Onramping
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button size="lg" variant="outline">
                    View Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-ping rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white rounded-2xl p-6 border shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-ping-100 p-2 rounded-full mr-3">
                    <CreditCard className="h-6 w-6 text-ping-600" />
                  </div>
                  <h3 className="font-medium">Card to NEAR in minutes</h3>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">You pay</p>
                    <p className="text-xl font-medium">$100.00</p>
                    <p className="text-sm text-muted-foreground">USD</p>
                  </div>
                  <ArrowRight className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">You receive</p>
                    <p className="text-xl font-medium">12.34</p>
                    <p className="text-sm text-muted-foreground">NEAR</p>
                  </div>
                </div>
                <Button variant="gradient" className="w-full">Buy NEAR Now</Button>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="bg-ping-100 h-12 w-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="font-bold text-ping-600">1</span>
                </div>
                <h3 className="font-medium text-lg mb-2">Select Your Asset</h3>
                <p className="text-muted-foreground">Choose NEAR or any other supported asset you want to purchase.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="bg-ping-100 h-12 w-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="font-bold text-ping-600">2</span>
                </div>
                <h3 className="font-medium text-lg mb-2">Pay with Fiat</h3>
                <p className="text-muted-foreground">Use your credit/debit card via our trusted onramp partners.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="bg-ping-100 h-12 w-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="font-bold text-ping-600">3</span>
                </div>
                <h3 className="font-medium text-lg mb-2">Receive Your Assets</h3>
                <p className="text-muted-foreground">Your assets will be automatically sent to your connected wallet.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">For Developers</h2>
              <p className="text-muted-foreground">Integrate Pingpay into your application with just a few lines of code.</p>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-auto">
              <pre className="text-sm">
                <code>{`
import { PingpayWidget } from '@pingpay/widget';

const App = () => {
  return (
    <PingpayWidget
      apiKey="YOUR_API_KEY"
      targetAsset="NEAR"
      onSuccess={(tx) => console.log(tx)}
    />
  );
};`}
                </code>
              </pre>
            </div>
            <div className="flex justify-center">
              <Link to="/docs/integration">
                <Button variant="outline">Read Integration Docs</Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Supported Partners</h2>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
              <div className="h-12">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg" alt="Coinbase" className="h-full" />
              </div>
              <div className="h-8">
                <img src="https://near.org/wp-content/uploads/2021/09/brand-near-logo.svg" alt="NEAR" className="h-full" />
              </div>
              <div className="h-8 text-xl font-bold">MoonPay</div>
              <div className="h-8 text-xl font-bold">Transak</div>
            </div>
          </div>
        </main>

        <footer className="mt-20 py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
                alt="Ping Logo" 
                className="h-8 mr-2" 
              />
              <span className="text-lg font-bold tracking-tight">Pingpay</span>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">© 2025 Pingpay. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
