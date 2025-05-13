
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onramp from "./pages/Onramp";
import Transaction from "./pages/Transaction";
import Points from "./pages/Points";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onramp" replace />} />
          <Route path="/onramp" element={<Onramp />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/points" element={<Points />} />
          <Route path="/dashboard" element={<Navigate to="/onramp" replace />} />
          <Route path="/markets" element={<Navigate to="/onramp" replace />} />
          <Route path="/stats" element={<Navigate to="/onramp" replace />} />
          <Route path="/referrals" element={<Navigate to="/onramp" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
