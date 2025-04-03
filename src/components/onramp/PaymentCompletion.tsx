
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ChevronRight } from 'lucide-react';

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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
      <p className="text-muted-foreground mb-6">
        You'll be redirected to {selectedOnramp === "coinbase" ? "Coinbase" : "MoonPay"} to complete your payment
      </p>
      
      <div className="bg-secondary p-4 rounded-md mb-6">
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
      
      <div className="flex justify-center">
        <Link to="/transaction">
          <Button 
            variant="gradient" 
            size="lg"
            icon={<ChevronRight className="h-5 w-5" />}
          >
            Proceed to Payment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCompletion;
