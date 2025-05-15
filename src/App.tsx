
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onramp from "./pages/Onramp";
import Transaction from "./pages/Transaction";
import NotFound from "./pages/NotFound";
import MobileTopbar from "./components/MobileTopbar";
import { WalletProvider } from "./hooks/use-wallet-context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileTopbar />
          <Routes>
            <Route path="/" element={<Navigate to="/onramp" replace />} />
            <Route path="/onramp" element={<Onramp />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
