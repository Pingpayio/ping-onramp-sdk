
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

const PaymentCompletion = ({
  amount,
  selectedAsset,
  walletAddress,
  selectedOnramp
}: PaymentCompletionProps) => {
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
