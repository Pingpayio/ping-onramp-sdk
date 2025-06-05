import React from 'react';
import { useProcessingSubStep } from '../../state/hooks';

const ProcessingTransactionView: React.FC = () => {
  const [subStep] = useProcessingSubStep();

  return (
    <div className="p-4 text-center" data-testid="processing-transaction-view">
      <p className="text-gray-300">Processing Transaction...</p>
      
      {/* Sub-step indicators */}
      <div className="mt-4">
        {subStep === 'depositing' && (
          <div data-testid="processing-substep-depositing" className="text-blue-400">
            Depositing funds...
          </div>
        )}
        {subStep === 'querying' && (
          <div data-testid="processing-substep-querying" className="text-blue-400">
            Querying transaction status...
          </div>
        )}
        {subStep === 'signing' && (
          <div data-testid="processing-substep-signing" className="text-blue-400">
            Waiting for signature...
          </div>
        )}
        {subStep === 'withdrawing' && (
          <div data-testid="processing-substep-withdrawing" className="text-blue-400">
            Processing withdrawal...
          </div>
        )}
        {subStep === 'done' && (
          <div data-testid="processing-substep-done" className="text-green-400">
            Transaction complete!
          </div>
        )}
        {subStep === 'error' && (
          <div data-testid="processing-substep-error" className="text-red-400">
            Error processing transaction
          </div>
        )}
      </div>

      {/* Loading spinner */}
      {subStep !== 'done' && subStep !== 'error' && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default ProcessingTransactionView;
