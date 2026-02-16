import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/contexts/ScoreContext";
import ScoringModal from "./ScoringModal";

interface JudgeControlsProps {
  category: Category;
  question: string;
  onResult: (correct: boolean) => void;
  onClose: () => void;
}

const JudgeControls = ({ category, question, onResult, onClose }: JudgeControlsProps) => {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <AnimatePresence>
      {showScoring ? (
        <ScoringModal
          category={category}
          onClose={() => {
            setShowScoring(false);
            onResult(true);
          }}
        />
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-3xl rounded-xl border border-primary/30 bg-card p-10 box-glow-cyan"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <p className="mb-8 text-center font-body text-2xl leading-relaxed text-foreground md:text-3xl">
              {question}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowScoring(true)}
                className="flex-1 rounded-xl border-2 border-neon-lime/50 bg-neon-lime/10 py-4 font-display text-xl font-bold text-neon-lime transition-all hover:bg-neon-lime/20 hover:shadow-[0_0_20px_hsl(130_100%_50%/0.3)]"
              >
                ✅ Correct Answer
              </button>
              <button
                onClick={() => {
                  onResult(false);
                }}
                className="flex-1 rounded-xl border-2 border-destructive/50 bg-destructive/10 py-4 font-display text-xl font-bold text-destructive transition-all hover:bg-destructive/20 hover:shadow-[0_0_20px_hsl(0_85%_55%/0.3)]"
              >
                ❌ Wrong Answer
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg py-3 font-body text-lg text-muted-foreground transition-colors hover:bg-muted"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JudgeControls;
