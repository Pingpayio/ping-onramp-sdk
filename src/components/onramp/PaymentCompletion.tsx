
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ChevronRight, Shield } from 'lucide-react';

interface PaymentCompletionProps {
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
  selectedOnramp: string | null;
}

// Mock prices for demonstration purposes - in a real app, these would come from an API
const mockPrices: Record<string, number> = {
  USDT: 1,
  USDC: 1,
  DAI: 1,
  BTC: 65000,
  ETH: 3500,
  NEAR: 8.12,
  SOL: 145,
  AVAX: 35,
  DOT: 8.5,
  MATIC: 0.75,
  // Add more tokens as needed
};

const PaymentCompletion = ({
  amount,
  selectedAsset,
  walletAddress,
  selectedOnramp
}: PaymentCompletionProps) => {
  // Calculate estimated token amount
  const getEstimatedAmount = () => {
    if (selectedAsset && amount && !isNaN(parseFloat(amount))) {
      const assetPrice = mockPrices[selectedAsset!] || 1;
      const estimatedTokens = parseFloat(amount) / assetPrice;
      
      // Format based on value - show more decimal places for higher value tokens
      if (assetPrice >= 1000) {
        return estimatedTokens.toFixed(5);
      } else if (assetPrice >= 100) {
        return estimatedTokens.toFixed(4);
      } else {
        return estimatedTokens.toFixed(2);
      }
    }
    return "0";
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-center">Complete Payment</h2>
      <p className="text-muted-foreground mb-6 text-center">
        You'll be redirected to {selectedOnramp === "coinbase" ? "Coinbase" : "MoonPay"} to complete your payment
      </p>
      
      <div className="w-full space-y-3 mb-8">
        <div className="bg-secondary p-4 rounded-md mb-2">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Amount:</span>
            <span>${amount}.00 USD</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Asset:</span>
            <span>{selectedAsset}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Estimated {selectedAsset}:</span>
            <span>{getEstimatedAmount()} {selectedAsset}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="text-sm">{walletAddress}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <Shield className="h-3 w-3 mr-1" />
          <span>Secured by {selectedOnramp === "coinbase" ? "Coinbase" : "MoonPay"}</span>
        </div>
      </div>
      
      <div className="w-full">
        <Link to="/transaction" className="w-full block">
          <Button 
            variant="gradient" 
            size="lg"
            icon={<ChevronRight className="h-5 w-5" />}
            className="w-full py-6 rounded-xl"
          >
            Continue to payment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCompletion;
