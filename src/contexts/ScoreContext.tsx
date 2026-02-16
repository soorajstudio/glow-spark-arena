import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TeamName = "Team A" | "Team B" | "Team C" | "Team D";
export type Category = "Break the Ice" | "Puzzle" | "Quiz" | "Match";

type Scores = Record<TeamName, Record<Category, number>>;

interface ScoreContextType {
  scores: Scores;
  addScore: (team: TeamName, category: Category, points: number) => void;
  getTotal: (team: TeamName) => number;
  getCategoryTotal: (team: TeamName, category: Category) => number;
  resetAll: () => void;
}

const teams: TeamName[] = ["Team A", "Team B", "Team C", "Team D"];
const categories: Category[] = ["Break the Ice", "Puzzle", "Quiz", "Match"];

const initialScores = (): Scores => {
  const s = {} as Scores;
  teams.forEach((t) => {
    s[t] = { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 };
  });
  return s;
};

const ScoreContext = createContext<ScoreContextType | null>(null);

export const useScore = () => {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
};

export const TEAMS = teams;
export const CATEGORIES = categories;

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<Scores>(initialScores);

  const addScore = useCallback((team: TeamName, category: Category, points: number) => {
    setScores((prev) => ({
      ...prev,
      [team]: { ...prev[team], [category]: prev[team][category] + points },
    }));
  }, []);

  const getTotal = useCallback(
    (team: TeamName) => Object.values(scores[team]).reduce((a, b) => a + b, 0),
    [scores]
  );

  const getCategoryTotal = useCallback(
    (team: TeamName, category: Category) => scores[team][category],
    [scores]
  );

  const resetAll = useCallback(() => setScores(initialScores()), []);

  return (
    <ScoreContext.Provider value={{ scores, addScore, getTotal, getCategoryTotal, resetAll }}>
      {children}
    </ScoreContext.Provider>
  );
};
