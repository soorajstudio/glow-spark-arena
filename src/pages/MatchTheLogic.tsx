import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import ScoringModal from "@/components/ScoringModal";
import { useEvent } from "@/contexts/EventContext";
import { sound } from "@/lib/sound";
import { Link2, RotateCcw, Check, Sparkles } from "lucide-react";

export const MatchTheLogic = () => {
  const { eventData } = useEvent();
  const pairs = eventData.matchTheLogic.pairs;

  const [selectedTermIdx, setSelectedTermIdx] = useState<number | null>(null);
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);
  const [showScoring, setShowScoring] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Shuffled definitions order
  const defOrder = useMemo(() => {
    const arr = pairs.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs, shuffleSeed]);

  const handleTermClick = (i: number) => {
    if (matchedIndices.has(i)) return;
    sound.playClick();
    setSelectedTermIdx(i);
  };

  const handleDefClick = (origIdx: number) => {
    if (selectedTermIdx === null || matchedIndices.has(origIdx)) return;

    if (selectedTermIdx === origIdx) {
      // Correct Match!
      sound.playCorrect();
      setMatchedIndices((prev) => new Set(prev).add(origIdx));
      setSelectedTermIdx(null);
      setShowScoring(true);
    } else {
      // Wrong Match
      sound.playWrong();
      setShakingIdx(origIdx);
      setTimeout(() => {
        setShakingIdx(null);
        setSelectedTermIdx(null);
      }, 600);
    }
  };

  const resetBoard = () => {
    sound.playBuzzer();
    setSelectedTermIdx(null);
    setMatchedIndices(new Set());
    setShuffleSeed((prev) => prev + 1);
  };

  const allMatched = pairs.length > 0 && matchedIndices.size === pairs.length;

  return (
    <GameLayout
      title={eventData.matchTheLogic.title || "Match the Logic"}
      icon="🔗"
      subtitle="Connect Engineering & AI Concepts to Their Exact Technical Definition"
    >
      <div className="mx-auto max-w-6xl">
        {/* Stage Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-neon-amber/20 px-3 py-1 font-display text-xs font-bold text-neon-amber">
                MATCH MATRIX
              </span>
              <span className="font-display text-sm text-muted-foreground">
                Matched: {matchedIndices.size} / {pairs.length} Pairs
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a concept on the left, then click its corresponding definition on the right.
            </p>
          </div>

          <button
            onClick={resetBoard}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2 font-display text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground"
          >
            <RotateCcw size={14} /> Reshuffle Board
          </button>
        </div>

        {/* The Two Matrix Columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column: Terms */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Sparkles size={16} /> Concepts & Technologies
            </h3>

            <div className="space-y-3">
              {pairs.map((p, i) => {
                const isMatched = matchedIndices.has(i);
                const isSelected = selectedTermIdx === i;

                return (
                  <motion.button
                    key={`term-${p.id || i}`}
                    onClick={() => handleTermClick(i)}
                    disabled={isMatched}
                    className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                      isMatched
                        ? "border-neon-lime/60 bg-neon-lime/10 text-neon-lime cursor-default"
                        : isSelected
                        ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_hsl(185_100%_50%/0.35)] scale-[1.02]"
                        : "border-border/80 bg-card/75 text-foreground hover:border-primary/50 hover:bg-card"
                    }`}
                    whileHover={isMatched ? {} : { scale: 1.02 }}
                    whileTap={isMatched ? {} : { scale: 0.98 }}
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {p.termImage && (
                          <img
                            src={p.termImage}
                            alt={p.term}
                            className="h-10 w-10 rounded-lg object-cover border border-border"
                          />
                        )}
                        <span className="font-display text-lg font-bold">
                          {p.term}
                        </span>
                      </div>
                      {isMatched && <Check size={20} className="text-neon-lime" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Definitions */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neon-magenta flex items-center gap-2">
              <Sparkles size={16} /> Architectural Specifications
            </h3>

            <div className="space-y-3">
              {defOrder.map((origIdx) => {
                const p = pairs[origIdx];
                if (!p) return null;
                const isMatched = matchedIndices.has(origIdx);
                const isShaking = shakingIdx === origIdx;

                return (
                  <motion.button
                    key={`def-${origIdx}`}
                    onClick={() => handleDefClick(origIdx)}
                    disabled={isMatched}
                    className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                      isMatched
                        ? "border-neon-lime/60 bg-neon-lime/10 text-neon-lime cursor-default"
                        : "border-border/80 bg-card/75 text-foreground hover:border-neon-magenta/60 hover:bg-card"
                    }`}
                    animate={
                      isShaking
                        ? { x: [-10, 10, -10, 10, 0], borderColor: "hsl(0, 90%, 60%)" }
                        : {}
                    }
                    transition={isShaking ? { duration: 0.5 } : {}}
                    whileHover={isMatched ? {} : { scale: 1.02 }}
                    whileTap={isMatched ? {} : { scale: 0.98 }}
                    layout
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {p.definitionImage && (
                          <img
                            src={p.definitionImage}
                            alt="Definition diagram"
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border"
                          />
                        )}
                        <span className="font-body text-sm md:text-base leading-relaxed">
                          {p.definition}
                        </span>
                      </div>
                      {isMatched && <Check size={20} className="text-neon-lime shrink-0" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Modal when a pair is successfully matched */}
      <AnimatePresence>
        {showScoring && (
          <ScoringModal
            category="Match"
            defaultPoints={10}
            onClose={() => setShowScoring(false)}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default MatchTheLogic;
