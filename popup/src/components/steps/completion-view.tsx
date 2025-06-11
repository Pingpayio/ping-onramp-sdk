import React from "react";
import type { OnrampResult } from "../../../../src/internal/communication/messages";
import Header from "../header";

interface CompletionViewProps {
  result: OnrampResult | null;
}

const CompletionView: React.FC<CompletionViewProps> = ({ result }) => (
  <div className="flex flex-col gap-4">
    <Header title="Processing Onramp" />
    <div className=" text-center">
      <div className="w-full flex flex-col items-start justify-center p-4 rounded-md border border-[#FFFFFF2E]">
        <div className="flex items-center justify-between w-full">
          <p className="text-[16px] font-bold ">Transaction Complete</p>
          <p className="font-bold">100%</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-green-400 mb-4">
        Onramp Complete!
      </h2>
      {result?.message && (
        <p className="text-gray-300 mb-2">{result.message}</p>
      )}
      {result?.data && (
        <div className="mt-4 text-left bg-gray-700 p-3 rounded-md">
          <h3 className="text-md font-semibold text-gray-200 mb-2">Details:</h3>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        // onClick={() => { /* Close popup or navigate */ }}
      >
        Done
      </button>
    </div>
  </div>
);

export default CompletionView;
