import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import JudgeControls from "@/components/JudgeControls";

const puzzleQuestions = [
  "What is the difference between AI and Machine Learning?",
  "Explain what 'few-shot prompting' means.",
  "How can AI help farmers in developing countries?",
  "Why is bias in AI training data a problem?",
  "What is a Large Language Model (LLM)?",
  "Give an example of a bad prompt vs. a good prompt.",
  "What does 'Responsible AI' mean to you?",
  "Name an AI tool you use in daily life and explain how it works.",
  "What is 'data privacy' and why does it matter with AI?",
];

const AIPuzzle = () => {
  const [revealed, setRevealed] = useState<boolean[]>(Array(9).fill(false));
  const [flipped, setFlipped] = useState<number | null>(null);
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [shaking, setShaking] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    if (revealed[idx] || flipped !== null) return;
    setFlipped(idx);
    setActiveQ(idx);
  };

  const handleResult = (correct: boolean) => {
    if (activeQ === null) return;
    if (correct) {
      setRevealed((prev) => {
        const n = [...prev];
        n[activeQ] = true;
        return n;
      });
      setFlipped(null);
      setActiveQ(null);
    } else {
      setShaking(activeQ);
      setTimeout(() => {
        setShaking(null);
        setFlipped(null);
        setActiveQ(null);
      }, 600);
    }
  };

  return (
    <GameLayout title="AI Puzzle" icon="🧩">
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-4">
        {puzzleQuestions.map((q, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            className={`relative flex h-32 items-center justify-center rounded-xl font-display text-xl font-bold transition-all md:h-40 ${
              revealed[i]
                ? "border border-neon-lime/30 bg-neon-lime/10 text-neon-lime"
                : "neon-border-magenta bg-card text-neon-magenta box-glow-magenta cursor-pointer"
            }`}
            animate={
              shaking === i
                ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.5 } }
                : {}
            }
            whileHover={revealed[i] ? {} : { scale: 1.05, rotateY: 10 }}
            whileTap={revealed[i] ? {} : { scale: 0.95 }}
          >
            {revealed[i] ? (
              <span className="text-3xl">✅</span>
            ) : (
              <span className="text-4xl">🧩</span>
            )}
            <span className="absolute bottom-2 right-3 font-body text-xs text-muted-foreground">
              #{i + 1}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeQ !== null && flipped !== null && (
          <JudgeControls
            category="Puzzle"
            question={puzzleQuestions[activeQ]}
            onResult={handleResult}
            onClose={() => {
              setFlipped(null);
              setActiveQ(null);
            }}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default AIPuzzle;
