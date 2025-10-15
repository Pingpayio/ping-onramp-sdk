import { useBroadcastChannel } from "@/hooks/use-broadcast-channel";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { ProcessingOnramp } from "@/components/steps/processsing-onramp-view";
import { useAtom } from "jotai";
import { onrampResultAtom } from "@/state/atoms";

const completeSearchSchema = z.object({});

export const Route = createFileRoute("/_layout/onramp/complete")({
  component: CompleteRoute,
  validateSearch: (search) => completeSearchSchema.parse(search),
});

function CompleteRoute() {
  const { sessionId } = Route.useRouteContext();
  const [onrampResult] = useAtom(onrampResultAtom);
  const { sendMessage } = useBroadcastChannel(sessionId);

  useEffect(() => {
    if (onrampResult) {
      sendMessage("complete", { result: onrampResult });
    }
  }, [onrampResult, sendMessage]);

  return <ProcessingOnramp step={3} result={onrampResult} />;
}
