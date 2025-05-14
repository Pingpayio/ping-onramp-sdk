
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const OnrampHeader = () => {
  return (
    <header className="flex justify-between items-center mb-2 h-[60px]">
      <div className="flex items-center">
        <h1 className="text-[30px] font-normal text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
          Onramp
        </h1>
      </div>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border-ping-600 text-ping-600 hover:bg-ping-600/10"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    </header>
  );
};

export default OnrampHeader;
