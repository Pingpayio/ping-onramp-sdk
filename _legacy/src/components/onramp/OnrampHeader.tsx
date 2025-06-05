import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Wallet } from "@coinbase/onchainkit/wallet";

const OnrampHeader = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }
  return (
    <header className="flex justify-between items-center h-[50px] mt-2 md:mt-0">
      <div className="flex items-center">
        <h1 className="text-[20px] md:text-[30px] font-normal text-white leading-none flex items-center">
          Ping Onramp
        </h1>
      </div>

      <Wallet />
    </header>
  );
};

export default OnrampHeader;
