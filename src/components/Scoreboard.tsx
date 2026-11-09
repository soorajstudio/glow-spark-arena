import { useEvent } from "@/contexts/EventContext";
import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";

interface ScoreboardProps {
  compact?: boolean;
}

const Scoreboard = ({ compact = false }: ScoreboardProps) => {
  const { eventData, scores, getTeamTotal } = useEvent();
  const categories = ["Break the Ice", "Puzzle", "Quiz", "Match"];

  const rankedTeams = [...eventData.teams].map((team) => ({
    ...team,
    total: getTeamTotal(team.id),
  })).sort((a, b) => b.total - a.total);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {rankedTeams.map((team, idx) => (
          <motion.div
            key={team.id}
            className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-card/70 px-4 py-2 backdrop-blur-md"
            whileHover={{ scale: 1.03 }}
          >
            <span className="text-xl">{team.avatar}</span>
            <div className="text-left">
              <div className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {team.name}
              </div>
              <div className="font-display text-lg font-black" style={{ color: team.color }}>
                {team.total} <span className="text-xs font-normal text-muted-foreground">pts</span>
              </div>
            </div>
            {idx === 0 && <span className="text-sm">👑</span>}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="w-full overflow-hidden rounded-2xl border border-primary/30 bg-card/75 backdrop-blur-xl shadow-2xl box-glow-cyan"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-6 py-3.5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-neon-amber" />
          <span className="font-display text-base font-bold tracking-wider text-primary">
            LIVE ARENA LEADERBOARD
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-neon-lime" />
          <span>Real-time Scoring</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center font-body">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 text-left font-display">Rank & Team</th>
              {categories.map((c) => (
                <th key={c} className="hidden px-4 py-3 font-display md:table-cell">
                  {c}
                </th>
              ))}
              <th className="px-5 py-3 text-right font-display text-neon-lime">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rankedTeams.map((team, idx) => {
              const teamScores = scores[team.id] || {};
              const isFirst = idx === 0;

              return (
                <motion.tr
                  key={team.id}
                  className={`transition-colors hover:bg-primary/5 ${
                    isFirst ? "bg-primary/5 font-semibold" : ""
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <td className="px-5 py-3.5 text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-card/90 font-display text-xs font-bold border border-border">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                      <span className="text-2xl">{team.avatar}</span>
                      <div>
                        <div className="font-display text-lg font-bold text-foreground">
                          {team.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Active Contender
                        </div>
                      </div>
                    </div>
                  </td>

                  {categories.map((cat) => (
                    <td key={cat} className="hidden px-4 py-3.5 text-base text-muted-foreground md:table-cell">
                      <span className="rounded-lg bg-muted/40 px-2.5 py-1 font-mono-code text-sm">
                        {teamScores[cat] ?? 0}
                      </span>
                    </td>
                  ))}

                  <td className="px-5 py-3.5 text-right font-display text-2xl font-black text-neon-lime text-glow-lime">
                    {team.total}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Scoreboard;
