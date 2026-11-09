import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Eye, EyeOff, HelpCircle, Image as ImageIcon } from "lucide-react";
import ScoringModal from "./ScoringModal";
import { StageTimer } from "./StageTimer";
import { sound } from "@/lib/sound";

interface OptionItem {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

interface JudgeControlsProps {
  category: string;
  question: string;
  questionImage?: string;
  answer?: string;
  explanation?: string;
  options?: OptionItem[];
  defaultPoints?: number;
  onResult: (correct: boolean) => void;
  onClose: () => void;
}

const JudgeControls = ({
  category,
  question,
  questionImage,
  answer,
  explanation,
  options,
  defaultPoints,
  onResult,
  onClose,
}: JudgeControlsProps) => {
  const [showScoring, setShowScoring] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const toggleAnswerReveal = () => {
    sound.playClick();
    setRevealedAnswer((prev) => !prev);
  };

  return (
    <AnimatePresence>
      {showScoring ? (
        <ScoringModal
          category={category}
          defaultPoints={defaultPoints}
          onClose={() => {
            setShowScoring(false);
            onResult(true);
          }}
        />
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 md:p-6 backdrop-blur-md overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="my-auto w-full max-w-4xl rounded-2xl border border-primary/40 bg-card p-6 md:p-8 shadow-2xl box-glow-cyan"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            {/* Stage Bar: Category + Stage Timer */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-primary/20 px-3 py-1 font-display text-xs font-bold text-primary tracking-wider uppercase">
                  {category}
                </span>
                <span className="text-xs text-muted-foreground">Projector Stage View</span>
              </div>
              <StageTimer initialSeconds={30} />
            </div>

            {/* Question Display */}
            <div className="mb-6 space-y-4">
              <h2 className="font-display text-2xl font-bold leading-relaxed text-foreground md:text-3xl">
                {question}
              </h2>

              {/* Optional Question Image */}
              {questionImage && (
                <div className="flex justify-center overflow-hidden rounded-xl border border-primary/30 bg-muted/20 p-2">
                  <img
                    src={questionImage}
                    alt="Question visual"
                    className="max-h-72 w-auto max-w-full rounded-lg object-contain shadow-md"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Multiple Choice Options (if present) */}
              {options && options.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                  {options.map((opt, i) => {
                    const letters = ["A", "B", "C", "D", "E", "F"];
                    const isCorrectAnswer = opt.isCorrect;
                    const showCorrectHighlight = revealedAnswer && isCorrectAnswer;

                    return (
                      <div
                        key={opt.id || i}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          showCorrectHighlight
                            ? "border-neon-lime bg-neon-lime/15 text-neon-lime box-glow-lime font-bold"
                            : "border-border bg-muted/30 text-foreground"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                            showCorrectHighlight
                              ? "bg-neon-lime text-background font-black"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {letters[i % letters.length]}
                        </span>

                        {opt.imageUrl && (
                          <img
                            src={opt.imageUrl}
                            alt="Option"
                            className="h-12 w-12 rounded object-cover border border-border"
                          />
                        )}

                        <span className="font-body text-base md:text-lg flex-1">
                          {opt.text}
                        </span>

                        {showCorrectHighlight && (
                          <span className="text-xs font-bold uppercase tracking-wider text-neon-lime">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Answer & Explanation reveal container */}
            <div className="mb-6 rounded-xl border border-border/80 bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <HelpCircle size={16} /> Official Answer & Insights
                </span>
                <button
                  type="button"
                  onClick={toggleAnswerReveal}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
                >
                  {revealedAnswer ? (
                    <>
                      <EyeOff size={14} /> Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> Reveal Answer
                    </>
                  )}
                </button>
              </div>

              {revealedAnswer && (
                <motion.div
                  className="mt-3 space-y-2 border-t border-border/60 pt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {answer && (
                    <div className="font-display text-lg font-bold text-neon-lime">
                      ✅ {answer}
                    </div>
                  )}
                  {explanation && (
                    <div className="font-body text-sm leading-relaxed text-muted-foreground">
                      💡 {explanation}
                    </div>
                  )}
                  {!answer && !explanation && options && (
                    <div className="font-body text-sm text-neon-lime">
                      Option {options.findIndex((o) => o.isCorrect) >= 0 ? ["A", "B", "C", "D"][options.findIndex((o) => o.isCorrect)] : "marked above"} is the correct solution.
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Decision Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowScoring(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-neon-lime/60 bg-neon-lime/15 py-4 font-display text-xl font-bold text-neon-lime transition-all hover:bg-neon-lime/25 hover:shadow-[0_0_25px_hsl(130_100%_50%/0.35)]"
              >
                <Check size={22} />
                Correct Answer
              </button>
              <button
                onClick={() => {
                  sound.playWrong();
                  onResult(false);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-destructive/60 bg-destructive/15 py-4 font-display text-xl font-bold text-destructive transition-all hover:bg-destructive/25 hover:shadow-[0_0_25px_hsl(0_90%_60%/0.35)]"
              >
                <X size={22} />
                Wrong / No Points
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="mt-4 w-full rounded-xl py-2.5 font-body text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Dismiss / Close Question
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JudgeControls;
