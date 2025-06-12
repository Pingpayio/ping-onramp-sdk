import React from "react";

interface ErrorViewProps {
  error: string | null;
  onRetry?: () => void; // Optional retry callback
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => (
  <div className="p-4 text-center">
    <h2 className="text-2xl font-semibold text-red-500 mb-4">
      An Error Occurred
    </h2>
    <p className="text-gray-300 mb-6">
      {error || "An unknown error occurred. Please try again."}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition ease-in-out duration-150"
      >
        Try Again
      </button>
    )}
    {/* You could also add a button to close or go back */}
  </div>
);
