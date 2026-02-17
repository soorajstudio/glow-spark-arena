import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Snowflake, Puzzle, RotateCw, Link2, Trophy } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";

const games = [
  { path: "/break-the-ice", icon: "❄️", title: "Break the Ice", desc: "Shatter ice cubes to reveal questions!", color: "cyan" as const },
  { path: "/puzzle/0", icon: "🧠", title: "AI Puzzle: First AI", desc: "Guess the first-ever AI program!", color: "magenta" as const },
  { path: "/puzzle/1", icon: "🌐", title: "AI Puzzle: Social Media", desc: "Guess the first social media giant!", color: "magenta" as const },
  { path: "/puzzle/2", icon: "💬", title: "AI Puzzle: Top App", desc: "Guess the most used Play Store app!", color: "magenta" as const },
  { path: "/puzzle/3", icon: "🤖", title: "AI Puzzle: Top AI App", desc: "Guess the most used AI application!", color: "magenta" as const },
  { path: "/quiz-wheel", icon: "🎡", title: "AI Quiz Wheel", desc: "Spin the wheel & test your AI knowledge!", color: "lime" as const },
  { path: "/match", icon: "🔗", title: "Match the Logic", desc: "Connect AI terms with their definitions!", color: "amber" as const },
];

const glowMap = {
  cyan: "box-glow-cyan neon-border-cyan",
  magenta: "box-glow-magenta neon-border-magenta",
  lime: "box-glow-lime neon-border-lime",
  amber: "box-glow-amber neon-border-amber",
};

const textGlowMap = {
  cyan: "text-neon-cyan text-glow-cyan",
  magenta: "text-neon-magenta text-glow-magenta",
  lime: "text-neon-lime text-glow-lime",
  amber: "text-neon-amber text-glow-amber",
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-5xl font-black text-primary text-glow-cyan md:text-7xl">
          RESPONSIBLE AI
        </h1>
        <p className="mt-2 font-body text-xl text-muted-foreground md:text-2xl">
          Classroom Competition Game
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mb-10 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Scoreboard />
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game, i) => (
          <motion.button
            key={game.path}
            onClick={() => navigate(game.path)}
            className={`group rounded-xl bg-card p-8 text-left transition-all ${glowMap[game.color]}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="mb-4 block text-5xl">{game.icon}</span>
            <h2 className={`font-display text-2xl font-bold ${textGlowMap[game.color]}`}>
              {game.title}
            </h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">{game.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={() => navigate("/final")}
          className="flex items-center gap-3 rounded-xl border border-neon-amber/40 bg-neon-amber/10 px-8 py-4 font-display text-2xl font-bold text-neon-amber transition-all hover:bg-neon-amber/20 hover:shadow-[0_0_20px_hsl(40_100%_55%/0.3)]"
        >
          <Trophy size={32} />
          Final Scoreboard
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
