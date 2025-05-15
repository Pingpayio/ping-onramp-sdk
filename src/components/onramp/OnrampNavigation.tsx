
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ArrowLeft, Wallet, Home, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWallet } from '@/hooks/use-wallet-context';

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
  isProcessingTransaction = false
}: OnrampNavigationProps) => {
  const isMobile = useIsMobile();
  const { isConnected, connectWallet } = useWallet();
  
  // Function to determine button text based on current step and wallet connection
  const getButtonText = () => {
    if (currentStep === 0) {
      if (!isConnected) return "Connect Wallet to Continue";
      return "Continue to Coinbase Pay";
    }
    return "Return Home";
  };

  // Get button icon based on wallet connection status
  const getButtonIcon = () => {
    if (currentStep === 0) {
      if (!isConnected) return <Wallet className="h-4 w-4" />;
      return <ExternalLink className="h-4 w-4" />;
    }
    return <Home className="h-4 w-4" />;
  };
  
  // Handle button click based on wallet connection status
  const handleButtonClick = async () => {
    if (currentStep === 0 && !isConnected) {
      await connectWallet();
    } else {
      handleContinue();
    }
  };
  
  // Don't show back button during transaction processing
  if (isProcessingTransaction && currentStep === 1) {
    return (
      <div className="flex justify-center">
        <Link to="/">
          <Button variant="outline" icon={<Home className="h-4 w-4" />}>
            Return Home
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`flex ${currentStep === 0 ? 'justify-center' : 'justify-between'}`}>
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
        onClick={handleButtonClick}
        disabled={!isConnected && currentStep > 0 || (currentStep === 0 && !canContinue())} 
        withArrow={isConnected || currentStep > 0}
        icon={getButtonIcon()}
        className={`rounded-full flex items-center gap-2 border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 ${currentStep === 0 ? 'w-full' : isMobile ? 'w-1/2' : ''}`}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default OnrampNavigation;
