
import React from 'react';

const PaymentMethod = () => {
  return (
    <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-secondary rounded-full p-2 mr-3">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
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
