import { useCallback, useEffect, useRef } from "react";
import {
  broadcastMessageSchema,
  type BroadcastMessage,
} from "@pingpay/onramp-types";

export function useBroadcastChannel(sessionId: string) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel("pingpay-onramp");
    return () => {
      channelRef.current?.close();
    };
  }, []);

  const sendMessage = useCallback(
    <T extends BroadcastMessage["type"]>(
      type: T,
      data: Extract<BroadcastMessage, { type: T }>["data"],
    ) => {
      channelRef.current?.postMessage({
        sessionId,
        type,
        data,
      });
    },
    [sessionId],
  );

  const listenForMessages = useCallback(
    (callback: (message: BroadcastMessage) => void) => {
      const channel = channelRef.current;
      if (!channel) return () => {};

      const listener = (event: MessageEvent) => {
        try {
          const parsedMessage = broadcastMessageSchema.parse(event.data);
          if (parsedMessage.sessionId === sessionId) {
            callback(parsedMessage);
          }
        } catch (err) {
          console.error("Invalid broadcast message:", err);
        }
      };

      channel.addEventListener("message", listener);
      return () => channel.removeEventListener("message", listener);
    },
    [sessionId],
  );

  return { sendMessage, listenForMessages };
}
