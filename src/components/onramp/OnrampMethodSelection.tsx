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
      <button 
        onClick={() => onOnrampSelect("apple")}
        className="w-full bg-black text-white rounded-md py-2.5 px-4 mb-6 flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center justify-center">
          <span className="font-medium mr-2">Buy with</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="18" viewBox="0 0 45 18" fill="none">
            <path d="M7.55924 3.71954C7.01712 4.38472 6.20872 4.91454 5.40032 4.82502C5.29795 4.0224 5.74111 3.17646 6.23533 2.61222C6.77746 1.94704 7.64492 1.46167 8.37066 1.4C8.44362 2.2474 8.10138 3.05459 7.55924 3.71954Z" fill="white"/>
            <path d="M8.37066 4.95861C7.22066 4.8871 6.19986 5.5366 5.62332 5.5366C5.04678 5.5366 4.16053 4.99123 3.24574 5.01923C2.0776 5.04724 0.9822 5.70289 0.414657 6.73271C-0.755768 8.79233 0.132571 11.8641 1.27257 13.5809C1.83787 14.4268 2.52299 15.3549 3.41924 15.328C4.27624 15.3 4.57954 14.776 5.6233 14.776C6.6683 14.776 6.94306 15.328 7.83932 15.3C8.75454 15.2721 9.33108 14.4549 9.89638 13.6089C10.5533 12.6344 10.8293 11.6878 10.8566 11.632C10.8293 11.6032 9.12057 10.9756 9.09323 9.01596C9.06634 7.35721 10.4437 6.58896 10.4983 6.53384C9.6956 5.35987 8.46638 5.20145 8.37066 4.95861Z" fill="white"/>
            <path d="M17.0767 1.54329C19.0047 1.54329 20.3467 2.85541 20.3467 4.80337C20.3467 6.75132 18.9687 8.07737 16.9995 8.07737H14.7987V11.5H13.0947V1.54329H17.0767ZM14.7987 6.62522H16.6515C17.9227 6.62522 18.6187 5.97735 18.6187 4.80337C18.6187 3.63746 17.9227 2.99766 16.6587 2.99766H14.7987V6.62522Z" fill="white"/>
            <path d="M20.8989 9.73914C20.8989 8.31397 21.9629 7.38232 23.7037 7.30028L25.6677 7.21825V6.76284C25.6677 6.02895 25.1597 5.61524 24.2885 5.61524C23.4869 5.61524 22.9789 6.00097 22.8429 6.56876H21.2749C21.3477 5.28466 22.4189 4.26187 24.3277 4.26187C26.1397 4.26187 27.2889 5.25667 27.2889 6.76284V11.5H25.7209V10.4352H25.6677C25.2389 11.1552 24.4301 11.6246 23.4941 11.6246C22.1597 11.6246 20.8989 10.93 20.8989 9.73914ZM25.6677 9.04327V8.38734L23.9349 8.46937C23.0637 8.51541 22.5485 8.92911 22.5485 9.56708C22.5485 10.2051 23.0853 10.577 23.9421 10.577C24.9753 10.577 25.6677 9.92097 25.6677 9.04327Z" fill="white"/>
            <path d="M28.3677 14.4399V13.1559C28.4261 13.1629 28.6189 13.1909 28.7049 13.1909C29.2345 13.1909 29.5393 12.9601 29.7321 12.3712C29.7321 12.3712 29.7753 12.2122 29.7753 12.1942L27.3833 4.38634H29.0929L30.7273 10.5239H30.7805L32.4149 4.38634H34.0461L31.5917 12.4404C31.0477 14.0358 30.3841 14.4399 28.9417 14.4399C28.8053 14.4399 28.4261 14.4119 28.3677 14.4399Z" fill="white"/>
            <path d="M39.3057 11.6666C37.1265 11.6666 35.7057 10.1746 35.7057 7.94982C35.7057 5.73111 37.1409 4.2251 39.2597 4.2251C40.7881 4.2251 41.8801 5.10281 42.2593 6.39495H40.5713C40.3129 5.87514 39.8497 5.58108 39.2741 5.58108C38.3041 5.58108 37.6169 6.47272 37.6169 7.94982C37.6169 9.43488 38.3041 10.3124 39.2885 10.3124C39.8785 10.3124 40.3849 9.98634 40.5929 9.48046H42.2737C41.8729 10.8148 40.7809 11.6666 39.3057 11.6666Z" fill="white"/>
          </svg>
        </div>
      </button>
      
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
