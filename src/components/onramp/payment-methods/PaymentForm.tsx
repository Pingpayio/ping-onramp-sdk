
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, CreditCard, Info } from 'lucide-react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    country: 'US (+1)',
    mobileNumber: '',
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-1">
      {/* Country and Mobile Number row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div>
          <Label htmlFor="country" className="text-[10px]">Country</Label>
          <div className="relative mt-0">
            <div className="flex items-center justify-between border rounded-md px-2 py-1 h-7 cursor-pointer hover:border-ping-600">
              <span className="flex items-center gap-1">
                <span className="text-sm">🇺🇸</span> 
                US (+1)
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="mobileNumber" className="text-[10px]">Mobile number</Label>
          <div className="mt-0">
            <Input
              id="mobileNumber"
              name="mobileNumber"
              placeholder="502-123-4567"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="py-1 h-7 text-xs"
            />
          </div>
        </div>
      </div>
      
      {/* Name on card and Card number row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div>
          <Label htmlFor="nameOnCard" className="text-[10px]">Name on card</Label>
          <Input
            id="nameOnCard"
            name="nameOnCard"
            placeholder="John Doe"
            value={formData.nameOnCard}
            onChange={handleInputChange}
            className="py-1 h-7 mt-0 text-xs"
          />
        </div>
        
        <div>
          <Label htmlFor="cardNumber" className="text-[10px]">Card number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="py-1 h-7 mt-0 text-xs"
          />
        </div>
      </div>
      
      {/* Expiry date and CVV row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div>
          <Label htmlFor="expiryDate" className="text-[10px]">Expiry date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="py-1 h-7 mt-0 text-xs"
          />
        </div>
        
        <div>
          <Label htmlFor="cvv" className="text-[10px]">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleInputChange}
            className="py-1 h-7 mt-0 text-xs"
          />
        </div>
      </div>
      
      {/* Billing address */}
      <div>
        <Label htmlFor="billingAddress" className="text-[10px]">Billing address</Label>
        <div className="relative mt-0">
          <Input
            id="billingAddress"
            name="billingAddress"
            placeholder="12345 Street"
            value={formData.billingAddress}
            onChange={handleInputChange}
            className="pl-7 py-1 h-7 text-xs"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5 flex items-start gap-0.5">
          <Info className="h-2.5 w-2.5 mt-0 flex-shrink-0" />
          By tapping continue, you agree to our Terms and acknowledge that you have read our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
