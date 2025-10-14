import {
  useParentMessenger,
  useReportStep,
} from "@/hooks/use-parent-messenger";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { ErrorView } from "../../../components/steps/error-view";

const errorSearchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/_layout/onramp/error")({
  component: ErrorRoute,
  validateSearch: (search) => errorSearchSchema.parse(search),
});

function ErrorRoute() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { call } = useParentMessenger();

  useReportStep("error");

  useEffect(() => {
    call("reportProcessFailed", {
      error: searchParams.error ?? "An unknown error occurred",
      step: "error",
    })?.catch((e: unknown) => {
      console.error("Failed to report process failure:", e);
    });
  }, [call, searchParams.error]);

  const handleRetry = () => {
    void navigate({
      to: "/onramp/form-entry",
    });
  };

  return (
    <ErrorView
      error={searchParams.error ?? "An unknown error occurred"}
      onRetry={handleRetry}
    />
  );
}
