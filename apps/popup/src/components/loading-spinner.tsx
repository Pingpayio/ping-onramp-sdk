import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "small" | "medium" | "large";
  message?: string;
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message,
  inline = false,
}) => {
  const sizeClasses = {
    xs: "h-4 w-4 border-2",
    small: "h-6 w-6 border-2",
    medium: "h-10 w-10 border-4",
    large: "h-16 w-16 border-4",
  };

  const wrapperClasses = inline
    ? "flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={wrapperClasses}>
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
