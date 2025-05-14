
import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethod = () => {
  return (
    <div className="rounded-lg hover:shadow-sm transition-shadow bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center">
      <div className="flex items-center w-full px-3">
        <div className="bg-secondary rounded-full p-2 mr-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm md:text-base">Pay with</p>
          <p className="text-muted-foreground text-xs md:text-sm">Credit or debit card</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
