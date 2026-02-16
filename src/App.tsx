import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScoreProvider } from "@/contexts/ScoreContext";
import Index from "./pages/Index";
import BreakTheIce from "./pages/BreakTheIce";
import AIPuzzle from "./pages/AIPuzzle";
import AIQuizWheel from "./pages/AIQuizWheel";
import MatchTheLogic from "./pages/MatchTheLogic";
import FinalScoreboard from "./pages/FinalScoreboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/break-the-ice" element={<BreakTheIce />} />
            <Route path="/puzzle" element={<AIPuzzle />} />
            <Route path="/quiz-wheel" element={<AIQuizWheel />} />
            <Route path="/match" element={<MatchTheLogic />} />
            <Route path="/final" element={<FinalScoreboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ScoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
