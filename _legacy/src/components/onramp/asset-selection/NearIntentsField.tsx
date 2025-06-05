import React from "react";

interface NearIntentsFieldProps {
  depositAddress: string | null;
}

const NearIntentsField = ({ depositAddress }: NearIntentsFieldProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden relative">
          <img
            src="/lovable-uploads/d2b4af05-1771-4a52-b69a-baf672076fb9.png"
            alt="NEAR Intents"
            className="w-full h-full object-contain"
          />
        </div>
        <label className="text-sm text-white">
          EVM Deposit Address (for USDC)
        </label>
      </div>

      <span className="text-xs text-[#AF9EF9] font-normal h-4">
        {depositAddress ? (
          depositAddress
        ) : (
          <span className="text-white/70">
            Awaiting deposit address generation...
          </span>
        )}
      </span>
      <p className="text-xs text-white/50 mt-1 px-1">
        This is the temporary EVM address where you'll send USDC. It will then
        be bridged to your NEAR address.
      </p>
    </div>
  );
};

export default NearIntentsField;
