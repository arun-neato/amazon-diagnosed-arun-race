/**
 * Amazon. Diagnosed. — Scoring Engine
 *
 * Pure function. No I/O. No async. Unit-tested.
 */

import { v4 as uuid } from "uuid";

// --- Types ---

export type Category =
  | "pet"
  | "food-bev"
  | "beauty"
  | "supplements"
  | "home"
  | "other";

export type Answers = {
  q1: "A" | "B" | "C" | "D" | "E";
  q2: "A" | "B" | "C" | "D" | "E" | "F";
  q3: "A" | "B" | "C" | "D" | "E";
  q4: "A" | "B" | "C" | "D" | "E";
  q5: "A" | "B" | "C" | "D" | "E";
  q6: "A" | "B" | "C" | "D" | "E";
  q7: string[];
  q8: "A" | "B" | "C" | "D" | "E";
  q9?: string;
  category: Category;
};

export type ScoreResult = {
  id: string;
  computed_at: string;
  answers: Answers;
  scores: {
    overall: number;
    growth: number;
    profit: number;
    defense: number;
  };
  bands: {
    overall: string;
    growth: string;
    profit: string;
    defense: string;
  };
  gap: {
    revenue: { low: number; high: number };
    cm: { low: number; high: number };
  };
  top_gaps: string[];
  asin_provided: boolean;
  category: string;
};

// --- Constants ---

const ANSWER_SCORES: Record<string, Record<string, number>> = {
  q1: { A: 2, B: 4, C: 6, D: 8, E: 10 },
  q2: { A: 1, B: 3, C: 6, D: 8, E: 10, F: 2 },
  q3: { A: 7, B: 4, C: 5, D: 8, E: 2 },
  q4: { A: 8, B: 5, C: 6, D: 4, E: 1 },
  q5: { A: 9, B: 6, C: 3, D: 2, E: 2 },
  q6: { A: 9, B: 7, C: 4, D: 2, E: 3 },
  q8: { A: 3, B: 6, C: 9, D: 8, E: 10 },
};

const WEIGHTS = {
  growth: { q1: 0.25, q3: 0.15, q6: 0.25, q8: 0.25, q7: 0.1 },
  profit: { q1: 0.1, q2: 0.35, q3: 0.2, q4: 0.2, q8: 0.05, q7: 0.1 },
  defense: { q1: 0.05, q3: 0.15, q4: 0.25, q5: 0.3, q8: 0.05, q7: 0.1 },
};

const BANDS: Array<{ min: number; max: number; label: string }> = [
  { min: 0, max: 30, label: "Critical" },
  { min: 31, max: 55, label: "Underperforming" },
  { min: 56, max: 75, label: "Solid" },
  { min: 76, max: 89, label: "Top quartile" },
  { min: 90, max: 100, label: "Top 10%" },
];

const REVENUE_ANCHORS: Record<string, number> = {
  A: 3_000_000,
  B: 7_500_000,
  C: 17_500_000,
  D: 50_000_000,
  E: 100_000_000,
};

const CATEGORY_GROWTH_FACTORS: Record<Category, number> = {
  pet: 1.0,
  "food-bev": 0.85,
  beauty: 1.15,
  supplements: 1.1,
  home: 0.9,
  other: 0.9,
};

const CATEGORY_CM: Record<Category, number> = {
  pet: 0.22,
  "food-bev": 0.18,
  beauty: 0.3,
  supplements: 0.35,
  home: 0.22,
  other: 0.22,
};

const GAP_LABELS: Record<string, string> = {
  q5: "Brand defense exposure — unauthorized sellers and Buy Box drift",
  q4: "Stockout pattern on hero SKUs — Buy Box loss + lost sales",
  q2: "Contribution margin retention — fee variance and ad efficiency leak",
  q3: "Operating model misfit for revenue scale — capacity gap",
  q6: "Category share trajectory — losing ground on Page 1",
  q1: "Sub-scale on Amazon — channel not yet earning its weight",
  q8: "Conservative growth posture limits available upside",
};

// --- Helpers ---

function q7ProfitBonus(count: number): number {
  return Math.min(count * 1, 2);
}

function getBand(score: number): string {
  for (const band of BANDS) {
    if (score >= band.min && score <= band.max) {
      return band.label;
    }
  }
  return "Critical";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getAnswerScore(question: string, answer: string): number {
  return ANSWER_SCORES[question]?.[answer] ?? 0;
}

// --- Sub-score computation ---

function computeSubScore(
  subscoreName: "growth" | "profit" | "defense",
  answers: Answers,
): number {
  const weights = WEIGHTS[subscoreName];
  let weightedSum = 0;

  for (const [question, weight] of Object.entries(weights)) {
    if (question === "q7") {
      // Q7 is routing-only — use frustration count as a proxy score (0-10 scale)
      const frustrationScore = Math.min(answers.q7.length * 5, 10);
      weightedSum += frustrationScore * weight;
    } else {
      const answer = answers[question as keyof Answers] as string;
      const answerScore = getAnswerScore(question, answer);
      weightedSum += answerScore * weight;
    }
  }

  let result = weightedSum * 10;

  // Q7 profit bonus
  if (subscoreName === "profit") {
    result += q7ProfitBonus(answers.q7.length);
  }

  // Q9 ASIN defense boost (stub: +5)
  if (subscoreName === "defense" && answers.q9) {
    result += 5;
  }

  return clamp(Math.round(result), 0, 100);
}

// --- Gap calculation ---

function gapMultipliers(scores: {
  growth: number;
  profit: number;
  defense: number;
}): { growth: number; profit: number; defense: number } {
  return {
    growth: Math.max(Math.min((90 - scores.growth) / 100, 0.6), 0),
    profit: Math.max(Math.min((90 - scores.profit) / 100, 0.45), 0),
    defense: Math.max(Math.min((90 - scores.defense) / 100, 0.3), 0),
  };
}

function dollarGap(
  answers: Answers,
  scores: { growth: number; profit: number; defense: number },
): { revenue: { low: number; high: number }; cm: { low: number; high: number } } {
  const anchor = REVENUE_ANCHORS[answers.q1];
  const catGrowth = CATEGORY_GROWTH_FACTORS[answers.category];
  const catCM = CATEGORY_CM[answers.category];
  const m = gapMultipliers(scores);

  const growthRev = anchor * m.growth * catGrowth;
  const profitCM = anchor * m.profit * 0.5;
  const defenseRev = anchor * m.defense * 0.4;

  const totalRev = growthRev + profitCM / catCM + defenseRev;
  const totalCM = totalRev * catCM;

  return {
    revenue: {
      low: Math.round(totalRev * 0.75),
      high: Math.round(totalRev * 1.25),
    },
    cm: { low: Math.round(totalCM * 0.75), high: Math.round(totalCM * 1.25) },
  };
}

// --- Top 3 gaps ---

function computeTopGaps(answers: Answers): string[] {
  const scoredQuestions = ["q1", "q2", "q3", "q4", "q5", "q6", "q8"];
  const scored = scoredQuestions.map((q) => {
    const answer = answers[q as keyof Answers] as string;
    return {
      question: q,
      score: getAnswerScore(q, answer),
    };
  });

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, 3).map((s) => GAP_LABELS[s.question]);
}

// --- Main scoring function ---

export function score(answers: Answers): ScoreResult {
  const growth = computeSubScore("growth", answers);
  const profit = computeSubScore("profit", answers);
  const defense = computeSubScore("defense", answers);
  const overall = Math.round((growth + profit + defense) / 3);

  const scores = { overall, growth, profit, defense };
  const gap = dollarGap(answers, { growth, profit, defense });
  const top_gaps = computeTopGaps(answers);

  return {
    id: uuid(),
    computed_at: new Date().toISOString(),
    answers,
    scores,
    bands: {
      overall: getBand(overall),
      growth: getBand(growth),
      profit: getBand(profit),
      defense: getBand(defense),
    },
    gap,
    top_gaps,
    asin_provided: Boolean(answers.q9),
    category: answers.category,
  };
}
