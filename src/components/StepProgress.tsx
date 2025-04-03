
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm mb-2 transition-all",
                  index < currentStep 
                    ? "bg-ping-600 text-white" 
                    : index === currentStep 
                    ? "border-2 border-ping-600 text-ping-600" 
                    : "border-2 border-gray-200 text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={cn(
                  "text-sm font-medium text-center",
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-[2px] flex-1 mx-1", 
                  index < currentStep ? "bg-ping-600" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
