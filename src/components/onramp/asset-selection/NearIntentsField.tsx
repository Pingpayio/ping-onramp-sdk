
import React from 'react';

interface NearIntentsFieldProps {
  depositAddress?: string;
}

const NearIntentsField = ({
  depositAddress = "0x2bC777d98282bd50dCF9AeBAe2F864816f9d54d9"
}: NearIntentsFieldProps) => {
  return <div className="flex flex-col">
      {/* Title with NEAR Intents logo */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden relative">
          <img 
            src="/lovable-uploads/d2b4af05-1771-4a52-b69a-baf672076fb9.png" 
            alt="NEAR Intents" 
            className="w-full h-full object-contain"
          />
        </div>
        <label className="text-sm text-white">NEAR Intents Deposit Address</label>
      </div>
      
      {/* Address display */}
      <span className="text-xs text-[#AF9EF9] font-normal">
        {depositAddress}
      </span>
    </div>;
};

export default NearIntentsField;
