
import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethod = () => {
  return (
    <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-secondary rounded-full p-2 mr-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm md:text-base">Pay with</p>
            <p className="text-muted-foreground text-xs md:text-sm">Credit or debit card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
