import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import GameLayout from "@/components/GameLayout";
import JudgeControls from "@/components/JudgeControls";

const segments = [
  { label: "AI Basics", color: "hsl(185, 100%, 50%)" },
  { label: "GenAI", color: "hsl(300, 100%, 55%)" },
  { label: "Prompts", color: "hsl(130, 100%, 50%)" },
  { label: "Ethics", color: "hsl(40, 100%, 55%)" },
];

const questionsBySegment: Record<string, string[]> = {
  "AI Basics": [
    "What does AI stand for and what is its primary goal?",
    "Name three types of machine learning.",
    "What is the difference between narrow AI and general AI?",
  ],
  GenAI: [
    "What is Generative AI and how does it differ from traditional AI?",
    "Name two popular Generative AI tools and their use cases.",
    "What are the risks of using GenAI for content creation?",
  ],
  Prompts: [
    "What makes a good AI prompt? Give an example.",
    "Explain the concept of 'chain-of-thought' prompting.",
    "How does providing context improve AI responses?",
  ],
  Ethics: [
    "What is algorithmic bias and why should we care?",
    "Should AI-generated art be copyrighted? Why or why not?",
    "How can we ensure AI is used responsibly in education?",
  ],
};

const AIQuizWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Record<string, number>>({});

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    const extraSpins = 5 + Math.random() * 5;
    const finalAngle = rotation + extraSpins * 360 + Math.random() * 360;
    setRotation(finalAngle);

    setTimeout(() => {
      const normalized = finalAngle % 360;
      const segAngle = 360 / segments.length;
      // pointer at top (0°), rotation goes clockwise
      const idx = Math.floor(((360 - normalized + segAngle / 2) % 360) / segAngle) % segments.length;
      const seg = segments[idx];
      setSelected(seg.label);
      setSpinning(false);

      const qIdx = usedQuestions[seg.label] || 0;
      const questions = questionsBySegment[seg.label];
      setActiveQ(questions[qIdx % questions.length]);
      setUsedQuestions((prev) => ({ ...prev, [seg.label]: qIdx + 1 }));
    }, 4000);
  };

  const handleResult = (correct: boolean) => {
    if (correct) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    setActiveQ(null);
    setSelected(null);
  };

  const segAngle = 360 / segments.length;

  return (
    <GameLayout title="AI Quiz Wheel" icon="🎡">
      <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-8">
        {/* Pointer */}
        <div className="relative">
          <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 text-4xl">▼</div>
          {/* Wheel */}
          <motion.div
            className="relative h-80 w-80 rounded-full border-4 border-primary/50 md:h-96 md:w-96"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
          >
            {segments.map((seg, i) => {
              const startAngle = i * segAngle;
              return (
                <div
                  key={seg.label}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((startAngle + segAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle + segAngle - 90) * Math.PI) / 180)}%)`,
                    backgroundColor: seg.color,
                    opacity: selected === seg.label ? 1 : 0.7,
                  }}
                >
                  <span
                    className="font-display text-sm font-bold text-background md:text-base"
                    style={{
                      transform: `rotate(${startAngle + segAngle / 2}deg) translateY(-60px)`,
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transformOrigin: "0 0",
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
            <div className="absolute inset-[35%] rounded-full bg-background border-2 border-primary/30" />
          </motion.div>
        </div>

        <motion.button
          onClick={spin}
          disabled={spinning}
          className="rounded-xl border-2 border-primary/50 bg-primary/10 px-12 py-5 font-display text-3xl font-bold text-primary transition-all hover:bg-primary/20 box-glow-cyan disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {spinning ? "Spinning..." : "🎰 SPIN!"}
        </motion.button>

        {selected && !spinning && (
          <motion.p
            className="font-display text-2xl text-foreground"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            Category: <span className="text-primary text-glow-cyan">{selected}</span>
          </motion.p>
        )}
      </div>

      <AnimatePresence>
        {activeQ && !spinning && (
          <JudgeControls
            category="Quiz"
            question={activeQ}
            onResult={handleResult}
            onClose={() => {
              setActiveQ(null);
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default AIQuizWheel;
