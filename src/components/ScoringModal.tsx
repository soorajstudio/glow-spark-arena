import { useEvent } from "@/contexts/EventContext";
import { motion } from "framer-motion";
import { CheckCircle2, Award, X } from "lucide-react";
import { sound } from "@/lib/sound";

interface ScoringModalProps {
  onClose: () => void;
  category: string;
  defaultPoints?: number;
}

const ScoringModal = ({
  onClose,
  category,
  defaultPoints,
}: ScoringModalProps) => {
  const { eventData, addScore } = useEvent();
  const directPts = defaultPoints || eventData.settings.directPoints || 10;
  const passedPts = eventData.settings.passedPoints || 5;

  const handleSelect = (teamId: string, teamName: string, points: number) => {
    addScore(teamId, category, points, `${points > 0 ? "+" : ""}${points} in ${category}`);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-2xl rounded-2xl border border-primary/40 bg-card/95 p-6 md:p-8 shadow-2xl box-glow-cyan"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
      >
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award size={28} />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary text-glow-cyan md:text-3xl">
            Award Points
          </h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Category: <span className="font-semibold text-foreground">{category}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {eventData.teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border border-border/80 bg-background/60 p-4 transition-all hover:border-primary/50"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-2xl">{team.avatar}</span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {team.name}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSelect(team.id, team.name, directPts)}
                  className="flex-1 rounded-lg border border-neon-lime/50 bg-neon-lime/10 px-3 py-2.5 font-display text-sm font-bold text-neon-lime transition-all hover:bg-neon-lime/25 hover:shadow-[0_0_15px_hsl(130_100%_50%/0.3)]"
                >
                  Direct +{directPts}
                </button>
                <button
                  onClick={() => handleSelect(team.id, team.name, passedPts)}
                  className="flex-1 rounded-lg border border-neon-amber/50 bg-neon-amber/10 px-3 py-2.5 font-display text-sm font-bold text-neon-amber transition-all hover:bg-neon-amber/25 hover:shadow-[0_0_15px_hsl(40_100%_55%/0.3)]"
                >
                  Passed +{passedPts}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-6 w-full rounded-xl border border-border bg-muted/30 py-3 font-display text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ScoringModal;
