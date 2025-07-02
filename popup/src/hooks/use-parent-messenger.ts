import { usePopupConnection } from "@/context/popup-connection-provider";
import type { SdkListenerMethods } from "@pingpay/onramp-sdk";
import { useCallback, useEffect } from "react";

export function useParentMessenger() {
  const { connection } = usePopupConnection();

  const call = useCallback(
    <TMethod extends keyof SdkListenerMethods>(
      method: TMethod,
      ...args: Parameters<SdkListenerMethods[TMethod]>
    ) => {
      return connection?.remoteHandle().call(method, ...args);
    },
    [connection],
  );

  return { call };
}

export function useReportStep(step: string) {
  const{ connection } = usePopupConnection();

  useEffect(() => {
    if (connection) {
      connection
        .remoteHandle()
        .call("reportStepChanged", { step })
        .catch((e: unknown) => {
          console.error("Error calling reportStepChanged", e);
        });
    }
  }, [connection, step]);
}
