import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Trophy,
  Tv,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvent } from "@/contexts/EventContext";
import Scoreboard from "./Scoreboard";
import { sound } from "@/lib/sound";
import type { ReactNode } from "react";

interface GameLayoutProps {
  title: string;
  icon: string;
  subtitle?: string;
  children: ReactNode;
}

const GameLayout = ({ title, icon, subtitle, children }: GameLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventData, soundEnabled, toggleSound, projectorMode, toggleProjectorMode } = useEvent();
  const [showLiveScoreModal, setShowLiveScoreModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleNav = (path: string) => {
    sound.playClick();
    navigate(path);
  };

  const themeClass = `theme-${eventData.settings.theme}`;

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-all duration-300 ${themeClass} ${
        projectorMode ? "projector-display" : ""
      }`}
    >
      {/* Top Tournament Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left: Brand & Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav("/")}
              className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-card/60 px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/15 hover:border-primary"
              title="Return to lobby"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Lobby</span>
            </button>

            <div className="hidden items-center gap-2 border-l border-border/80 pl-3 sm:flex">
              <span className="text-xl">{icon}</span>
              <div>
                <h1 className="font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
                  {title}
                </h1>
                {subtitle && <p className="font-body text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Center: Event Branding Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-lime opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-lime"></span>
            </span>
            <span className="font-display text-xs font-bold tracking-widest text-primary">
              {eventData.settings.name}
            </span>
          </div>

          {/* Right: Stage Control Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Live Leaderboard pill */}
            <button
              onClick={() => {
                sound.playClick();
                setShowLiveScoreModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-neon-amber/40 bg-neon-amber/10 px-3 py-1.5 font-display text-xs font-bold text-neon-amber hover:bg-neon-amber/20"
              title="View live scores"
            >
              <Trophy size={14} />
              <span className="hidden sm:inline">Scores</span>
            </button>

            {/* Projector Mode */}
            <button
              onClick={toggleProjectorMode}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 font-display text-xs font-semibold transition-all ${
                projectorMode
                  ? "border-primary bg-primary text-background font-bold shadow-[0_0_15px_hsl(185_100%_50%/0.4)]"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle Projector Stage HUD"
            >
              <Tv size={14} />
              <span className="hidden md:inline">Projector</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`rounded-xl border p-2 text-sm transition-all ${
                soundEnabled
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
              title={soundEnabled ? "Mute Game SFX" : "Unmute Game SFX"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="rounded-xl border border-border bg-card/60 p-2 text-muted-foreground hover:bg-card hover:text-foreground"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Admin / Event Studio */}
            <button
              onClick={() => handleNav("/admin")}
              className={`rounded-xl border p-2 transition-all ${
                location.pathname === "/admin"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
              title="Event Customizer & Question Editor"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Stage Area */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Slide-over / Modal for Live Arena Scoreboard */}
      <AnimatePresence>
        {showLiveScoreModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl box-glow-cyan"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setShowLiveScoreModal(false);
                }}
                className="absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <Scoreboard />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowLiveScoreModal(false);
                    navigate("/final");
                  }}
                  className="rounded-xl border border-neon-amber/50 bg-neon-amber/10 px-5 py-2.5 font-display text-sm font-bold text-neon-amber hover:bg-neon-amber/20"
                >
                  Go to Final Results 🏆
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowLiveScoreModal(false);
                  }}
                  className="rounded-xl border border-border bg-muted/40 px-5 py-2.5 font-display text-sm font-medium text-foreground hover:bg-muted"
                >
                  Back to Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameLayout;
