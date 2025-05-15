
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TransactionStage } from '@/hooks/use-transaction-progress';

interface SwapVisualizerProps {
  asset: string | null;
  stage: TransactionStage;
}

const SwapVisualizer: React.FC<SwapVisualizerProps> = ({ asset, stage }) => {
  // Only show during querying, signing, sending stages or swap stage
  if (stage !== 'querying' && stage !== 'signing' && stage !== 'sending' && stage !== 'swap') {
    return null;
  }

  return (
    <Card className="bg-white/5 border border-white/10 p-5 transition-all duration-500 ease-in-out">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center overflow-hidden">
          <img 
            src="/lovable-uploads/d2b4af05-1771-4a52-b69a-baf672076fb9.png" 
            alt="NEAR Intents" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-lg font-medium text-white">NEAR Intents Swap</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <div className="text-center">
          <div className="bg-white/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white/80 text-lg">$</span>
          </div>
          <p className="text-xs text-white/60 mt-2">USD</p>
        </div>
        
        <div className="flex-1 px-4 flex items-center justify-center">
          <ArrowUp className={`h-8 w-8 text-[#AF9EF9] rotate-90 transition-all duration-300 ${stage === 'querying' ? 'animate-pulse' : ''}`} />
        </div>
        
        <div className="text-center">
          <div className="bg-white/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto overflow-hidden">
            <span className="text-white/80 text-lg">{asset?.charAt(0)}</span>
          </div>
          <p className="text-xs text-white/60 mt-2">{asset || 'Crypto'}</p>
        </div>
      </div>
    </Card>
  );
};

export default SwapVisualizer;
