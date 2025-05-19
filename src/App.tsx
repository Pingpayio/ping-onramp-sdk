import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MobileTopbar from "./components/MobileTopbar";
import { WalletProvider } from "./hooks/use-wallet-context";
import NotFound from "./pages/NotFound";
import Onramp from "./pages/Onramp";
import Transaction from "./pages/Transaction";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <BrowserRouter>
          <MobileTopbar />
          <Routes>
            <Route path="/" element={<Navigate to="/onramp" replace />} />
            <Route path="/onramp" element={<Onramp />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
