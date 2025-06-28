import { useAtomValue } from "jotai";
import { onrampTargetAtom } from "../../state/atoms";
import LoadingSpinner from "../loading-spinner";
import type { TargetAsset } from "../../../../src/internal/communication/messages";

const FALLBACK_TARGET_ASSET: TargetAsset = {
  chain: "NEAR",
  asset: "wNEAR",
};

interface ReceiveAmountDisplayProps {
  estimatedReceiveAmount: string | null;
  isQuoteLoading: boolean;
  quoteError: string | null;
}

export function ReceiveAmountDisplay({
  estimatedReceiveAmount,
  isQuoteLoading,
  quoteError,
}: ReceiveAmountDisplayProps) {
  const onrampTargetFromAtom = useAtomValue(onrampTargetAtom);
  const currentOnrampTarget = onrampTargetFromAtom ?? FALLBACK_TARGET_ASSET;

  return (
    <div className="w-full border gap-2 flex flex-col border-white/[0.18] rounded-[8px] bg-white/5">
      <div className="w-full p-4 gap-2 flex flex-col">
        <p>You Receive (Estimated)</p>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            {isQuoteLoading ? (
              <LoadingSpinner size="xs" inline={true} />
            ) : (
              <p className="font-bold border-none text-[18px] shadow-none bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 max-w-[200px] text-left text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                {quoteError ? quoteError : estimatedReceiveAmount || "-"}
              </p>
            )}
          </div>
          <div className="border gap-2 border-white/[0.18] px-3 py-2 flex items-center rounded-full bg-white/[0.08] hover:bg-white/5">
            <img
              src={
                currentOnrampTarget.asset === "wNEAR"
                  ? "/near-logo-green.png"
                  : "/usd-coin-usdc-logo.svg"
              }
              alt={`${currentOnrampTarget.asset} Logo`}
              width="20px"
              height="20px"
              className="rounded-full"
            />
            <span className="text-white font-normal">
              {currentOnrampTarget.asset}
            </span>
          </div>
        </div>
      </div>
      <div className="h-[2px] -mt-1 -mb-2 w-full bg-white/5" />
      <div className="w-full py-2 gap-1 px-4 flex shrink-0 items-center justify-end text-[#FFFFFF99] text-xs">
        <p>Network:</p>
        <img
          src="/near-logo-green.png"
          alt={`${currentOnrampTarget.chain} Protocol Logo`}
          className="w-4 h-4 rounded-full"
        />
        <span>{currentOnrampTarget.chain}</span>
      </div>
    </div>
  );
}