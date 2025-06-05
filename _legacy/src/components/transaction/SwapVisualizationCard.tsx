import React from "react";
import { ArrowUp } from "lucide-react";

interface SwapVisualizationCardProps {
  asset?: string;
}

const SwapVisualizationCard: React.FC<SwapVisualizationCardProps> = ({
  asset,
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <div className="flex items-center mb-3">
        <div className="w-7 h-7 rounded-full mr-2">
          <img
            src="/lovable-uploads/d2b4af05-1771-4a52-b69a-baf672076fb9.png"
            alt="NEAR Intents"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white font-medium">NEAR Intents Swap</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white/80">$</span>
          </div>
          <p className="text-xs text-white/60 mt-1">USD</p>
        </div>

        <div className="flex-1 px-2 flex items-center justify-center">
          <ArrowUp className="h-4 w-4 text-white/40 rotate-90 animate-pulse" />
        </div>

        <div className="text-center">
          <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
            <span className="text-white/80">{asset?.charAt(0) || "₿"}</span>
          </div>
          <p className="text-xs text-white/60 mt-1">{asset || "Crypto"}</p>
        </div>
      </div>
    </div>
  );
};

export default SwapVisualizationCard;
