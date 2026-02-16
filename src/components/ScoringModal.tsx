import { useScore, TEAMS, CATEGORIES, type TeamName } from "@/contexts/ScoreContext";
import { motion } from "framer-motion";

const ScoringModal = ({
  onClose,
  category,
}: {
  onClose: () => void;
  category: "Break the Ice" | "Puzzle" | "Quiz" | "Match";
}) => {
  const { addScore } = useScore();

  const handleSelect = (team: TeamName, points: number) => {
    addScore(team, category, points);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl rounded-xl border border-primary/30 bg-card p-8 box-glow-cyan"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-primary text-glow-cyan">
          Award Points
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {TEAMS.map((team) => (
            <div key={team} className="space-y-3">
              <h3 className="text-center font-display text-xl font-semibold text-foreground">
                {team}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelect(team, 10)}
                  className="flex-1 rounded-lg border border-neon-lime/40 bg-neon-lime/10 px-4 py-3 font-body text-lg font-bold text-neon-lime transition-all hover:bg-neon-lime/20 hover:shadow-[0_0_15px_hsl(130_100%_50%/0.3)]"
                >
                  Direct +10
                </button>
                <button
                  onClick={() => handleSelect(team, 5)}
                  className="flex-1 rounded-lg border border-neon-amber/40 bg-neon-amber/10 px-4 py-3 font-body text-lg font-bold text-neon-amber transition-all hover:bg-neon-amber/20 hover:shadow-[0_0_15px_hsl(40_100%_55%/0.3)]"
                >
                  Passed +5
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-muted-foreground/30 py-3 font-body text-lg text-muted-foreground transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ScoringModal;
