import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import ScoringModal from "@/components/ScoringModal";

const pairs = [
  { term: "Hallucination", definition: "AI generates plausible but incorrect information" },
  { term: "Prompt Engineering", definition: "Crafting inputs to get better AI outputs" },
  { term: "Bias", definition: "Systematic unfairness in AI predictions" },
  { term: "Fine-tuning", definition: "Adapting a pre-trained model to a specific task" },
  { term: "Token", definition: "A unit of text processed by a language model" },
  { term: "Reinforcement Learning", definition: "Training AI through rewards and penalties" },
];

const MatchTheLogic = () => {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [shaking, setShaking] = useState<number | null>(null);
  const [showScoring, setShowScoring] = useState(false);

  // shuffle definitions
  const [defOrder] = useState(() => {
    const arr = pairs.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const handleDefClick = (defIdx: number) => {
    if (selectedTerm === null || matched.has(defIdx)) return;

    if (selectedTerm === defIdx) {
      // correct match
      setMatched((prev) => new Set(prev).add(defIdx));
      setSelectedTerm(null);
      setShowScoring(true);
    } else {
      // wrong match
      setShaking(defIdx);
      setTimeout(() => {
        setShaking(null);
        setSelectedTerm(null);
      }, 600);
    }
  };

  return (
    <GameLayout title="Match the Logic" icon="🔗">
      <div className="mx-auto mt-8 flex max-w-5xl gap-8">
        {/* Terms column */}
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-display text-xl text-muted-foreground">Terms</h3>
          {pairs.map((p, i) => (
            <motion.button
              key={`term-${i}`}
              onClick={() => !matched.has(i) && setSelectedTerm(i)}
              className={`rounded-xl border-2 px-6 py-5 text-left font-display text-xl font-bold transition-all ${
                matched.has(i)
                  ? "border-neon-lime/50 bg-neon-lime/10 text-neon-lime"
                  : selectedTerm === i
                  ? "border-primary bg-primary/20 text-primary box-glow-cyan"
                  : "border-muted bg-card text-foreground hover:border-primary/50"
              }`}
              whileHover={matched.has(i) ? {} : { scale: 1.03 }}
              whileTap={matched.has(i) ? {} : { scale: 0.97 }}
              layout
            >
              {matched.has(i) && <span className="mr-2">✅</span>}
              {p.term}
            </motion.button>
          ))}
        </div>

        {/* Definitions column */}
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-display text-xl text-muted-foreground">Definitions</h3>
          {defOrder.map((origIdx) => (
            <motion.button
              key={`def-${origIdx}`}
              onClick={() => handleDefClick(origIdx)}
              className={`rounded-xl border-2 px-6 py-5 text-left font-body text-lg transition-all ${
                matched.has(origIdx)
                  ? "border-neon-lime/50 bg-neon-lime/10 text-neon-lime"
                  : "border-muted bg-card text-foreground hover:border-neon-magenta/50"
              }`}
              animate={
                shaking === origIdx
                  ? { x: [-8, 8, -8, 8, 0], borderColor: "hsl(0, 85%, 55%)" }
                  : {}
              }
              transition={shaking === origIdx ? { duration: 0.5 } : {}}
              whileHover={matched.has(origIdx) ? {} : { scale: 1.03 }}
              layout
            >
              {matched.has(origIdx) && <span className="mr-2">✅</span>}
              {pairs[origIdx].definition}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showScoring && (
          <ScoringModal
            category="Match"
            onClose={() => setShowScoring(false)}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default MatchTheLogic;
