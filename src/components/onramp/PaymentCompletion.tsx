
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Shield } from 'lucide-react';
import { mockPrices } from './asset-selection/PriceCalculator';

interface PaymentCompletionProps {
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
  selectedOnramp: string | null;
  cardNumber?: string;
}

const PaymentCompletion = ({
  amount,
  selectedAsset,
  walletAddress,
  selectedOnramp,
  cardNumber = ''
}: PaymentCompletionProps) => {
  // Get parsed amount and ensure it's a valid number
  const parsedAmount = parseFloat(amount) || 0;

  // Calculate estimated token amount with 1% fee
  const getEstimatedAmount = () => {
    if (selectedAsset && parsedAmount > 0) {
      const assetPrice = mockPrices[selectedAsset!] || 1;
      const estimatedTokens = parsedAmount / assetPrice;
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

  // Use the parsed amount directly
  const totalAmount = parsedAmount;

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

  // Get last 4 digits of card number, or use a default
  const getLastFourDigits = () => {
    if (cardNumber && cardNumber.length >= 4) {
      return cardNumber.slice(-4);
    }
    return "2450"; // Default if no card number is provided
  };

  const { afterFeeAmount, feeAmount } = getEstimatedAmount();

  // Generate mock transaction hashes
  const generateMockTxHash = () => {
    return '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Create transaction details object to pass to the transaction page
  const transactionDetails = {
    amount: parsedAmount,
    asset: selectedAsset,
    wallet: walletAddress,
    fiatTxHash: generateMockTxHash(),
    swapTxHash: generateMockTxHash()
  };

  return (
    <div className="flex flex-col h-full px-2">
      {/* Title */}
      <div className="text-center mb-3">
        <h2 className="text-2xl font-bold mb-1">
          Buy ${parsedAmount.toFixed(2)} of {selectedAsset}
        </h2>
        <p className="text-sm text-white/60">
          {selectedAsset} price {getAssetPrice()}
        </p>
      </div>
      
      {/* Transaction Details List */}
      <div className="w-full border rounded-lg overflow-hidden mb-4 border-[rgba(255,255,255,0.18)]">
        <div className="divide-y divide-[rgba(255,255,255,0.18)]">
          {/* Receive */}
          <div className="flex justify-between p-3.5">
            <span className="text-white/60">Receive</span>
            <div className="text-right">
              <span className="font-normal text-white/90">{afterFeeAmount} {selectedAsset}</span>
              <div className="text-xs text-white/60">
                Fee: {feeAmount} {selectedAsset}
              </div>
            </div>
          </div>
          
          {/* Network */}
          <div className="flex justify-between p-3.5">
            <span className="text-white/60">Network</span>
            <span className="font-normal text-white/90">
              {selectedAsset === 'NEAR' ? 'NEAR Protocol' : 'Base'}
            </span>
          </div>
          
          {/* Pay with */}
          <div className="flex justify-between p-3.5">
            <span className="text-white/60">Pay with</span>
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-gradient-ping rounded-full p-1 mr-2">
                  <div className="text-white font-bold text-xs">VISA</div>
                </div>
                <span className="font-normal text-white/90">Visa **{getLastFourDigits()}</span>
              </div>
            </div>
          </div>
          
          {/* To/Destination */}
          <div className="flex justify-between p-3.5">
            <span className="text-white/60">To</span>
            <span className="font-normal text-white/90 break-all text-right">
              {walletAddress || '0x...'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Security Note */}
      <div className="w-full text-xs text-white/60 mb-4 bg-white/[0.08] p-3 rounded-md">
        <div className="flex items-start gap-1.5">
          <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Sending funds is a permanent action. For your security, be sure you own the
            wallet address listed.
          </span>
        </div>
      </div>
      
      {/* Total */}
      <div className="w-full border-t pt-4 mb-4 border-[rgba(255,255,255,0.18)]">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-white/90">Total</span>
          </div>
          <div className="text-xl font-bold flex items-center text-white">
            ${parsedAmount.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Buy Now Button */}
      <div className="w-full">
        <Link 
          to="/transaction" 
          state={{ txDetails: transactionDetails }}
          className="w-full block"
        >
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
