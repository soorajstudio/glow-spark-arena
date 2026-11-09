import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import GameLayout from "@/components/GameLayout";
import JudgeControls from "@/components/JudgeControls";
import { useEvent, type QuizQuestion } from "@/contexts/EventContext";
import { sound } from "@/lib/sound";
import { RotateCw, Sparkles, HelpCircle } from "lucide-react";

export const AIQuizWheel = () => {
  const { eventData } = useEvent();
  const categories = eventData.quizWheel.categories;

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Record<string, number>>({});

  const spin = () => {
    if (spinning || categories.length === 0) return;
    setSpinning(true);
    setSelectedCat(null);

    // Audio cue
    sound.playClick();

    // Sound ticks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 140);

    const extraSpins = 5 + Math.random() * 4;
    const finalAngle = rotation + extraSpins * 360 + Math.random() * 360;
    setRotation(finalAngle);

    setTimeout(() => {
      clearInterval(tickInterval);
      const normalized = finalAngle % 360;
      const segAngle = 360 / categories.length;
      // Pointer sits at the top (90 deg offset)
      const idx =
        Math.floor(((360 - (normalized % 360) + segAngle / 2) % 360) / segAngle) %
        categories.length;
      const cat = categories[idx];

      sound.playReveal();
      setSelectedCat(cat.name);
      setSpinning(false);

      // Select next unused question in this category
      const qIndex = usedQuestions[cat.id] || 0;
      const q = cat.questions[qIndex % Math.max(1, cat.questions.length)];

      if (q) {
        setTimeout(() => {
          setActiveQuestion(q);
        }, 800);
      }
      setUsedQuestions((prev) => ({ ...prev, [cat.id]: qIndex + 1 }));
    }, 4000);
  };

  const handleResult = (correct: boolean) => {
    if (correct) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
    }
    setActiveQuestion(null);
    setSelectedCat(null);
  };

  const segAngle = categories.length > 0 ? 360 / categories.length : 360;

  return (
    <GameLayout
      title={eventData.quizWheel.title || "AI Quiz Wheel"}
      icon="🎡"
      subtitle="Spin the Quantum Wheel & Tackle Category Challenges Under Pressure"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 py-4">
        {/* Pointer & Wheel Arena */}
        <div className="relative mt-2 flex flex-col items-center">
          {/* Neon Pointer Arrow */}
          <div className="relative z-20 -mb-5 flex flex-col items-center">
            <div className="h-0 w-0 border-x-8 border-t-[18px] border-x-transparent border-t-neon-amber drop-shadow-[0_0_10px_hsl(40_100%_55%)]" />
          </div>

          {/* The Spinning Wheel */}
          <motion.div
            className="relative h-80 w-80 rounded-full border-4 border-primary/50 shadow-2xl md:h-[400px] md:w-[400px] box-glow-cyan"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
          >
            {categories.map((cat, i) => {
              const startAngle = i * segAngle;
              return (
                <div
                  key={cat.id || i}
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    clipPath: `polygon(50% 50%, ${
                      50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                    }% ${
                      50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                    }%, ${
                      50 + 50 * Math.cos(((startAngle + segAngle - 90) * Math.PI) / 180)
                    }% ${
                      50 + 50 * Math.sin(((startAngle + segAngle - 90) * Math.PI) / 180)
                    }%)`,
                    backgroundColor: cat.color || "hsl(185, 100%, 50%)",
                    opacity: selectedCat === cat.name ? 1 : 0.85,
                  }}
                >
                  <span
                    className="font-display text-xs font-black tracking-wider text-background drop-shadow md:text-sm"
                    style={{
                      transform: `rotate(${startAngle + segAngle / 2}deg) translateY(-80px)`,
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transformOrigin: "0 0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}

            {/* Quantum Core Hub in Center */}
            <div className="absolute inset-[32%] flex flex-col items-center justify-center rounded-full border-4 border-primary/60 bg-background/95 backdrop-blur shadow-inner">
              <span className="text-2xl">⚡</span>
              <span className="font-display text-[10px] font-black tracking-widest text-primary uppercase">
                SPIN
              </span>
            </div>
          </motion.div>
        </div>

        {/* Spin Action Button */}
        <motion.button
          onClick={spin}
          disabled={spinning}
          className="flex items-center gap-3 rounded-2xl border-2 border-primary/70 bg-gradient-to-r from-primary/20 via-neon-magenta/20 to-primary/20 px-12 py-5 font-display text-2xl font-black text-primary transition-all hover:bg-primary/30 box-glow-cyan disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCw size={26} className={spinning ? "animate-spin" : ""} />
          {spinning ? "SPINNING WHEEL..." : "SPIN THE WHEEL!"}
        </motion.button>

        {/* Category Result Banner */}
        {selectedCat && !spinning && (
          <motion.div
            className="rounded-2xl border border-primary/40 bg-card/80 px-8 py-3 text-center backdrop-blur-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Selected Arena
            </span>
            <div className="font-display text-3xl font-black text-primary text-glow-cyan">
              {selectedCat}
            </div>
          </motion.div>
        )}
      </div>

      {/* Question Modal with Options, Image, and Timer */}
      <AnimatePresence>
        {activeQuestion && !spinning && (
          <JudgeControls
            category="Quiz"
            question={activeQuestion.question}
            questionImage={activeQuestion.questionImage}
            options={activeQuestion.options}
            explanation={activeQuestion.explanation}
            defaultPoints={activeQuestion.points || eventData.settings.directPoints}
            onResult={handleResult}
            onClose={() => {
              setActiveQuestion(null);
              setSelectedCat(null);
            }}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default AIQuizWheel;
