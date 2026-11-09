import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import JudgeControls from "@/components/JudgeControls";
import { useEvent } from "@/contexts/EventContext";
import { sound } from "@/lib/sound";
import { RotateCcw, Sparkles } from "lucide-react";

export const BreakTheIce = () => {
  const { eventData } = useEvent();
  const questions = eventData.breakTheIce.questions;

  // Track which questions have been broken
  const [brokenState, setBrokenState] = useState<Record<string, boolean>>({});
  const [activeQIndex, setActiveQIndex] = useState<number | null>(null);

  const handleBreak = (idx: number) => {
    const q = questions[idx];
    if (!q || brokenState[q.id]) return;
    sound.playReveal();
    setActiveQIndex(idx);
  };

  const handleResult = (correct: boolean) => {
    if (activeQIndex !== null) {
      const q = questions[activeQIndex];
      setBrokenState((prev) => ({ ...prev, [q.id]: true }));
    }
    setActiveQIndex(null);
  };

  const resetCubes = () => {
    sound.playBuzzer();
    setBrokenState({});
  };

  const activeQuestion = activeQIndex !== null ? questions[activeQIndex] : null;

  return (
    <GameLayout
      title={eventData.breakTheIce.title || "Break the Ice"}
      icon="❄️"
      subtitle="Shatter Cyber Ice Cubes to Reveal Rapid Questions!"
    >
      <div className="mx-auto max-w-5xl">
        {/* Stage Subhead & Reset */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary/20 px-3 py-1 font-display text-xs font-bold text-primary">
                ROUND 1
              </span>
              <span className="font-display text-sm text-muted-foreground">
                Rapid Ice-Breaker Stage
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Click any active shield to shatter the barrier and display the question on screen.
            </p>
          </div>

          <button
            onClick={resetCubes}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2 font-display text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground"
            title="Reset shattered ice blocks"
          >
            <RotateCcw size={14} /> Re-freeze Cubes
          </button>
        </div>

        {/* Ice Shields Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {questions.map((q, i) => {
            const isBroken = !!brokenState[q.id];
            // Assign a team name if applicable, or use Question #
            const assignedTeam = eventData.teams[i % eventData.teams.length];

            return (
              <motion.button
                key={q.id}
                disabled={isBroken}
                onClick={() => handleBreak(i)}
                className={`group relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-3xl border-2 p-8 text-center transition-all ${
                  isBroken
                    ? "cursor-default border-border/40 bg-card/30 text-muted-foreground opacity-50"
                    : "cursor-pointer border-primary/50 bg-gradient-to-b from-card/90 to-card/50 text-foreground shadow-xl box-glow-cyan hover:border-primary hover:scale-[1.03]"
                }`}
                animate={
                  isBroken
                    ? { scale: 1, opacity: 0.4 }
                    : { y: [0, -6, 0] }
                }
                transition={
                  isBroken
                    ? { duration: 0.4 }
                    : { duration: 3.5 + (i % 2), repeat: Infinity, ease: "easeInOut" }
                }
                whileTap={isBroken ? {} : { scale: 0.96 }}
              >
                {/* Background decorative glow */}
                {!isBroken && (
                  <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
                )}

                <div className="mb-3 text-6xl">
                  {isBroken ? "💔" : "🧊"}
                </div>

                <div className="space-y-1">
                  <div className="font-display text-xs font-bold uppercase tracking-widest text-primary">
                    Shield #{i + 1}
                  </div>
                  <h3
                    className={`font-display text-2xl font-black ${
                      isBroken ? "line-through opacity-60" : "text-foreground text-glow-cyan"
                    }`}
                  >
                    {assignedTeam ? `${assignedTeam.name}` : `Challenge ${i + 1}`}
                  </h3>
                </div>

                {isBroken ? (
                  <span className="mt-3 rounded-full bg-muted/60 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    ✓ Shattered & Scored
                  </span>
                ) : (
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-xs font-bold text-neon-cyan opacity-80 group-hover:opacity-100">
                    <Sparkles size={13} /> Click to Shatter
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Question Modal with Timer & Controls */}
      <AnimatePresence>
        {activeQuestion && (
          <JudgeControls
            category="Break the Ice"
            question={activeQuestion.question}
            questionImage={activeQuestion.imageUrl}
            explanation={activeQuestion.hint}
            defaultPoints={activeQuestion.points || eventData.settings.directPoints}
            onResult={handleResult}
            onClose={() => setActiveQIndex(null)}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default BreakTheIce;
