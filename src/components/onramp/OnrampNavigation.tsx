
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnrampNavigationProps {
  currentStep: number;
  steps: string[];
  handleBack: () => void;
  handleContinue: () => void;
  canContinue: () => boolean;
  isWalletConnected?: boolean; // New prop to track wallet connection state
}

const OnrampNavigation = ({
  currentStep,
  steps,
  handleBack,
  handleContinue,
  canContinue,
  isWalletConnected = false // Default to false if not provided
}: OnrampNavigationProps) => {
  const isMobile = useIsMobile();
  
  // Function to determine button text based on current step and wallet connection
  const getButtonText = () => {
    if (currentStep === 0) {
      return isWalletConnected ? "Start Onramp" : "Connect Wallet";
    }
    return "Continue to Payment";
  };

  // Get button icon based on wallet connection status
  const getButtonIcon = () => {
    if (currentStep === 0 && !isWalletConnected) {
      return <Wallet className="h-4 w-4" />;
    }
    return null;
  };
  
  return (
    <div className="flex justify-between">
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={handleBack}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      ) : (
        <Link to="/">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
      )}
      
      {currentStep < steps.length - 1 && (
        <Button
          variant="outline"
          onClick={handleContinue}
          disabled={!canContinue()}
          withArrow={isWalletConnected || currentStep > 0} // Only show arrow if wallet is connected or not on first step
          icon={getButtonIcon()}
          className={`rounded-full flex items-center gap-2 border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 ${isMobile ? "w-1/2" : ""}`}
        >
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default OnrampNavigation;
