import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import { useScore, TEAMS, type TeamName } from "@/contexts/ScoreContext";
import { Bot, Brain, Cpu, Eye, MessageSquare, Sparkles, Lightbulb, Globe, Shield } from "lucide-react";

interface PuzzleRound {
  icon: React.ReactNode;
  answer: string;
  clues: string[];
}

const rounds: PuzzleRound[] = [
  {
    icon: <MessageSquare className="h-full w-full text-primary" />,
    answer: "ChatGPT",
    clues: [
      "I am a text-based model.",
      "I was created by OpenAI.",
      "I can write essays, code, and poems.",
      "My name includes the word 'Chat'.",
      "I use the Transformer architecture.",
      "I learn from massive datasets of text.",
      "Millions of people use me daily.",
      "I launched in November 2022.",
      "I can hold multi-turn conversations.",
    ],
  },
  {
    icon: <Brain className="h-full w-full text-secondary" />,
    answer: "Neural Network",
    clues: [
      "I am inspired by the human brain.",
      "I have layers of connected nodes.",
      "I learn by adjusting weights.",
      "I power most modern AI systems.",
      "I can recognize images and speech.",
      "My layers include input, hidden, and output.",
      "Deep Learning uses many of my layers.",
      "I was first theorized in the 1940s.",
      "I need large amounts of data to train.",
    ],
  },
  {
    icon: <Eye className="h-full w-full text-neon-lime" />,
    answer: "Computer Vision",
    clues: [
      "I help machines understand images.",
      "I am used in self-driving cars.",
      "I can detect faces and objects.",
      "I process pixels as my input.",
      "Medical imaging relies on me.",
      "I use convolutional neural networks.",
      "I can read text from photos (OCR).",
      "Security cameras use me for surveillance.",
      "I can generate image descriptions.",
    ],
  },
  {
    icon: <Shield className="h-full w-full text-neon-amber" />,
    answer: "Responsible AI",
    clues: [
      "I focus on fairness and ethics.",
      "I aim to reduce bias in AI systems.",
      "Transparency is one of my core principles.",
      "I ensure AI respects user privacy.",
      "I promote accountability in AI development.",
      "I consider the impact on all communities.",
      "Governments are creating regulations around me.",
      "I advocate for explainable decisions.",
      "I am essential for building trust in AI.",
    ],
  },
  {
    icon: <Sparkles className="h-full w-full text-secondary" />,
    answer: "Generative AI",
    clues: [
      "I can create new content from scratch.",
      "I power tools like DALL·E and Midjourney.",
      "I can generate text, images, and music.",
      "I learn patterns from training data.",
      "Prompt engineering improves my output.",
      "I use models like GANs and Diffusion.",
      "I raise concerns about deepfakes.",
      "I am transforming creative industries.",
      "My outputs can be hard to distinguish from human work.",
    ],
  },
  {
    icon: <Bot className="h-full w-full text-primary" />,
    answer: "AI Chatbot",
    clues: [
      "I simulate human conversation.",
      "Customer service websites use me.",
      "I can answer FAQs automatically.",
      "I use Natural Language Processing.",
      "I can be rule-based or AI-powered.",
      "Virtual assistants are a form of me.",
      "I operate 24/7 without breaks.",
      "I improve with more training data.",
      "Siri and Alexa are examples of me.",
    ],
  },
  {
    icon: <Lightbulb className="h-full w-full text-neon-amber" />,
    answer: "Prompt Engineering",
    clues: [
      "I am the art of asking AI the right way.",
      "Better instructions lead to better results.",
      "I use techniques like few-shot examples.",
      "Context and clarity are my best friends.",
      "I help reduce AI hallucinations.",
      "I am a growing career skill in tech.",
      "Chain-of-thought is one of my techniques.",
      "I work with Large Language Models.",
      "The quality of output depends on me.",
    ],
  },
  {
    icon: <Globe className="h-full w-full text-neon-lime" />,
    answer: "AI in Real Life",
    clues: [
      "I recommend what you watch on Netflix.",
      "I help doctors diagnose diseases faster.",
      "I power spam filters in your email.",
      "Navigation apps use me for traffic prediction.",
      "I translate languages in real-time.",
      "I help farmers monitor crop health.",
      "Banks use me to detect fraud.",
      "I personalize your social media feed.",
      "I am everywhere, often invisible.",
    ],
  },
  {
    icon: <Cpu className="h-full w-full text-primary" />,
    answer: "Machine Learning",
    clues: [
      "I am a subset of Artificial Intelligence.",
      "I learn from data, not explicit rules.",
      "I improve my accuracy over time.",
      "I use algorithms like decision trees.",
      "Supervised and unsupervised are my types.",
      "I need training data and test data.",
      "I can predict outcomes based on patterns.",
      "I power recommendation engines.",
      "I was coined as a term in 1959.",
    ],
  },
];

const POINTS_MAP: Record<number, number> = { 1: 15, 2: 10, 3: 5, 4: 2 };
const MAX_BLOCKS = 4;

const AIPuzzle = () => {
  const { addScore } = useScore();
  const [currentRound, setCurrentRound] = useState(0);
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

  const handleNextRound = () => {
    const next = (currentRound + 1) % rounds.length;
    setCurrentRound(next);
    setRemovedBlocks([]);
    setRevealed(false);
    setShowTeamSelect(false);
    setRoundComplete(false);
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
                  <AnimatePresence key={i}>
                    {!isRemoved && (
                      <motion.button
                        className="flex items-center justify-center rounded-lg border border-neon-magenta/40 bg-muted font-display text-2xl font-bold text-neon-magenta transition-colors hover:bg-neon-magenta/20"
                        onClick={() => handleBlockClick(i)}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.4 } }}
                        whileHover={!revealed && !roundComplete ? { scale: 1.05 } : {}}
                        whileTap={!revealed && !roundComplete ? { scale: 0.95 } : {}}
                        layout
                      >
                        {i + 1}
                      </motion.button>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </div>

          {/* Round info */}
          <div className="mt-4 text-center font-body text-lg text-muted-foreground">
            Round {currentRound + 1} / {rounds.length}
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
                onClick={handleNextRound}
                className="w-full rounded-xl border-2 border-primary/50 bg-primary/10 py-4 font-display text-xl font-bold text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(185_100%_50%/0.3)]"
              >
                ➡️ Next Round
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
