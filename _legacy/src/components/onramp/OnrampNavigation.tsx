import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { ArrowLeft, Wallet, Home, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAccount } from "wagmi";

interface OnrampNavigationProps {
  currentStep: number;
  steps: string[];
  handleBack: () => void;
  handleContinue: () => void;
  canContinue: () => boolean;
  isProcessingTransaction?: boolean;
}

const OnrampNavigation = ({
  currentStep,
  steps,
  handleBack,
  handleContinue,
  canContinue,
  isProcessingTransaction = false,
}: OnrampNavigationProps) => {
  const isMobile = useIsMobile();
  const { isConnected } = useAccount();

  // Function to determine button text based on current step and wallet connection
  const getButtonText = () => {
    if (currentStep === 0) {
      return isConnected ? "Start Onramp" : "Connect Wallet to Continue";
    }
    if (currentStep === 2 && !isProcessingTransaction) {
      return "Buy Now";
    }
    return "Continue to Payment";
  };

  // Get button icon based on wallet connection status
  const getButtonIcon = () => {
    if (currentStep === 0 && !isConnected) {
      return <Wallet className="h-4 w-4" />;
    }
    return null;
  };

  // Open blockchain explorer in a new tab
  const openExplorer = () => {
    window.open("https://explorer.near.org", "_blank");
  };

  // Don't show navigation buttons during transaction processing
  if (isProcessingTransaction) {
    return (
      <div className="flex justify-between w-full gap-2 md:gap-4">
        <Link to="/" className="w-full">
          <Button
            variant="outline"
            icon={<Home className="h-4 w-4" />}
            className="rounded-full w-full bg-white text-[#3D315E] hover:bg-white/90 border-none text-xs md:text-sm px-2 md:px-4"
          >
            {isMobile ? "Home" : "Return Home"}
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={openExplorer}
          icon={<ExternalLink className="h-4 w-4" />}
          className="rounded-full w-full bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 border-none text-xs md:text-sm px-2 md:px-4"
        >
          {isMobile ? "Explorer" : "View on Explorer"}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex ${currentStep === 0 ? "justify-center" : "justify-between"}`}
    >
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={handleBack}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      ) : null}

      <Button
        variant="outline"
        onClick={handleContinue}
        disabled={!isConnected && currentStep > 0} // Only disable for steps after first if not connected
        withArrow={isConnected || currentStep > 0} // Only show arrow if wallet is connected or not on first step
        icon={getButtonIcon()}
        className={`rounded-full flex items-center gap-2 border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 ${currentStep === 0 ? "w-full" : isMobile ? "w-1/2" : ""}`}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default OnrampNavigation;
