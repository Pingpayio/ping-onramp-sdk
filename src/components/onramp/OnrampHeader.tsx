
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const OnrampHeader = () => {
  return (
    <header className="flex justify-between items-center h-[60px] px-2 sm:px-4 md:px-6">
      <div className="flex items-center">
        <h1 className="text-xl sm:text-2xl md:text-[30px] font-normal text-white leading-none flex items-center">
          Ping Onramp
        </h1>
      </div>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-1 sm:gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-sm sm:text-base font-normal"
      >
        <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Connect Wallet</span>
      </Button>
    </header>
  );
};

export default OnrampHeader;
