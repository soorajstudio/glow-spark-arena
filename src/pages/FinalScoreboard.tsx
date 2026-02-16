import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Crown, RotateCcw, Home } from "lucide-react";
import { useScore, TEAMS, CATEGORIES, type TeamName } from "@/contexts/ScoreContext";

const FinalScoreboard = () => {
  const { scores, getTotal, resetAll } = useScore();
  const navigate = useNavigate();
  const [animatedScores, setAnimatedScores] = useState<Record<TeamName, number>>(
    () => Object.fromEntries(TEAMS.map((t) => [t, 0])) as Record<TeamName, number>
  );

  const sorted = [...TEAMS].sort((a, b) => getTotal(b) - getTotal(a));
  const winnerTotal = getTotal(sorted[0]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScores(
        Object.fromEntries(TEAMS.map((t) => [t, Math.round(getTotal(t) * eased)])) as Record<TeamName, number>
      );
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [scores]);

  const podiumColors = ["text-neon-amber text-glow-amber", "text-muted-foreground", "text-neon-cyan text-glow-cyan"];
  const podiumHeights = ["h-40", "h-28", "h-20"];

  const handleReset = () => {
    resetAll();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <motion.h1
        className="mb-10 text-center font-display text-5xl font-black text-primary text-glow-cyan md:text-7xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        🏆 Final Results
      </motion.h1>

      {/* Podium */}
      <div className="mx-auto mb-12 flex max-w-3xl items-end justify-center gap-6">
        {sorted.slice(0, 3).map((team, i) => {
          const order = i === 0 ? 1 : i === 1 ? 0 : 2;
          return (
            <motion.div
              key={team}
              className="flex flex-col items-center"
              style={{ order }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.3, type: "spring", stiffness: 100 }}
            >
              {i === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                >
                  <Crown size={48} className="mb-2 text-neon-amber" />
                </motion.div>
              )}
              <span className={`mb-2 font-display text-2xl font-bold ${podiumColors[i] || "text-foreground"}`}>
                {team}
              </span>
              <span className="mb-2 font-display text-4xl font-black text-foreground">
                {animatedScores[team]}
              </span>
              <div
                className={`w-28 rounded-t-xl ${podiumHeights[i]} ${
                  i === 0
                    ? "bg-neon-amber/30 border-2 border-neon-amber/50"
                    : i === 1
                    ? "bg-muted border-2 border-muted-foreground/30"
                    : "bg-neon-cyan/20 border-2 border-neon-cyan/30"
                }`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Full table */}
      <motion.div
        className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-primary/20 bg-card/60 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <table className="w-full text-center font-body">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="px-4 py-3 text-left font-display text-lg text-primary">Rank</th>
              <th className="px-4 py-3 text-left font-display text-lg text-primary">Team</th>
              {CATEGORIES.map((c) => (
                <th key={c} className="px-4 py-3 font-display text-sm text-muted-foreground">{c}</th>
              ))}
              <th className="px-4 py-3 font-display text-lg text-neon-lime">Total</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <motion.tr
                key={team}
                className="border-b border-border/50 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
              >
                <td className="px-4 py-3 font-display text-xl font-bold text-foreground">
                  {i === 0 ? "👑" : `#${i + 1}`}
                </td>
                <td className="px-4 py-3 text-left font-display text-xl font-bold text-foreground">{team}</td>
                {CATEGORIES.map((cat) => (
                  <td key={cat} className="px-4 py-3 text-xl text-muted-foreground">{scores[team][cat]}</td>
                ))}
                <td className="px-4 py-3 font-display text-2xl font-bold text-neon-lime text-glow-lime">
                  {animatedScores[team]}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-8 py-4 font-display text-xl font-bold text-primary transition-all hover:bg-primary/20"
        >
          <Home size={24} />
          Home
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-8 py-4 font-display text-xl font-bold text-destructive transition-all hover:bg-destructive/20"
        >
          <RotateCcw size={24} />
          Reset Game
        </button>
      </motion.div>
    </div>
  );
};

export default FinalScoreboard;
