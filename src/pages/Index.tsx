import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Snowflake,
  Puzzle,
  RotateCw,
  Link2,
  Trophy,
  SlidersHorizontal,
  Sparkles,
  Info,
  Tv,
  Volume2,
  VolumeX,
  Play,
  Flame,
  Award,
  ChevronRight,
} from "lucide-react";
import Scoreboard from "@/components/Scoreboard";
import { useEvent } from "@/contexts/EventContext";
import { sound } from "@/lib/sound";

export const Index = () => {
  const navigate = useNavigate();
  const { eventData, soundEnabled, toggleSound, projectorMode, toggleProjectorMode, getLeaderboard } = useEvent();
  const [showRulesModal, setShowRulesModal] = useState(false);

  const leaderboard = getLeaderboard();
  const topTeam = leaderboard[0];

  const handleNav = (path: string) => {
    sound.playClick();
    navigate(path);
  };

  const gameArenas = [
    {
      id: "ice",
      title: eventData.breakTheIce.title || "Break the Ice",
      desc: eventData.breakTheIce.description || "Shatter cyber shields to reveal rapid-fire questions",
      path: "/break-the-ice",
      icon: "❄️",
      tag: `${eventData.breakTheIce.questions.length} Questions`,
      color: "cyan",
      borderColor: "border-primary/50",
      glowColor: "box-glow-cyan text-glow-cyan",
      badgeColor: "bg-primary/20 text-primary",
    },
    {
      id: "puzzle",
      title: "AI Mystery Puzzles",
      desc: "Decode progressive 9-tile clues to identify legendary AI programs & apps",
      path: "/puzzle/0",
      icon: "🧩",
      tag: `${eventData.puzzles.length} Mystery Rounds`,
      color: "magenta",
      borderColor: "border-neon-magenta/50",
      glowColor: "box-glow-magenta text-glow-magenta",
      badgeColor: "bg-neon-magenta/20 text-neon-magenta",
    },
    {
      id: "wheel",
      title: eventData.quizWheel.title || "AI Quiz Wheel",
      desc: "Spin the quantum wheel, select categories, and answer high-stakes MCQs",
      path: "/quiz-wheel",
      icon: "🎡",
      tag: `${eventData.quizWheel.categories.length} Categories`,
      color: "lime",
      borderColor: "border-neon-lime/50",
      glowColor: "box-glow-lime text-glow-lime",
      badgeColor: "bg-neon-lime/20 text-neon-lime",
    },
    {
      id: "match",
      title: eventData.matchTheLogic.title || "Match the Logic",
      desc: "Connect complex AI, CS, and engineering definitions with zero errors",
      path: "/match",
      icon: "🔗",
      tag: `${eventData.matchTheLogic.pairs.length} Concept Pairs`,
      color: "amber",
      borderColor: "border-neon-amber/50",
      glowColor: "box-glow-amber text-glow-amber",
      badgeColor: "bg-neon-amber/20 text-neon-amber",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-all duration-300 theme-${
        eventData.settings.theme
      } ${projectorMode ? "projector-display" : ""}`}
    >
      {/* Top Bar */}
      <header className="border-b border-primary/20 bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary font-display font-black text-sm">
              ⚡
            </span>
            <span className="font-display text-sm font-bold tracking-widest text-primary">
              SRISHTI ARENA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowRulesModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-1.5 font-display text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <Info size={14} /> Stage Guide
            </button>

            <button
              onClick={toggleProjectorMode}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-display text-xs font-semibold transition-all ${
                projectorMode
                  ? "border-primary bg-primary text-background font-bold shadow-[0_0_15px_hsl(185_100%_50%/0.4)]"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tv size={14} /> Projector Mode
            </button>

            <button
              onClick={toggleSound}
              className={`rounded-xl border p-2 text-sm transition-all ${
                soundEnabled
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
              title={soundEnabled ? "Mute SFX" : "Unmute SFX"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={() => handleNav("/admin")}
              className="flex items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/15 px-3.5 py-1.5 font-display text-xs font-bold text-primary transition-all hover:bg-primary/25"
            >
              <SlidersHorizontal size={14} /> Event Studio
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 px-4 text-center sm:px-6 lg:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Live Stage Pill */}
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-lime opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-lime"></span>
            </span>
            <span className="font-display text-xs font-bold tracking-widest text-primary uppercase">
              INTERACTIVE TECH FEST STAGE ARENA
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-black tracking-tight text-foreground md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-glow-cyan block">
              {eventData.settings.name}
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl font-body text-base text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {eventData.settings.tagline}
          </motion.p>

          {/* Active Teams Strip */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Teams:
            </span>
            {eventData.teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/60 px-3 py-1 font-display text-xs font-bold text-foreground backdrop-blur-sm"
              >
                <span>{team.avatar}</span>
                <span style={{ color: team.color }}>{team.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Leaderboard Container */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mb-12">
        <Scoreboard />
      </section>

      {/* Game Arenas Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Tournament Game Arenas
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Select any stage to project questions and battle for points
            </p>
          </div>
          <button
            onClick={() => handleNav("/final")}
            className="flex items-center gap-2 rounded-xl border border-neon-amber/50 bg-neon-amber/10 px-4 py-2 font-display text-xs font-bold text-neon-amber hover:bg-neon-amber/20"
          >
            <Trophy size={16} /> Final Results Podium
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gameArenas.map((game, i) => (
            <motion.div
              key={game.id}
              onClick={() => handleNav(game.path)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border ${game.borderColor} bg-card/80 p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
                game.color === "cyan"
                  ? "hover:box-glow-cyan"
                  : game.color === "magenta"
                  ? "hover:box-glow-magenta"
                  : game.color === "lime"
                  ? "hover:box-glow-lime"
                  : "hover:box-glow-amber"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                  {game.icon}
                </span>
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wider ${game.badgeColor}`}>
                  {game.tag}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {game.title}
              </h3>

              <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {game.desc}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-display font-bold text-primary">
                <span>Enter Arena</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Podium Launch Banner */}
        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-neon-amber/40 bg-gradient-to-r from-neon-amber/15 via-primary/10 to-neon-magenta/15 p-6 md:p-8 backdrop-blur-xl shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-neon-amber font-display text-xs font-bold uppercase tracking-wider mb-1">
                <Flame size={16} /> Tournament Climax
              </div>
              <h3 className="font-display text-2xl font-black text-foreground md:text-3xl">
                Ready to Crown the Champion?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Transition to the Grand Stage Podium with real-time score reveal animations and confetti!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleNav("/final")}
                className="flex items-center gap-3 rounded-xl border-2 border-neon-amber/60 bg-neon-amber/20 px-8 py-4 font-display text-lg font-black text-neon-amber transition-all hover:bg-neon-amber/30 hover:shadow-[0_0_25px_hsl(40_100%_55%/0.4)]"
              >
                <Trophy size={24} />
                Grand Award Ceremony
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stage Rules & Instructions Modal */}
      <AnimatePresence>
        {showRulesModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl border border-primary/40 bg-card p-6 md:p-8 shadow-2xl box-glow-cyan"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                  <Info size={20} /> Event Master & Projector Guide
                </h3>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
                <p>
                  Welcome to <strong className="text-foreground">Glow Spark Arena</strong>, designed for high-energy tech fests, computer science symposiums, and hackathon game shows displayed on large projectors.
                </p>

                <div className="space-y-2">
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <strong className="text-foreground block font-display text-xs uppercase text-primary">
                      1. Projector Mode (Shortcut: Top Bar)
                    </strong>
                    Optimizes contrast, expands typography for the audience in the back row, and hides non-essential controls.
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <strong className="text-foreground block font-display text-xs uppercase text-neon-lime">
                      2. Flexible Scoring & Pass Mechanics
                    </strong>
                    Direct correct answer gives full points (e.g. +10). If passed to another team, award pass points (e.g. +5) with one click.
                  </div>

                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <strong className="text-foreground block font-display text-xs uppercase text-neon-amber">
                      3. Customizer Studio (/admin)
                    </strong>
                    Organizers can customize all questions, upload question images, add multiple choice options, change team names/avatars, or load built-in templates (Web Dev, CyberSec, AI).
                  </div>
                </div>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full rounded-xl bg-primary py-2.5 font-display text-sm font-bold text-background hover:bg-primary/90 mt-2"
                >
                  Got It, Let's Play!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
