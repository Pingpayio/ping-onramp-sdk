import { useCallback } from "react";
import type { BroadcastMessage } from "@pingpay/onramp-types";

export function useBroadcastChannel(sessionId: string) {
  const sendMessage = useCallback(
    <T extends BroadcastMessage["type"]>(
      type: T,
      data: Extract<BroadcastMessage, { type: T }>["data"],
    ) => {
      console.log(`Popup: Attempting to send "${type}" message, sessionId=${sessionId}, window.opener=${!!window.opener}`);
      if (window.opener && !window.opener.closed) {
        console.log(`Popup: Sending "${type}" message via postMessage`);
        window.opener.postMessage(
          {
            sessionId,
            type,
            data,
          },
          "*"
        );
      } else {
        console.log(`Popup: Cannot send "${type}" - window.opener is ${window.opener === null ? 'null' : 'closed'}`);
      }
    },
    [sessionId],
  );

  return { sendMessage };
}
