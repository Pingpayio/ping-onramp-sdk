import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, CreditCard, Info } from 'lucide-react';
import Button from '@/components/Button';

interface OnrampMethodSelectionProps {
  selectedOnramp: string | null;
  onOnrampSelect: (provider: string) => void;
  amount: string;
  selectedAsset: string | null;
  walletAddress: string | null;
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

const OnrampMethodSelection = ({
  amount,
  selectedAsset,
  walletAddress,
  onOnrampSelect,
  selectedOnramp
}: OnrampMethodSelectionProps) => {
  const [formData, setFormData] = useState({
    country: 'US (+1)',
    mobileNumber: '',
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-select apple pay as the default payment method
  React.useEffect(() => {
    if (!selectedOnramp) {
      onOnrampSelect("apple");
    }
  }, [onOnrampSelect, selectedOnramp]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Payment method
      </h2>
      
      {/* Apple Pay Button */}
      <div className="w-full mb-6">
        <button 
          onClick={() => onOnrampSelect("apple")}
          className="w-full h-12 rounded-md shadow-sm"
          style={{ 
            WebkitAppearance: "-apple-pay-button", 
            ApplePayButtonStyle: "black",
            cursor: "pointer" 
          }}
        >
        </button>
      </div>
      
      {/* Divider with text */}
      <div className="flex items-center mb-6">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-4 text-gray-400 text-sm">Or pay with debit card</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Country and Mobile Number row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <div className="flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer hover:border-ping-600">
                <span className="flex items-center gap-2">
                  <span className="text-sm">🇺🇸</span> 
                  US (+1)
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="mobileNumber">Mobile number</Label>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              placeholder="502-123-4567"
              value={formData.mobileNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Name on card */}
        <div>
          <Label htmlFor="nameOnCard">Name on card</Label>
          <Input
            id="nameOnCard"
            name="nameOnCard"
            placeholder="John Doe"
            value={formData.nameOnCard}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Card number */}
        <div>
          <Label htmlFor="cardNumber">Card number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Expiry date and CVV row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Billing address */}
        <div>
          <Label htmlFor="billingAddress">Billing address</Label>
          <div className="relative">
            <Input
              id="billingAddress"
              name="billingAddress"
              placeholder="12345 Street"
              value={formData.billingAddress}
              onChange={handleInputChange}
              className="pl-9"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terms text */}
      <p className="text-sm text-muted-foreground mt-6 mb-4">
        By tapping Continue, I agree to the <a href="#" className="text-ping-600 hover:underline">Terms of Service</a> and <a href="#" className="text-ping-600 hover:underline">Privacy Policy</a>.
      </p>
      
      {/* Transaction Summary */}
      <div className="bg-secondary p-4 rounded-md mb-6">
        <p className="font-medium mb-2">Transaction Details:</p>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Amount:</span>
          <span>${amount} USD</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Asset:</span>
          <span>{selectedAsset}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Estimated {selectedAsset}:</span>
          <span>{getEstimatedAmount()} {selectedAsset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recipient:</span>
          <span className="text-sm truncate max-w-[200px] md:max-w-[300px]">{walletAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default OnrampMethodSelection;
