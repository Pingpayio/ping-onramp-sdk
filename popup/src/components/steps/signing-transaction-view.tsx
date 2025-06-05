import React from "react";

const SigningTransactionView: React.FC = () => (
  <div className="p-4 text-center">
    <p className="text-gray-300">Signing Transaction...</p>
    <p className="text-sm text-gray-400 mt-2">
      Please check your wallet to approve the transaction.
    </p>
    {/* Add a spinner or loading animation here */}
  </div>
);

export default SigningTransactionView;
