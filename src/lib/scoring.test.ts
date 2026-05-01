import { describe, it, expect } from "vitest";
import { score, type Answers } from "./scoring";

describe("scoring engine", () => {
  it("critical brand: all sub-scores <= 30", () => {
    const answers: Answers = {
      q1: "A",
      q2: "A",
      q3: "E",
      q4: "E",
      q5: "D",
      q6: "D",
      q7: ["D"],
      q8: "A",
      category: "pet",
    };
    const result = score(answers);

    expect(result.scores.growth).toBeLessThanOrEqual(30);
    expect(result.scores.profit).toBeLessThanOrEqual(30);
    expect(result.scores.defense).toBeLessThanOrEqual(30);
    expect(result.bands.overall).toBe("Critical");
  });

  it("top decile brand: all sub-scores >= 75", () => {
    const answers: Answers = {
      q1: "E",
      q2: "E",
      q3: "D",
      q4: "A",
      q5: "A",
      q6: "A",
      q7: ["A", "B"],
      q8: "E",
      q9: "B0XXXXXXXX",
      category: "beauty",
    };
    const result = score(answers);

    expect(result.scores.growth).toBeGreaterThanOrEqual(75);
    expect(result.scores.profit).toBeGreaterThanOrEqual(75);
    expect(result.scores.defense).toBeGreaterThanOrEqual(75);
    expect(result.asin_provided).toBe(true);
    // With top answers + frustrations + ASIN, should be top quartile or better
    expect(result.bands.overall).toMatch(/Top quartile|Top 10%/);
  });

  it("median brand: all sub-scores 45-65", () => {
    const answers: Answers = {
      q1: "C",
      q2: "C",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "C",
      q7: ["A", "B"],
      q8: "B",
      category: "pet",
    };
    const result = score(answers);

    expect(result.scores.growth).toBeGreaterThanOrEqual(45);
    expect(result.scores.growth).toBeLessThanOrEqual(65);
    expect(result.scores.profit).toBeGreaterThanOrEqual(45);
    expect(result.scores.profit).toBeLessThanOrEqual(65);
    expect(result.scores.defense).toBeGreaterThanOrEqual(45);
    expect(result.scores.defense).toBeLessThanOrEqual(65);
  });

  it("margin-not-sure brand: Q2=F reflects score of 2", () => {
    const answers: Answers = {
      q1: "C",
      q2: "F",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "C",
      q7: ["A"],
      q8: "B",
      category: "pet",
    };
    const result = score(answers);

    // Profit should be noticeably lower due to Q2=F (score 2 vs normal 6 for C)
    const answersWithC: Answers = { ...answers, q2: "C" };
    const resultWithC = score(answersWithC);

    expect(result.scores.profit).toBeLessThan(resultWithC.scores.profit);
  });

  it("gap calc sanity: $17.5M brand, Profit=42, category=pet", () => {
    // Build answers that produce profit ~42
    const answers: Answers = {
      q1: "C",
      q2: "B",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "C",
      q7: ["A"],
      q8: "B",
      category: "pet",
    };
    const result = score(answers);

    // CM gap should be in a reasonable range for a $17.5M pet brand
    expect(result.gap.cm.low).toBeGreaterThan(0);
    expect(result.gap.cm.high).toBeGreaterThan(result.gap.cm.low);
    expect(result.gap.revenue.high).toBeGreaterThan(0);
  });

  it("returns 3 top gaps", () => {
    const answers: Answers = {
      q1: "C",
      q2: "C",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "C",
      q7: ["A", "B"],
      q8: "B",
      category: "pet",
    };
    const result = score(answers);
    expect(result.top_gaps).toHaveLength(3);
  });

  it("overall score is average of three sub-scores", () => {
    const answers: Answers = {
      q1: "C",
      q2: "C",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "C",
      q7: [],
      q8: "B",
      category: "pet",
    };
    const result = score(answers);
    const expected = Math.round(
      (result.scores.growth + result.scores.profit + result.scores.defense) / 3,
    );
    expect(result.scores.overall).toBe(expected);
  });
});
