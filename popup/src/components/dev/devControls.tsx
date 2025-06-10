import React from "react";
import type { OnrampFlowStep } from "../../../../src/internal/communication/messages";

interface DevControlsProps {
  currentStep: OnrampFlowStep;
  onStepChange: (step: OnrampFlowStep) => void;
}
const DevControls: React.FC<DevControlsProps> = () => {
  return <div className="flex items-center justify-between"></div>;
};

export default DevControls;
