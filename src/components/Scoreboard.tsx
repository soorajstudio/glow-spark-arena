import { useScore, TEAMS, CATEGORIES } from "@/contexts/ScoreContext";
import { motion } from "framer-motion";

const Scoreboard = () => {
  const { scores, getTotal } = useScore();

  return (
    <motion.div
      className="w-full overflow-hidden rounded-xl border border-primary/20 bg-card/60 backdrop-blur box-glow-cyan"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <table className="w-full text-center font-body">
        <thead>
          <tr className="border-b border-primary/20">
            <th className="px-4 py-3 text-left font-display text-lg text-primary">Team</th>
            {CATEGORIES.map((c) => (
              <th key={c} className="px-4 py-3 font-display text-sm text-muted-foreground">
                {c}
              </th>
            ))}
            <th className="px-4 py-3 font-display text-lg text-neon-lime">Total</th>
          </tr>
        </thead>
        <tbody>
          {TEAMS.map((team, i) => (
            <motion.tr
              key={team}
              className="border-b border-border/50 last:border-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <td className="px-4 py-3 text-left font-display text-xl font-bold text-foreground">
                {team}
              </td>
              {CATEGORIES.map((cat) => (
                <td key={cat} className="px-4 py-3 text-xl text-muted-foreground">
                  {scores[team][cat]}
                </td>
              ))}
              <td className="px-4 py-3 font-display text-2xl font-bold text-neon-lime text-glow-lime">
                {getTotal(team)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Scoreboard;
