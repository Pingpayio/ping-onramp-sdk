
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import OnrampHeader from '@/components/onramp/OnrampHeader';
import OnrampStepContent from '@/components/onramp/OnrampStepContent';
import { useOnrampState } from '@/hooks/use-onramp-state';
import SidebarNav from '@/components/SidebarNav';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { History } from 'lucide-react';

// Sample history data - in a real app, this would come from an API or state
const sampleHistory = [{
  id: 1,
  date: '2025-05-10',
  asset: 'BTC',
  amount: '0.015',
  fiat: '$500',
  status: 'Completed'
}, {
  id: 2,
  date: '2025-05-05',
  asset: 'ETH',
  amount: '0.35',
  fiat: '$750',
  status: 'Completed'
}, {
  id: 3,
  date: '2025-04-25',
  asset: 'NEAR',
  amount: '125',
  fiat: '$250',
  status: 'Completed'
}, {
  id: 4,
  date: '2025-04-18',
  asset: 'USDC',
  amount: '500',
  fiat: '$500',
  status: 'Failed'
}];
const OnrampPage = () => {
  const isMobile = useIsMobile();
  const {
    currentStep,
    selectedAsset,
    open,
    selectedOnramp,
    walletAddress,
    amount,
    cardNumber,
    steps,
    handleAssetSelect,
    handleOnrampSelect,
    handleWalletAddressChange,
    handleAmountChange,
    handleCardNumberChange,
    handleContinue,
    handleBack,
    canContinue,
    handleStepClick,
    setOpen
  } = useOnrampState();
  return <div className="flex h-screen bg-[#121212] overflow-hidden">
      <SidebarNav />
      
      <div className="flex-1 ml-[256px]">
        <div className="px-[56px] py-[40px] flex flex-col h-full">
          <OnrampHeader />

          <main className="flex-1 flex gap-6 overflow-hidden mt-4">
            {/* Left container - Onramp container (updated padding from p-3 to p-6) */}
            <div className="bg-white/5 rounded-xl shadow-sm p-6 flex-1 overflow-hidden flex flex-col max-w-[720px]">
              <OnrampStepContent currentStep={currentStep} steps={steps} selectedAsset={selectedAsset} amount={amount} onAssetSelect={handleAssetSelect} onAmountChange={handleAmountChange} open={open} setOpen={setOpen} walletAddress={walletAddress} onWalletAddressChange={handleWalletAddressChange} selectedOnramp={selectedOnramp} onOnrampSelect={handleOnrampSelect} handleBack={handleBack} handleContinue={handleContinue} canContinue={canContinue} cardNumber={cardNumber} onCardNumberChange={handleCardNumberChange} />
            </div>
            
            {/* Right container - History container */}
            <div className="bg-white/5 rounded-xl shadow-sm p-6 overflow-hidden flex flex-col w-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-white" />
                <h3 className="text-xl font-medium text-white">Onramp History</h3>
              </div>
              
              <div className="overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/80 text-xs font-medium">Date</TableHead>
                      <TableHead className="text-white/80 text-xs font-medium">Asset</TableHead>
                      <TableHead className="text-white/80 text-xs font-medium text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleHistory.map(tx => <TableRow key={tx.id} className="border-white/10">
                        <TableCell className="text-white/70 text-xs py-2">{tx.date}</TableCell>
                        <TableCell className="text-white/70 text-xs py-2">{tx.asset}</TableCell>
                        <TableCell className="text-white/70 text-xs py-2 text-right">
                          <div>
                            <div className={tx.status === 'Completed' ? 'text-green-400' : 'text-red-400'}>
                              {tx.amount} {tx.asset}
                            </div>
                            <div className="text-white/40 text-[10px]">{tx.fiat}</div>
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
              
              {sampleHistory.length === 0 && <div className="text-white/50 text-center py-8">
                  <p>No transaction history yet.</p>
                </div>}
            </div>
          </main>
        </div>
      </div>
    </div>;
};
export default OnrampPage;
