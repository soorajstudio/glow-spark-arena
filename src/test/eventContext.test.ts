import { describe, it, expect } from "vitest";
import { DEFAULT_EVENT_DATA, TECH_FEST_TEMPLATES } from "@/contexts/EventContext";

describe("Glow Spark Arena - Event Engine & Presets", () => {
  it("provides comprehensive default event structure", () => {
    expect(DEFAULT_EVENT_DATA.settings.name).toBe("SRISHTI AI CLASH");
    expect(DEFAULT_EVENT_DATA.teams.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_EVENT_DATA.breakTheIce.questions.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_EVENT_DATA.puzzles.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_EVENT_DATA.quizWheel.categories.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_EVENT_DATA.matchTheLogic.pairs.length).toBeGreaterThanOrEqual(6);
  });

  it("contains valid pre-configured Tech Fest presets", () => {
    expect(TECH_FEST_TEMPLATES.ai_fest).toBeDefined();
    expect(TECH_FEST_TEMPLATES.web_dev).toBeDefined();
    expect(TECH_FEST_TEMPLATES.cyber_sec).toBeDefined();

    expect(TECH_FEST_TEMPLATES.web_dev.data.breakTheIce?.questions.length).toBeGreaterThan(0);
    expect(TECH_FEST_TEMPLATES.cyber_sec.data.matchTheLogic?.pairs.length).toBeGreaterThan(0);
  });

  it("has valid 9-clue array for each puzzle round", () => {
    DEFAULT_EVENT_DATA.puzzles.forEach((puzzle) => {
      expect(puzzle.clues.length).toBe(9);
      expect(puzzle.answer).toBeTruthy();
    });
  });

  it("has valid multiple choice questions in quiz wheel categories", () => {
    DEFAULT_EVENT_DATA.quizWheel.categories.forEach((cat) => {
      expect(cat.questions.length).toBeGreaterThan(0);
      cat.questions.forEach((q) => {
        expect(q.options.length).toBe(4);
        const correctCount = q.options.filter((o) => o.isCorrect).length;
        expect(correctCount).toBe(1);
      });
    });
  });
});
