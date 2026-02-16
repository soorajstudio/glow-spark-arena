import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import JudgeControls from "@/components/JudgeControls";
import type { TeamName } from "@/contexts/ScoreContext";

const questions = [
  "What does 'AI hallucination' mean in the context of Generative AI?",
  "Name one ethical concern with using AI to generate deepfakes.",
  "What is a 'prompt' and why does it matter in Generative AI?",
  "Give an example of how AI is used responsibly in healthcare.",
];

const teamNames: TeamName[] = ["Team A", "Team B", "Team C", "Team D"];

const BreakTheIce = () => {
  const [broken, setBroken] = useState<boolean[]>([false, false, false, false]);
  const [activeQ, setActiveQ] = useState<number | null>(null);

  const handleBreak = (idx: number) => {
    if (broken[idx]) return;
    setActiveQ(idx);
  };

  const handleResult = (correct: boolean) => {
    if (activeQ !== null) {
      setBroken((prev) => {
        const n = [...prev];
        n[activeQ] = true;
        return n;
      });
    }
    setActiveQ(null);
  };

  return (
    <GameLayout title="Break the Ice" icon="❄️">
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-8">
        {teamNames.map((team, i) => (
          <motion.button
            key={team}
            disabled={broken[i]}
            onClick={() => handleBreak(i)}
            className={`relative flex h-52 flex-col items-center justify-center rounded-2xl font-display text-3xl font-bold transition-all md:h-64 ${
              broken[i]
                ? "cursor-default border border-muted bg-muted/30 text-muted-foreground"
                : "neon-border-cyan bg-card text-neon-cyan box-glow-cyan cursor-pointer"
            }`}
            animate={
              broken[i]
                ? { scale: 1, opacity: 0.4 }
                : { y: [0, -8, 0] }
            }
            transition={
              broken[i]
                ? { duration: 0.5 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
            whileHover={broken[i] ? {} : { scale: 1.05 }}
            whileTap={broken[i] ? {} : { scale: 0.95 }}
          >
            {!broken[i] && <span className="mb-2 text-5xl">🧊</span>}
            {broken[i] && <span className="mb-2 text-5xl opacity-40">💔</span>}
            <span className={broken[i] ? "text-glow-cyan line-through opacity-50" : "text-glow-cyan"}>
              {team}
            </span>
            {broken[i] && (
              <span className="mt-1 font-body text-sm text-muted-foreground">Answered</span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeQ !== null && (
          <JudgeControls
            category="Break the Ice"
            question={questions[activeQ]}
            onResult={handleResult}
            onClose={() => setActiveQ(null)}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default BreakTheIce;
