import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

const StepProgress = ({
  steps,
  currentStep,
  onStepClick,
  allowNavigation = false,
}: StepProgressProps) => {
  const handleStepClick = (index: number) => {
    if (allowNavigation && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex flex-col items-center relative",
                allowNavigation && "cursor-pointer",
              )}
              onClick={() => handleStepClick(index)}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center font-medium text-xs mb-2 transition-all",
                  index < currentStep
                    ? "bg-ping-600 text-white"
                    : index === currentStep
                      ? "border-2 border-ping-600 text-ping-600"
                      : "border-2 border-white/20 text-white/40",
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center",
                  index <= currentStep ? "text-white/90" : "text-white/40",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-2",
                  index < currentStep ? "bg-ping-600" : "bg-white/20",
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
