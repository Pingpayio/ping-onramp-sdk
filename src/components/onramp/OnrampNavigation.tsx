
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
    if (currentStep === 0) {
      return "Start Onramp";
    }
    return "Continue to Payment";
  };
  
  return (
    <div className="flex justify-between py-3">
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
          disabled={!canContinue()} // Call the function to get the boolean value
          withArrow
          className={`rounded-full flex items-center gap-2 border-none bg-[#AB9FF2] text-[#3D315E] hover:bg-[#AB9FF2]/90 ${isMobile ? "w-1/2" : ""}`}
        >
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default OnrampNavigation;
