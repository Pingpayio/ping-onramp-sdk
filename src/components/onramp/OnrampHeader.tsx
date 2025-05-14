import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
const OnrampHeader = () => {
  return <header className="flex justify-between items-center h-[60px]">
      <div className="flex items-center">
        <h1 className="text-[30px] font-normal text-white leading-none flex items-center">Ping Onramp</h1>
      </div>
      
      <Button variant="outline" className="flex items-center gap-2 rounded-full border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 text-base font-normal">
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    </header>;
};
export default OnrampHeader;