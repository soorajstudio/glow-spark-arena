import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Crown,
  RotateCcw,
  Home,
  Trophy,
  Award,
  Sparkles,
  Download,
  History,
  Undo2,
  Tv,
} from "lucide-react";
import { useEvent, type Team } from "@/contexts/EventContext";
import { sound } from "@/lib/sound";

export const FinalScoreboard = () => {
  const {
    eventData,
    scores,
    scoreLogs,
    undoLastScore,
    resetAllScores,
    getTeamTotal,
    getLeaderboard,
    projectorMode,
    toggleProjectorMode,
  } = useEvent();
  const navigate = useNavigate();

  const ranked = getLeaderboard();
  const winner = ranked[0];

  // Animated score counter state
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Play grand fanfare and shoot confetti
    sound.playVictory();
    const timer1 = setTimeout(() => {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }, 400);

    const timer2 = setTimeout(() => {
      confetti({ particleCount: 100, spread: 110, origin: { x: 0.2, y: 0.6 } });
      confetti({ particleCount: 100, spread: 110, origin: { x: 0.8, y: 0.6 } });
    }, 1200);

    // Score count-up
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;
    const counter = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const temp: Record<string, number> = {};
      eventData.teams.forEach((t) => {
        temp[t.id] = Math.round(getTeamTotal(t.id) * eased);
      });
      setAnimatedScores(temp);
      if (step >= steps) clearInterval(counter);
    }, interval);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(counter);
    };
  }, [eventData.teams, getTeamTotal]);

  const categories = ["Break the Ice", "Puzzle", "Quiz", "Match"];

  const handleResetTournament = () => {
    resetAllScores();
    setShowResetConfirm(false);
    navigate("/");
  };

  const exportSummary = () => {
    sound.playClick();
    const rows = [
      ["Rank", "Team Name", "Total Score", ...categories],
      ...ranked.map((item, idx) => [
        `#${idx + 1}`,
        item.team.name,
        item.total,
        ...categories.map((c) => scores[item.team.id]?.[c] || 0),
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${eventData.settings.name.toLowerCase().replace(/\s+/g, "-")}-final-standings.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      className={`min-h-screen bg-background p-4 sm:p-6 md:p-10 transition-all duration-300 theme-${
        eventData.settings.theme
      } ${projectorMode ? "projector-display" : ""}`}
    >
      {/* Stage Header */}
      <div className="mx-auto max-w-6xl flex items-center justify-between border-b border-border/80 pb-4 mb-8">
        <button
          onClick={() => {
            sound.playClick();
            navigate("/");
          }}
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-card/60 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10"
        >
          <Home size={16} /> Return to Lobby
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleProjectorMode}
            className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 font-display text-xs font-semibold ${
              projectorMode
                ? "border-primary bg-primary text-background font-bold shadow-[0_0_15px_hsl(185_100%_50%/0.4)]"
                : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tv size={14} /> Projector Mode
          </button>
          <button
            onClick={exportSummary}
            className="flex items-center gap-1.5 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-3.5 py-1.5 font-display text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20"
          >
            <Download size={14} /> Export Standings
          </button>
        </div>
      </div>

      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="font-display text-xs font-bold uppercase tracking-widest text-neon-amber">
          GRAND FINALE & PODIUM
        </span>
        <h1 className="mt-1 font-display text-4xl font-black text-primary text-glow-cyan md:text-6xl lg:text-7xl">
          Tournament Champions
        </h1>
        <p className="mt-2 font-body text-base text-muted-foreground">
          {eventData.settings.name} — Official Results Ceremony
        </p>
      </motion.div>

      {/* 3D Olympic Podium (Top 3) */}
      {ranked.length >= 2 && (
        <div className="mx-auto mb-16 flex max-w-3xl items-end justify-center gap-3 sm:gap-6 pt-12">
          {/* 2nd Place (Silver - Left) */}
          {ranked[1] && (
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 90 }}
            >
              <div className="text-3xl mb-1">{ranked[1].team.avatar}</div>
              <span className="font-display text-sm font-bold text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                {ranked[1].team.name}
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black text-foreground mb-2">
                {animatedScores[ranked[1].team.id] ?? ranked[1].total}
              </span>
              <div className="flex h-32 w-full flex-col items-center justify-start rounded-t-2xl border-2 border-border/80 bg-gradient-to-t from-card to-muted/40 pt-3 shadow-lg">
                <span className="font-display text-2xl font-black text-muted-foreground">
                  2ND
                </span>
                <span className="text-xs text-muted-foreground">Silver Medal</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Gold Champion - Center) */}
          {ranked[0] && (
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 90 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Crown size={52} className="text-neon-amber drop-shadow-[0_0_15px_hsl(40_100%_55%)] mb-1" />
              </motion.div>
              <div className="text-4xl mb-1">{ranked[0].team.avatar}</div>
              <span className="font-display text-base sm:text-lg font-black text-neon-amber text-glow-amber truncate max-w-[140px] sm:max-w-none">
                {ranked[0].team.name}
              </span>
              <span className="font-display text-3xl sm:text-5xl font-black text-neon-amber text-glow-amber mb-2">
                {animatedScores[ranked[0].team.id] ?? ranked[0].total}
              </span>
              <div className="flex h-48 w-full flex-col items-center justify-start rounded-t-2xl border-2 border-neon-amber/60 bg-gradient-to-t from-neon-amber/30 via-neon-amber/15 to-primary/10 pt-4 shadow-2xl box-glow-amber">
                <span className="font-display text-3xl font-black text-neon-amber">
                  1ST
                </span>
                <span className="text-xs font-bold text-neon-amber uppercase tracking-wider">
                  Grand Champion
                </span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place (Bronze - Right) */}
          {ranked[2] && (
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 90 }}
            >
              <div className="text-3xl mb-1">{ranked[2].team.avatar}</div>
              <span className="font-display text-sm font-bold text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                {ranked[2].team.name}
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black text-foreground mb-2">
                {animatedScores[ranked[2].team.id] ?? ranked[2].total}
              </span>
              <div className="flex h-24 w-full flex-col items-center justify-start rounded-t-2xl border-2 border-border/80 bg-gradient-to-t from-card to-neon-cyan/10 pt-3 shadow-lg">
                <span className="font-display text-xl font-black text-neon-cyan">
                  3RD
                </span>
                <span className="text-xs text-muted-foreground">Bronze Medal</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Complete Official Leaderboard Table */}
      <motion.div
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-primary/30 bg-card/75 backdrop-blur-xl shadow-2xl box-glow-cyan mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="border-b border-border/80 bg-primary/5 px-6 py-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
            <Trophy size={18} className="text-neon-amber" /> Final Aggregate Standings
          </h3>
          <span className="text-xs text-muted-foreground">All Stages Included</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center font-body">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-display">Rank</th>
                <th className="px-5 py-3 text-left font-display">Contender Team</th>
                {categories.map((c) => (
                  <th key={c} className="hidden px-4 py-3 font-display md:table-cell">
                    {c}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-display text-neon-lime">Final Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {ranked.map((item, idx) => (
                <tr
                  key={item.team.id}
                  className={idx === 0 ? "bg-neon-amber/5 font-semibold" : ""}
                >
                  <td className="px-5 py-4 text-left font-display text-xl font-bold">
                    {idx === 0 ? "👑 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                  </td>
                  <td className="px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.team.avatar}</span>
                      <span className="font-display text-lg font-bold text-foreground">
                        {item.team.name}
                      </span>
                    </div>
                  </td>
                  {categories.map((c) => (
                    <td key={c} className="hidden px-4 py-4 text-base text-muted-foreground md:table-cell">
                      <span className="rounded-lg bg-muted/40 px-2.5 py-1 font-mono-code text-sm">
                        {scores[item.team.id]?.[c] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right font-display text-3xl font-black text-neon-lime text-glow-lime">
                    {animatedScores[item.team.id] ?? item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Point History & Score Audit Logs */}
      {scoreLogs.length > 0 && (
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md mb-10">
          <div className="flex items-center justify-between mb-4 border-b border-border/80 pb-3">
            <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <History size={16} className="text-primary" /> Live Scoring Audit Log
            </h4>
            <button
              onClick={undoLastScore}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Undo2 size={13} /> Undo Last Score
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {scoreLogs.slice(0, 10).map((log) => {
              const team = eventData.teams.find((t) => t.id === log.teamId);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{team?.avatar || "⚡"}</span>
                    <span className="font-bold text-foreground">{team?.name || log.teamId}</span>
                    <span className="text-muted-foreground">in {log.category}</span>
                  </div>
                  <span className="font-display font-bold text-neon-lime">
                    +{log.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage Actions */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4 pt-4 pb-12">
        <button
          onClick={() => {
            sound.playClick();
            navigate("/");
          }}
          className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-8 py-4 font-display text-lg font-bold text-primary hover:bg-primary/20"
        >
          <Home size={20} />
          Back to Lobby
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-6 py-4 font-display text-sm font-bold text-destructive hover:bg-destructive/20"
        >
          <RotateCcw size={18} />
          Reset Scores for New Match
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-destructive/50 bg-card p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-destructive mb-2">
                Reset All Tournament Scores?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                This will reset all team points back to zero for all categories. Your custom questions and event settings will remain intact.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetTournament}
                  className="rounded-xl bg-destructive px-5 py-2 font-display text-sm font-bold text-white hover:bg-destructive/90"
                >
                  Yes, Reset Scores
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalScoreboard;
