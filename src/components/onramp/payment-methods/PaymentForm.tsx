
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, CreditCard, Info } from 'lucide-react';

interface PaymentFormProps {
  onCardNumberChange?: (cardNumber: string) => void;
}

const PaymentForm = ({ onCardNumberChange }: PaymentFormProps = {}) => {
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
    
    // Pass card number to parent if provided
    if (name === 'cardNumber' && onCardNumberChange) {
      onCardNumberChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Country and Mobile Number row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label htmlFor="country" className="text-sm text-white mb-2">Country</Label>
          <div className="relative">
            <div className="flex items-center justify-between border rounded-lg px-3 py-2 h-[42px] cursor-pointer hover:border-ping-600 bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60">
              <span className="flex items-center gap-2">
                <span className="text-sm">🇺🇸</span> 
                US (+1)
              </span>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <Label htmlFor="mobileNumber" className="text-sm text-white mb-2">Mobile number</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            placeholder="502-123-4567"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
          />
        </div>
      </div>
      
      {/* Name on card - full width */}
      <div className="flex flex-col">
        <Label htmlFor="nameOnCard" className="text-sm text-white mb-2">Name on card</Label>
        <Input
          id="nameOnCard"
          name="nameOnCard"
          placeholder="John Doe"
          value={formData.nameOnCard}
          onChange={handleInputChange}
          className="rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
        />
      </div>
      
      {/* Card number - full width */}
      <div className="flex flex-col">
        <Label htmlFor="cardNumber" className="text-sm text-white mb-2">Card number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleInputChange}
          className="rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
        />
      </div>
      
      {/* Expiry date and CVV row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label htmlFor="expiryDate" className="text-sm text-white mb-2">Expiry date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
          />
        </div>
        
        <div className="flex flex-col">
          <Label htmlFor="cvv" className="text-sm text-white mb-2">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleInputChange}
            className="rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
          />
        </div>
      </div>
      
      {/* Billing address */}
      <div className="flex flex-col">
        <Label htmlFor="billingAddress" className="text-sm text-white mb-2">Billing address</Label>
        <div className="relative">
          <Input
            id="billingAddress"
            name="billingAddress"
            placeholder="12345 Street"
            value={formData.billingAddress}
            onChange={handleInputChange}
            className="pl-9 rounded-lg h-[42px] bg-white/[0.08] border-[rgba(255,255,255,0.18)] text-white/60 focus-visible:border-[#AF9EF9] focus-visible:border-[1.5px] hover:border-[#AF9EF9]/70 focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/40"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-white/40 mt-2 flex items-start gap-1">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-white/40" />
          By tapping continue, you agree to our Terms and acknowledge that you have read our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
