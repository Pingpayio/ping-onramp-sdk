
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ChevronRight, Shield, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockPrices } from './asset-selection/PriceCalculator';

interface PaymentCompletionProps {
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
  selectedOnramp: string | null;
}

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

  // Mock fee calculation - in a real app this would come from an API
  const fee = 1.50;
  const totalAmount = parseFloat(amount) + fee;

  // Get asset price (for display purposes)
  const getAssetPrice = () => {
    if (selectedAsset) {
      return mockPrices[selectedAsset].toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: selectedAsset === 'BTC' || selectedAsset === 'ETH' ? 2 : 2
      });
    }
    return "$0.00";
  };

  return (
    <div className="flex flex-col items-center px-2">
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">
          Buy ${amount} of {selectedAsset}
        </h2>
        <p className="text-sm text-muted-foreground">
          {selectedAsset} price {getAssetPrice()} <ArrowRight className="inline h-3 w-3" />
        </p>
      </div>
      
      {/* Transaction Details List */}
      <div className="w-full border rounded-lg overflow-hidden mb-6">
        <div className="divide-y">
          {/* Receive */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Receive</span>
            <span className="font-medium">{getEstimatedAmount()} {selectedAsset}</span>
          </div>
          
          {/* Network */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-1 mr-2">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
              <span className="font-medium">
                {selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}
              </span>
            </div>
          </div>
          
          {/* Pay with */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Pay with</span>
            <div className="flex items-center">
              {selectedOnramp === "apple" ? (
                <div className="flex items-center">
                  <div className="bg-black rounded-full p-1 mr-2">
                    <div className="h-4 w-4 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium">Apple Pay</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-1 mr-2">
                    <div className="text-blue-500 font-bold text-xs">VISA</div>
                  </div>
                  <span className="font-medium">Visa **2450</span>
                </div>
              )}
              <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
            </div>
          </div>
          
          {/* To/Destination */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">To</span>
            <div className="text-right">
              <span className="font-medium text-sm">Your Wallet</span>
              <div className="text-xs text-muted-foreground break-all">
                {walletAddress || '0x...'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Note */}
      <div className="w-full text-xs text-muted-foreground mb-6 bg-gray-50 p-3 rounded-md">
        <div className="flex items-start gap-1.5">
          <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Sending funds is a permanent action. For your security, be sure you own the
            wallet address listed.
          </span>
        </div>
      </div>
      
      {/* Total */}
      <div className="w-full border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">Total</span>
            <div className="text-xs text-muted-foreground">
              including spread + ${fee.toFixed(2)} fees
            </div>
          </div>
          <div className="text-xl font-bold flex items-center">
            ${totalAmount.toFixed(2)}
            <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Buy Now Button */}
      <div className="w-full">
        <Link to="/transaction" className="w-full block">
          <Button 
            variant="gradient" 
            size="lg"
            className="w-full py-6 rounded-xl font-bold"
          >
            Buy now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCompletion;
