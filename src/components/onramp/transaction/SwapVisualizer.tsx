
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TransactionStage } from '@/hooks/use-transaction-progress';

interface SwapVisualizerProps {
  asset: string | null;
  stage: TransactionStage;
}

const SwapVisualizer: React.FC<SwapVisualizerProps> = ({ asset, stage }) => {
  // Only show during querying, signing and sending stages
  if (stage !== 'querying' && stage !== 'signing' && stage !== 'sending') {
    return null;
  }

  return (
    <Card className="bg-white/5 border border-white/10 p-5">
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
          <ArrowUp className={`h-4 w-4 text-[#AF9EF9] rotate-90 ${stage === 'querying' ? 'animate-pulse' : ''}`} />
        </div>
        
        <div className="text-center">
          <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
            <span className="text-white/80">{asset?.charAt(0)}</span>
          </div>
          <p className="text-xs text-white/60 mt-1">{asset || 'Crypto'}</p>
        </div>
      </div>
    </Card>
  );
};

export default SwapVisualizer;
