
import React from 'react';

interface ApplePayButtonProps {
  onSelect: () => void;
}

const ApplePayButton = ({ onSelect }: ApplePayButtonProps) => {
  return (
    <div className="w-full">
      <button 
        onClick={onSelect}
        className="w-full h-[42px] bg-black rounded-lg text-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        style={{
          // Using standard CSS properties with fallbacks for Apple Pay styling
          // Casting to unknown first and then to React.CSSProperties to fix TypeScript error
          ...(({
            "-webkit-appearance": "apple-pay-button",
            "-apple-pay-button-type": "plain",
            "-apple-pay-button-style": "black"
          }) as unknown as React.CSSProperties)
        }}
        aria-label="Pay with Apple Pay"
      >
        Pay with Apple Pay
      </button>
    </div>
  );
};

export default ApplePayButton;
