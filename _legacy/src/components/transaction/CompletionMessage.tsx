import React from "react";

interface CompletionMessageProps {
  amount?: string;
  asset?: string;
  stage?: string;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({
  amount,
  asset,
  stage,
}) => {
  if (stage !== "completed") {
    return null;
  }

  return (
    <div className="text-center py-4">
      <h3 className="text-2xl font-semibold text-white mb-1">
        {amount} {asset}
      </h3>
      <p className="text-white/60">Successfully delivered to your wallet</p>
    </div>
  );
};

export default CompletionMessage;
