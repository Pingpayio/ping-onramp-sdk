import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePopupConnection } from "../internal/communication/usePopupConnection";
import { Button } from "./ui/button";
import { useSetAtom } from "jotai";
import { onrampErrorAtom } from "../state/atoms";

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const { connection } = usePopupConnection();
  const setError = useSetAtom(onrampErrorAtom);

  // Extract error message
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Log the error
  console.error("Global Error Boundary Caught:", error);

  // Report the error to the parent application and update global error state
  useEffect(() => {
    // Update global error state
    setError(errorMessage);

    // Report to parent application if connection is available
    if (connection) {
      connection
        ?.remoteHandle()
        .call("reportProcessFailed", {
          error: errorMessage,
          step: "error",
        })
        .catch((e: unknown) => {
          console.error("Failed to report error to parent:", e);
        });
    }
  }, [connection, errorMessage, setError]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white">
      <div className="w-full max-w-md p-6 rounded-lg bg-[#232228] border border-[#FFFFFF2E] shadow-lg">
        <h2 className="text-2xl font-semibold text-red-400 mb-4">
          Something went wrong
        </h2>

        <div className="bg-[#1A1A1A] p-4 rounded-md mb-6 overflow-auto max-h-[200px]">
          <p className="text-gray-300 whitespace-pre-wrap break-words">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="w-full bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90"
          >
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = "/onramp")}
            variant="outline"
            className="w-full border-[#FFFFFF2E] text-white hover:bg-white/5"
          >
            Go to Start
          </Button>
        </div>
      </div>
    </div>
  );
}
