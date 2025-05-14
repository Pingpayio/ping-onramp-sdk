
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnrampNavigationProps {
  currentStep: number;
  steps: string[];
  handleBack: () => void;
  handleContinue: () => void;
  canContinue: () => boolean; // Updated to accept a function that returns a boolean
}

const OnrampNavigation = ({
  currentStep,
  steps,
  handleBack,
  handleContinue,
  canContinue
}: OnrampNavigationProps) => {
  const isMobile = useIsMobile();
  
  // Function to determine button text based on current step
  const getButtonText = () => {
    if (currentStep === 1) {
      return isMobile ? "Continue" : "Continue";
    }
    return isMobile ? "Continue" : "Continue to Payment";
  };
  
  return (
    <div className="flex justify-between pt-3 gap-2 md:gap-4">
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={handleBack}
          icon={<ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />}
          size={isMobile ? "sm" : "md"}
        >
          {isMobile ? "" : "Back"}
        </Button>
      ) : (
        <Link to="/">
          <Button 
            variant="outline" 
            icon={<ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />}
            size={isMobile ? "sm" : "md"}
          >
            {isMobile ? "" : "Back"}
          </Button>
        </Link>
      )}
      
      {currentStep < steps.length - 1 && (
        <Button
          variant="gradient"
          onClick={handleContinue}
          disabled={!canContinue()} // Call the function to get the boolean value
          withArrow
          className={isMobile ? "flex-grow" : ""}
          size={isMobile ? "sm" : "md"}
        >
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default OnrampNavigation;
