import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import { useEvent, type Team } from "@/contexts/EventContext";
import {
  Brain,
  Globe,
  MessageSquare,
  Bot,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { sound } from "@/lib/sound";

const POINTS_MAP: Record<number, number> = { 1: 15, 2: 10, 3: 5, 4: 2 };
const MAX_BLOCKS = 4;

export const AIPuzzle = () => {
  const { eventData, addScore } = useEvent();
  const { roundId } = useParams();
  const navigate = useNavigate();

  const puzzles = eventData.puzzles;
  const currentRoundIndex = Math.max(
    0,
    Math.min(Number(roundId) || 0, puzzles.length - 1)
  );
  const round = puzzles[currentRoundIndex] || puzzles[0];

  const [removedBlocks, setRemovedBlocks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const blocksRevealed = removedBlocks.length;
  const currentPoints = POINTS_MAP[blocksRevealed] ?? 2;

  const handleBlockClick = (idx: number) => {
    if (removedBlocks.includes(idx) || revealed || roundComplete) return;
    sound.playReveal();
    const next = [...removedBlocks, idx];
    setRemovedBlocks(next);
    if (next.length >= MAX_BLOCKS) {
      // Once 4 blocks are opened, automatically reveal the rest if desired or keep going
    }
  };

  const handleAwardPoints = (team: Team) => {
    sound.playCorrect();
    addScore(team.id, "Puzzle", currentPoints, `Solved: ${round.answer}`);
    setShowTeamSelect(false);
    setRevealed(true);
    setRoundComplete(true);
  };

  const handleShowAnswer = () => {
    sound.playVictory();
    setRevealed(true);
    setRoundComplete(true);
  };

  const switchRound = (newIndex: number) => {
    sound.playClick();
    setRemovedBlocks([]);
    setRevealed(false);
    setShowTeamSelect(false);
    setRoundComplete(false);
    navigate(`/puzzle/${newIndex}`);
  };

  // Render icon fallback if no image
  const renderFallbackIcon = () => {
    switch (round.iconName) {
      case "Globe":
        return <Globe className="h-full w-full text-secondary" />;
      case "MessageSquare":
        return <MessageSquare className="h-full w-full text-neon-lime" />;
      case "Bot":
        return <Bot className="h-full w-full text-neon-amber" />;
      default:
        return <Brain className="h-full w-full text-primary" />;
    }
  };

  return (
    <GameLayout
      title="AI Mystery Puzzle"
      icon="🧩"
      subtitle={`Round ${currentRoundIndex + 1} of ${puzzles.length}: ${round.title}`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Round Switcher Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-neon-magenta/20 px-3 py-1 font-display text-xs font-bold text-neon-magenta">
              PUZZLE STAGE
            </span>
            <span className="font-display text-base font-bold text-foreground">
              {round.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentRoundIndex === 0}
              onClick={() => switchRound(currentRoundIndex - 1)}
              className="flex items-center gap-1 rounded-xl border border-border bg-card/60 px-3 py-1.5 font-display text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev Round
            </button>
            <span className="font-display text-xs font-bold text-primary">
              {currentRoundIndex + 1} / {puzzles.length}
            </span>
            <button
              disabled={currentRoundIndex >= puzzles.length - 1}
              onClick={() => switchRound(currentRoundIndex + 1)}
              className="flex items-center gap-1 rounded-xl border border-border bg-card/60 px-3 py-1.5 font-display text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground disabled:opacity-40"
            >
              Next Round <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="flex flex-col gap-8 lg:flex-row items-start">
          {/* Left: 3x3 Tile Grid */}
          <div className="flex-1 w-full max-w-md mx-auto">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 border-primary/40 bg-card shadow-2xl box-glow-cyan">
              {/* Revealed Visual (Image or Icon) */}
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/40">
                {round.imageUrl ? (
                  <img
                    src={round.imageUrl}
                    alt="Mystery Subject"
                    className="h-full w-full object-contain rounded-2xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="p-12 h-full w-full flex items-center justify-center">
                    {renderFallbackIcon()}
                  </div>
                )}
              </div>

              {/* Secret Answer Banner */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 z-20 border-t border-primary/40 bg-card/95 py-4 px-4 text-center backdrop-blur-md"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-xs font-bold uppercase tracking-widest text-primary">
                      Identity Revealed
                    </div>
                    <div className="font-display text-2xl font-black text-neon-lime text-glow-lime">
                      {round.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3x3 Covering Tiles */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 p-2 z-10">
                {Array.from({ length: 9 }).map((_, i) => {
                  const isRemoved = removedBlocks.includes(i) || revealed;
                  return (
                    <div key={i} className="relative">
                      <AnimatePresence>
                        {!isRemoved && (
                          <motion.button
                            onClick={() => handleBlockClick(i)}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-neon-magenta/50 bg-gradient-to-br from-card to-muted font-display text-3xl font-black text-neon-magenta shadow-lg hover:border-neon-magenta hover:bg-neon-magenta/10"
                            initial={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.1,
                              rotate: 90,
                              transition: { duration: 0.4 },
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {i + 1}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 text-center font-display text-xs text-muted-foreground uppercase tracking-widest">
              Click any tile number to expose a progressive deduction clue
            </p>
          </div>

          {/* Right: Clue Log & Scoring Controls */}
          <div className="flex w-full flex-1 flex-col gap-5">
            {/* Clue Log Container */}
            <div className="rounded-2xl border border-primary/30 bg-card/75 p-6 backdrop-blur-xl shadow-xl box-glow-cyan">
              <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-display text-lg font-bold text-primary text-glow-cyan flex items-center gap-2">
                  <Sparkles size={18} /> Exposed Clue Feed
                </h3>
                <span className="font-display text-xs font-bold text-muted-foreground">
                  {blocksRevealed} / 9 Tiles Open
                </span>
              </div>

              <div className="min-h-[160px] space-y-2.5 max-h-80 overflow-y-auto pr-1">
                <AnimatePresence>
                  {removedBlocks.map((blockIdx) => (
                    <motion.div
                      key={`clue-${blockIdx}`}
                      className="flex items-start gap-2.5 rounded-xl border border-neon-lime/40 bg-neon-lime/10 p-3 text-sm font-medium text-neon-lime shadow-sm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neon-lime/20 font-display text-xs font-bold">
                        {blockIdx + 1}
                      </span>
                      <span className="font-body text-sm leading-relaxed text-foreground">
                        {round.clues[blockIdx]}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {blocksRevealed === 0 && !revealed && (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <HelpCircle size={32} className="mb-2 opacity-40" />
                    <p className="font-display text-sm font-semibold">No clues revealed yet</p>
                    <p className="text-xs">Click tiles on the left board to open deductions.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Points Bounty Tracker */}
            {!roundComplete && blocksRevealed > 0 && (
              <motion.div
                key={blocksRevealed}
                className="flex items-center justify-between rounded-2xl border border-neon-amber/50 bg-neon-amber/10 px-6 py-4 backdrop-blur-md shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neon-amber">
                    Active Bounty Value
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Speed deduction bonus active
                  </div>
                </div>
                <div className="font-display text-3xl font-black text-neon-amber text-glow-amber">
                  +{currentPoints} pts
                </div>
              </motion.div>
            )}

            {/* Decision Controls */}
            <div className="flex flex-col gap-3">
              {!roundComplete && !revealed && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowTeamSelect(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-neon-lime/60 bg-neon-lime/20 py-4 font-display text-xl font-black text-neon-lime transition-all hover:bg-neon-lime/30 hover:shadow-[0_0_20px_hsl(130_100%_50%/0.35)]"
                >
                  <Award size={22} />
                  Award Correct Guess (+{currentPoints} pts)
                </button>
              )}

              {!roundComplete && !revealed && (
                <button
                  onClick={handleShowAnswer}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/60 py-3.5 font-display text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <Eye size={18} /> Reveal Identity & Full Image
                </button>
              )}

              {roundComplete && currentRoundIndex < puzzles.length - 1 && (
                <button
                  onClick={() => switchRound(currentRoundIndex + 1)}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/60 bg-primary/20 py-4 font-display text-lg font-black text-primary transition-all hover:bg-primary/30 hover:shadow-[0_0_20px_hsl(185_100%_50%/0.4)]"
                >
                  Advance to Next Puzzle Round <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Select Award Modal */}
      <AnimatePresence>
        {showTeamSelect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-6 md:p-8 shadow-2xl box-glow-cyan"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <h2 className="mb-1 text-center font-display text-2xl font-bold text-primary text-glow-cyan">
                Award +{currentPoints} Points
              </h2>
              <p className="mb-6 text-center font-body text-sm text-muted-foreground">
                Select the team that buzzed and guessed correctly:
              </p>

              <div className="grid grid-cols-2 gap-3.5">
                {eventData.teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleAwardPoints(team)}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-lime/40 bg-neon-lime/10 p-4 transition-all hover:bg-neon-lime/25 hover:scale-105"
                  >
                    <span className="text-3xl mb-1">{team.avatar}</span>
                    <span className="font-display text-sm font-bold text-foreground">
                      {team.name}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowTeamSelect(false)}
                className="mt-6 w-full rounded-xl border border-border bg-muted/30 py-2.5 font-display text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default AIPuzzle;
