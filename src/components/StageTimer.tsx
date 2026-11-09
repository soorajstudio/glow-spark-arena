import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Plus, Clock } from "lucide-react";
import { sound } from "@/lib/sound";

interface StageTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export const StageTimer = ({ initialSeconds = 30, onExpire, autoStart = true }: StageTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setSeconds(initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            sound.playBuzzer();
            if (onExpire) onExpire();
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            sound.playTimerUrgent();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onExpire]);

  const toggleRun = () => {
    sound.playClick();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const addTime = (extra: number) => {
    sound.playClick();
    setSeconds((prev) => prev + extra);
  };

  const percent = Math.max(0, Math.min(100, (seconds / initialSeconds) * 100));
  const isUrgent = seconds <= 5;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/80 px-4 py-2.5 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-2">
        <Clock className={`h-5 w-5 ${isUrgent ? "animate-pulse text-destructive" : "text-primary"}`} />
        <span
          className={`font-display text-2xl font-black tracking-wider ${
            isUrgent ? "text-destructive text-glow-magenta animate-pulse" : "text-primary text-glow-cyan"
          }`}
        >
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </div>

      {/* Progress pill */}
      <div className="hidden h-2.5 w-24 overflow-hidden rounded-full bg-muted/60 sm:block">
        <div
          className={`h-full transition-all duration-300 ${
            isUrgent ? "bg-destructive shadow-[0_0_8px_hsl(0_90%_60%)]" : "bg-primary shadow-[0_0_8px_hsl(185_100%_50%)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleRun}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => addTime(10)}
          className="flex items-center gap-0.5 rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20"
          title="Add 10 seconds"
        >
          <Plus size={12} /> 10s
        </button>
      </div>
    </div>
  );
};
