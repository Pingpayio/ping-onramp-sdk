
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ChevronRight, Shield } from 'lucide-react';
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
  // Calculate estimated token amount with 1% fee
  const getEstimatedAmount = () => {
    if (selectedAsset && amount && !isNaN(parseFloat(amount))) {
      const assetPrice = mockPrices[selectedAsset!] || 1;
      const estimatedTokens = parseFloat(amount) / assetPrice;
      const afterFeeAmount = estimatedTokens * 0.99; // Apply 1% fee
      const feeAmount = estimatedTokens * 0.01; // Calculate fee amount
      
      // Format based on value - show more decimal places for higher value tokens
      let formattedAmount;
      if (assetPrice >= 1000) {
        formattedAmount = afterFeeAmount.toFixed(5);
      } else if (assetPrice >= 100) {
        formattedAmount = afterFeeAmount.toFixed(4);
      } else {
        formattedAmount = afterFeeAmount.toFixed(2);
      }
      
      // Format fee amount with the same precision
      let formattedFee;
      if (assetPrice >= 1000) {
        formattedFee = feeAmount.toFixed(5);
      } else if (assetPrice >= 100) {
        formattedFee = feeAmount.toFixed(4);
      } else {
        formattedFee = feeAmount.toFixed(2);
      }
      
      return { 
        afterFeeAmount: formattedAmount,
        feeAmount: formattedFee
      };
    }
    return { 
      afterFeeAmount: "0",
      feeAmount: "0"
    };
  };

  // Mock fee calculation - in a real app this would come from an API
  const fee = 1.50;
  const totalAmount = parseFloat(amount);

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

  const { afterFeeAmount, feeAmount } = getEstimatedAmount();

  return (
    <div className="flex flex-col items-center px-2">
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">
          Buy ${amount} of {selectedAsset}
        </h2>
        <p className="text-sm text-muted-foreground">
          {selectedAsset} price {getAssetPrice()}
        </p>
      </div>
      
      {/* Transaction Details List */}
      <div className="w-full border rounded-lg overflow-hidden mb-6">
        <div className="divide-y">
          {/* Receive */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Receive</span>
            <div className="text-right">
              <span className="font-medium">{afterFeeAmount} {selectedAsset}</span>
              <div className="text-xs text-muted-foreground">
                Fee: {feeAmount} {selectedAsset} (1%)
              </div>
            </div>
          </div>
          
          {/* Network */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">
              {selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}
            </span>
          </div>
          
          {/* Pay with */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">Pay with</span>
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-1 mr-2">
                  <div className="text-blue-500 font-bold text-xs">VISA</div>
                </div>
                <span className="font-medium">Visa **2450</span>
              </div>
            </div>
          </div>
          
          {/* To/Destination */}
          <div className="flex justify-between p-3.5">
            <span className="text-muted-foreground">To</span>
            <div className="break-all text-right">
              {walletAddress || '0x...'}
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
          </div>
          <div className="text-xl font-bold flex items-center">
            ${totalAmount.toFixed(2)}
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
