
import React from 'react';

const PaymentMethod = () => {
  return (
    <div className="rounded-lg border p-3 md:p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-secondary rounded-full p-1.5 md:p-2 mr-2 md:mr-3">
            <div className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ping-600">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
          <div>
            <p className="font-medium text-sm md:text-base">Pay with</p>
            <p className="text-muted-foreground text-xs md:text-sm">Credit or debit card</p>
          </div>
        </div>
        {/* ChevronRight icon removed */}
      </div>
    </div>
  );
};

export default PaymentMethod;
