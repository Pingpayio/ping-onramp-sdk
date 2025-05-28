// popup/src/components/error-display.tsx

import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
  details?: any;
  onRetry?: () => void;
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, details, onRetry, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="p-4 my-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {details && (
        <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
          {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
        </pre>
      )}
      <div className="mt-4 flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
