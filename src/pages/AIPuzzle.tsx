import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import { useScore, TEAMS, type TeamName } from "@/contexts/ScoreContext";
import { Bot, Brain, Globe, MessageSquare } from "lucide-react";

interface PuzzleRound {
  icon: React.ReactNode;
  answer: string;
  clues: string[];
}

const rounds: PuzzleRound[] = [
  {
    icon: <Brain className="h-full w-full text-primary" />,
    answer: "ELIZA (First AI Program)",
    clues: [
      "I was created in the 1960s at MIT.",
      "I could simulate a psychotherapist.",
      "I used simple pattern matching.",
      "My creator was Joseph Weizenbaum.",
      "I am considered the first chatbot ever.",
      "I ran on mainframe computers.",
      "People thought I truly understood them.",
      "I paved the way for modern AI assistants.",
      "My name comes from a character in Pygmalion.",
    ],
  },
  {
    icon: <Globe className="h-full w-full text-secondary" />,
    answer: "Facebook (First Social Media to 1B Users)",
    clues: [
      "I was launched from a college dorm room.",
      "I started as a platform for university students.",
      "My founder became the youngest billionaire.",
      "I was the first social network to reach 1 billion users.",
      "I changed my parent company name to Meta.",
      "I introduced the 'Like' button to the world.",
      "I connect over 3 billion people worldwide.",
      "I started in 2004 at Harvard University.",
      "My iconic color is blue.",
    ],
  },
  {
    icon: <MessageSquare className="h-full w-full text-neon-lime" />,
    answer: "WhatsApp (Most Used App on Play Store)",
    clues: [
      "I am a messaging application.",
      "I was acquired by Facebook for $19 billion.",
      "I use end-to-end encryption.",
      "I have over 2 billion users worldwide.",
      "I support voice and video calls.",
      "My icon is a green speech bubble with a phone.",
      "I was founded by ex-Yahoo employees.",
      "I replaced SMS for many people.",
      "I am the most downloaded app on Google Play Store.",
    ],
  },
  {
    icon: <Bot className="h-full w-full text-neon-amber" />,
    answer: "ChatGPT (Most Used AI Application)",
    clues: [
      "I reached 100 million users in 2 months.",
      "I was created by OpenAI.",
      "I can write essays, code, and poems.",
      "I launched in November 2022.",
      "My name includes the word 'Chat'.",
      "I use the Transformer architecture.",
      "I broke the record for fastest-growing app.",
      "I can hold multi-turn conversations.",
      "I am the most widely used AI application today.",
    ],
  },
];

const POINTS_MAP: Record<number, number> = { 1: 15, 2: 10, 3: 5, 4: 2 };
const MAX_BLOCKS = 4;

const AIPuzzle = () => {
  const { addScore } = useScore();
  const { roundId } = useParams();
  const navigate = useNavigate();
  const currentRound = Math.min(Number(roundId) || 0, rounds.length - 1);
  const [removedBlocks, setRemovedBlocks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const round = rounds[currentRound];
  const blocksRevealed = removedBlocks.length;
  const currentPoints = POINTS_MAP[blocksRevealed] ?? 2;

  const handleBlockClick = (idx: number) => {
    if (removedBlocks.includes(idx) || revealed || roundComplete) return;
    const next = [...removedBlocks, idx];
    setRemovedBlocks(next);
    if (next.length >= MAX_BLOCKS) {
      setRevealed(true);
    }
  };

  const handleGuess = () => {
    setShowTeamSelect(true);
  };

  const handleAwardPoints = (team: TeamName) => {
    addScore(team, "Puzzle", currentPoints);
    setShowTeamSelect(false);
    setRevealed(true);
    setRoundComplete(true);
  };

  const handleShowAnswer = () => {
    setRevealed(true);
    setRoundComplete(true);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <GameLayout title="AI Puzzle" icon="🧩">
      <div className="mx-auto mt-4 flex max-w-6xl flex-col gap-6 lg:flex-row">
        {/* Left: Icon Grid */}
        <div className="flex-1">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-card box-glow-cyan">
            {/* Hidden Icon underneath */}
            <div className="absolute inset-0 flex items-center justify-center p-16">
              {round.icon}
            </div>
            {/* Answer label shown when revealed */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-card/90 py-3 text-center font-display text-2xl font-bold text-primary text-glow-cyan backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {round.answer}
                </motion.div>
              )}
            </AnimatePresence>
            {/* 3x3 Grid of blocks */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const isRemoved = removedBlocks.includes(i) || revealed;
                return (
                  <div key={i} className="relative">
                    <AnimatePresence>
                      {!isRemoved && (
                        <motion.button
                          className="absolute inset-0 flex items-center justify-center rounded-lg border border-neon-magenta/40 bg-muted font-display text-2xl font-bold text-neon-magenta"
                          onClick={() => handleBlockClick(i)}
                          initial={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0, rotate: 45, transition: { duration: 0.5 } }}
                          whileTap={!revealed && !roundComplete ? { scale: 0.95 } : {}}
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

          {/* Round info */}
          <div className="mt-4 text-center font-body text-lg text-muted-foreground">
            {round.answer.split("(")[0].trim()}
          </div>
        </div>

        {/* Right: Clue Log & Controls */}
        <div className="flex w-full flex-col gap-4 lg:w-80">
          {/* Clue Log */}
          <div className="rounded-xl border border-primary/30 bg-card p-5 box-glow-cyan">
            <h3 className="mb-3 font-display text-xl font-bold text-primary text-glow-cyan">
              📋 Clue Log
            </h3>
            <div className="min-h-[120px] space-y-2">
              <AnimatePresence>
                {removedBlocks.map((blockIdx, order) => (
                  <motion.div
                    key={`${currentRound}-${blockIdx}`}
                    className="rounded-lg border border-neon-lime/30 bg-neon-lime/10 px-4 py-2 font-body text-base text-neon-lime"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {round.clues[blockIdx]}
                  </motion.div>
                ))}
              </AnimatePresence>
              {blocksRevealed === 0 && !revealed && (
                <p className="font-body text-base text-muted-foreground italic">
                  Click blocks to reveal clues...
                </p>
              )}
            </div>
          </div>

          {/* Points indicator */}
          {!roundComplete && blocksRevealed > 0 && (
            <motion.div
              className="rounded-xl border border-neon-amber/40 bg-neon-amber/10 p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={blocksRevealed}
            >
              <p className="font-body text-base text-neon-amber">
                Blocks revealed: {blocksRevealed} / {MAX_BLOCKS}
              </p>
              <p className="font-display text-3xl font-bold text-neon-amber text-glow-amber">
                +{currentPoints} pts
              </p>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex flex-col gap-3">
            {!roundComplete && !revealed && blocksRevealed > 0 && (
              <button
                onClick={handleGuess}
                className="w-full rounded-xl border-2 border-neon-lime/50 bg-neon-lime/10 py-4 font-display text-xl font-bold text-neon-lime transition-all hover:bg-neon-lime/20 hover:shadow-[0_0_20px_hsl(130_100%_50%/0.3)]"
              >
                🎯 Guess Answer (+{currentPoints})
              </button>
            )}
            {!roundComplete && !revealed && (
              <button
                onClick={handleShowAnswer}
                className="w-full rounded-xl border-2 border-muted-foreground/30 bg-muted py-3 font-display text-lg font-bold text-muted-foreground transition-all hover:bg-muted-foreground/20"
              >
                👁 Show Answer
              </button>
            )}
            {roundComplete && (
              <button
                onClick={handleBackToHome}
                className="w-full rounded-xl border-2 border-primary/50 bg-primary/10 py-4 font-display text-xl font-bold text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(185_100%_50%/0.3)]"
              >
                🏠 Back to Home
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Team select modal */}
      <AnimatePresence>
        {showTeamSelect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-xl border border-primary/30 bg-card p-8 box-glow-cyan"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="mb-2 text-center font-display text-3xl font-bold text-primary text-glow-cyan">
                Award +{currentPoints} Points
              </h2>
              <p className="mb-6 text-center font-body text-lg text-muted-foreground">
                Select the team that answered correctly
              </p>
              <div className="grid grid-cols-2 gap-4">
                {TEAMS.map((team) => (
                  <button
                    key={team}
                    onClick={() => handleAwardPoints(team)}
                    className="rounded-xl border-2 border-neon-lime/40 bg-neon-lime/10 py-5 font-display text-xl font-bold text-neon-lime transition-all hover:bg-neon-lime/20 hover:shadow-[0_0_20px_hsl(130_100%_50%/0.3)]"
                  >
                    {team}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowTeamSelect(false)}
                className="mt-4 w-full rounded-lg py-3 font-body text-lg text-muted-foreground transition-colors hover:bg-muted"
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
