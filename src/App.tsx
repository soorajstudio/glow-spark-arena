import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "@/contexts/EventContext";
import { ScoreProvider } from "@/contexts/ScoreContext";
import Index from "./pages/Index";
import BreakTheIce from "./pages/BreakTheIce";
import AIPuzzle from "./pages/AIPuzzle";
import AIQuizWheel from "./pages/AIQuizWheel";
import MatchTheLogic from "./pages/MatchTheLogic";
import FinalScoreboard from "./pages/FinalScoreboard";
import AdminEventStudio from "./pages/AdminEventStudio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EventProvider>
        <ScoreProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/break-the-ice" element={<BreakTheIce />} />
              <Route path="/puzzle/:roundId" element={<AIPuzzle />} />
              <Route path="/quiz-wheel" element={<AIQuizWheel />} />
              <Route path="/match" element={<MatchTheLogic />} />
              <Route path="/final" element={<FinalScoreboard />} />
              <Route path="/admin" element={<AdminEventStudio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </ScoreProvider>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
