
import React from 'react';

interface NearIntentsFieldProps {
  depositAddress?: string;
}

const NearIntentsField = ({ 
  depositAddress = "0x2bC777d98282bd50dCF9AeBAe2F864816f9d54d9" 
}: NearIntentsFieldProps) => {
  return (
    <div className="flex flex-col mt-3">
      {/* Title with NEAR Intents logo */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-white flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.9982 6.26091L20.9982 17.3487C20.9982 18.0925 20.347 18.6131 19.6284 18.3982L14.4409 16.897C14.0344 16.7821 13.7647 16.4101 13.7647 15.9977L13.7647 7.45622C13.7647 7.04385 14.0344 6.6719 14.4409 6.55699L19.6284 5.2113C20.347 4.99649 20.9982 5.51706 20.9982 6.26091Z" fill="black"/>
              <path d="M13.1883 4.61756V19.3824C13.1883 19.7235 12.9014 20.0003 12.5603 20.0003H11.4309C11.0898 20.0003 10.8029 19.7235 10.8029 19.3824V4.61756C10.8029 4.27648 11.0898 3.99963 11.4309 3.99963H12.5603C12.9014 3.99963 13.1883 4.27648 13.1883 4.61756Z" fill="black"/>
              <path d="M10.2353 7.4464V16.5536C10.2353 16.9585 9.96544 17.3145 9.57647 17.4189L3.3647 19.0067C2.66176 19.2043 2 18.6953 2 17.9661V6.03397C2 5.30473 2.66176 4.79579 3.3647 4.99337L9.57647 6.58117C9.96544 6.6856 10.2353 7.04156 10.2353 7.4464Z" fill="black"/>
            </svg>
          </div>
        </div>
        <label className="text-sm text-white">NEAR Intents Deposit Address</label>
      </div>
      
      {/* Address display */}
      <div className="rounded-lg bg-white/[0.08] border border-[rgba(255,255,255,0.18)] h-[50px] flex items-center px-3">
        <div className="text-white/60 text-sm font-normal w-full truncate">
          {depositAddress}
        </div>
      </div>
    </div>
  );
};

export default NearIntentsField;
