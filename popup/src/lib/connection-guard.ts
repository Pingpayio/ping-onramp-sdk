import type { TargetAsset } from "@pingpay/onramp-sdk";

let resolveConnection: (value: TargetAsset | PromiseLike<TargetAsset>) => void;

export const connectionPromise = new Promise<TargetAsset>((resolve) => {
  resolveConnection = resolve;
});

export const signalConnectionEstablished = (target: TargetAsset) => {
  resolveConnection(target);
};
