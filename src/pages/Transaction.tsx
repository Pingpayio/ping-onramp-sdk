
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import TransactionStatus from '@/components/TransactionStatus';
import { CheckCircle2, ArrowLeft, Home } from 'lucide-react';
import { mockPrices } from '@/components/onramp/asset-selection/PriceCalculator';

const TransactionPage = () => {
  const [step, setStep] = useState<'fiat' | 'swap' | 'complete'>('fiat');
  const [loading, setLoading] = useState(true);
  
  // Mock transaction details
  const txDetails = {
    amount: 100,
    asset: 'NEAR',
    wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Using the wallet address from the form
    fiatTxHash: '0x3a1b3d543d446d8ce36e27c79165c74ef5543a8251a73c0662b5a3cc6e79',
    swapTxHash: '0x8c3a1a7546d985c4e44b9ae414c01f240c5d7f1679be993559fb43bd78a45'
  };

  // Calculate the NEAR amounts
  const calculateNearAmounts = () => {
    const nearPrice = mockPrices['NEAR'] || 2.51;
    const totalNear = txDetails.amount / nearPrice;
    const receivedNear = totalNear * 0.99; // Apply 1% fee
    const feeNear = totalNear * 0.01; // Calculate fee amount
    
    return {
      received: receivedNear.toFixed(2),
      fee: feeNear.toFixed(2)
    };
  };

  const nearAmounts = calculateNearAmounts();

  // Simulate transaction steps
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    
    if (step === 'fiat') {
      timerId = setTimeout(() => {
        setStep('swap');
      }, 5000);
    } else if (step === 'swap') {
      timerId = setTimeout(() => {
        setStep('complete');
        setLoading(false);
      }, 8000);
    }
    
    return () => clearTimeout(timerId);
  }, [step]);

  return (
    <div className="h-screen bg-gradient-to-b from-white to-ping-50 flex flex-col overflow-hidden">
      <div className="container max-w-3xl mx-auto px-3 py-3 flex flex-col h-full">
        <header className="flex justify-between items-center mb-2">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
              alt="Ping Logo" 
              className="h-7" 
            />
          </Link>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <h1 className="text-xl font-bold mb-1">
              {step === 'complete' ? 'Transaction Complete!' : 'Processing Your Transaction'}
            </h1>
            <p className="text-muted-foreground mb-3 text-sm">
              {step === 'complete' 
                ? `You've successfully purchased ${txDetails.asset}`
                : 'Please wait while we process your transaction.'}
            </p>
            
            {step === 'complete' && (
              <div className="mb-3 flex justify-center">
                <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
            )}
            
            <div className="space-y-2 text-left mb-3">
              <TransactionStatus
                status={step === 'fiat' ? 'pending' : 'completed'}
                title="Fiat to USDC on Base"
                description={`Converting $${txDetails.amount} to USDC via Coinbase Onramp`}
                txHash={step !== 'fiat' ? txDetails.fiatTxHash : undefined}
              />
              
              <TransactionStatus
                status={step === 'fiat' ? 'pending' : (step === 'swap' ? 'pending' : 'completed')}
                title={`USDC to ${txDetails.asset} on NEAR`}
                description={`Converting USDC to ${txDetails.asset} via NEAR Intents`}
                txHash={step === 'complete' ? txDetails.swapTxHash : undefined}
              />
            </div>
            
            <div className="bg-secondary p-3 rounded-md mb-3 text-left text-sm">
              <p className="font-medium mb-1">Transaction Details:</p>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Amount:</span>
                <span>${txDetails.amount}.00 USD</span>
                
                <span className="text-muted-foreground">Asset:</span>
                <span>{txDetails.asset}</span>
                
                <span className="text-muted-foreground">Recipient:</span>
                <span className="break-all">{txDetails.wallet}</span>
                
                <span className="text-muted-foreground">Received {txDetails.asset}:</span>
                <span>{nearAmounts.received} {txDetails.asset}</span>
                
                <span className="text-muted-foreground">Fee:</span>
                <span>{nearAmounts.fee} {txDetails.asset}</span>
              </div>
            </div>
            
            {step === 'complete' ? (
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/">
                  <Button variant="outline" icon={<Home className="h-4 w-4" />}>
                    Back to Home
                  </Button>
                </Link>
                <Link to="/onramp">
                  <Button variant="gradient">
                    Make Another Purchase
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Please don't close this window while your transaction is being processed.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionPage;
