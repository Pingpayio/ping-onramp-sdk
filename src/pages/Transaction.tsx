
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import TransactionStatus from '@/components/TransactionStatus';
import { CheckCircle2, ArrowLeft, Home } from 'lucide-react';

const TransactionPage = () => {
  const [step, setStep] = useState<'fiat' | 'swap' | 'complete'>('fiat');
  const [loading, setLoading] = useState(true);
  
  // Mock transaction details
  const txDetails = {
    amount: 100,
    asset: 'NEAR',
    wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F...',
    fiatTxHash: '0x3a1b3d543d446d8ce36e27c79165c74ef5543a8251a73c0662b5a3cc6e79',
    swapTxHash: '0x8c3a1a7546d985c4e44b9ae414c01f240c5d7f1679be993559fb43bd78a45'
  };

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
    <div className="min-h-screen bg-gradient-to-b from-white to-ping-50">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-ping-600 text-white font-bold text-xl h-10 w-10 rounded-md flex items-center justify-center mr-2">P</div>
            <span className="text-xl font-bold tracking-tight">Pingpay</span>
          </Link>
        </header>

        <main>
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">
              {step === 'complete' ? 'Transaction Complete!' : 'Processing Your Transaction'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {step === 'complete' 
                ? `You've successfully purchased ${txDetails.asset}`
                : 'Please wait while we process your transaction. This might take a few minutes.'}
            </p>
            
            {step === 'complete' && (
              <div className="mb-8 flex justify-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>
            )}
            
            <div className="space-y-4 text-left mb-8">
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
            
            <div className="bg-secondary p-4 rounded-md mb-8 text-left">
              <p className="font-medium mb-2">Transaction Details:</p>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Amount:</span>
                <span>${txDetails.amount}.00 USD</span>
                
                <span className="text-muted-foreground">Asset:</span>
                <span>{txDetails.asset}</span>
                
                <span className="text-muted-foreground">Recipient Wallet:</span>
                <span className="text-sm break-all">{txDetails.wallet}</span>
                
                <span className="text-muted-foreground">Estimated {txDetails.asset}:</span>
                <span>{(txDetails.amount / 8.12).toFixed(2)} {txDetails.asset}</span>
              </div>
            </div>
            
            {step === 'complete' ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
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
              <p className="text-sm text-muted-foreground">
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
