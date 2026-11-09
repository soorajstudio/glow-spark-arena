import React, { type ReactNode } from "react";
import { useEvent, type Team } from "./EventContext";

export type Category = "Break the Ice" | "Puzzle" | "Quiz" | "Match";
export type TeamName = string;

export const CATEGORIES: Category[] = ["Break the Ice", "Puzzle", "Quiz", "Match"];

export const useScore = () => {
  const { scores, addScore: addScoreEvent, getTeamTotal, resetAllScores, eventData } = useEvent();

  const addScore = (team: string, category: Category, points: number) => {
    // Find matching team or use id
    const found = eventData.teams.find((t) => t.name === team || t.id === team);
    const teamId = found ? found.id : team;
    addScoreEvent(teamId, category, points);
  };

  const getTotal = (team: string) => {
    const found = eventData.teams.find((t) => t.name === team || t.id === team);
    return getTeamTotal(found ? found.id : team);
  };

  const getCategoryTotal = (team: string, category: Category) => {
    const found = eventData.teams.find((t) => t.name === team || t.id === team);
    const teamId = found ? found.id : team;
    return scores[teamId]?.[category] || 0;
  };

  return {
    scores,
    addScore,
    getTotal,
    getCategoryTotal,
    resetAll: resetAllScores,
  };
};

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const TEAMS = ["Team A", "Team B", "Team C", "Team D"];
