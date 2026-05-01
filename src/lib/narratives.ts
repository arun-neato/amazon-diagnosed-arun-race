type NarrativeMap = Record<string, string>;

export const GROWTH_NARRATIVES: NarrativeMap = {
  "0-30":
    "Your category is moving 2\u20133x faster than you are. The brand beating you on Page 1 isn't beating you by 10%. They're operating in a different mode.",
  "31-55":
    "You're growing. The category is growing more. That's a share-loss story that doesn't show up as red on the dashboard until it's too late to course-correct cheaply.",
  "56-75":
    "You're keeping pace. Top-decile brands in your band are pulling 30\u201340% growth without adding ad spend. The gap is operating model, not effort.",
  "76-89":
    "You're winning more than you're losing. The remaining gap is one of: keyword coverage, organic-vs-paid mix, or category-share trajectory. We can name which.",
  "90-100":
    "You're top-decile on growth inputs at your scale. We probably can't tell you something your team doesn't already know on this axis.",
};

export const PROFIT_NARRATIVES: NarrativeMap = {
  "0-30":
    "You're either subsidizing Amazon to hold shelf or you don't have a clean read on what you're earning here. Both are fixable. Neither is fixable in the dashboard you have today.",
  "31-55":
    "Five line items leak 3\u20137 margin points on most $10M brands without surfacing on a P&L line. You're sitting on at least three of them.",
  "56-75":
    "Your contribution margin is in the median band for your category. Top-decile is 5\u20138 points above you, and the gap is mostly fee variance and ad efficiency, not pricing.",
  "76-89":
    "Healthy margin retention. The gap to top-decile is one or two specific line items, not a structural problem.",
  "90-100":
    "Top-decile margin retention. Your CFO already knows this and we'd be talking past you to claim otherwise.",
};

export const DEFENSE_NARRATIVES: NarrativeMap = {
  "0-30":
    "Your brand is exposed. Buy Box loss, unauthorized sellers, or MAP erosion \u2014 pick one or all three. The cost is showing up in returns, reviews, and conversion rate, not in a single line item.",
  "31-55":
    "You have brand registry. You don't have brand defense. The difference shows up at the SKU level and bleeds at the category level.",
  "56-75":
    "You're holding the line. The remaining gap is either a routine Buy Box loss pattern or a content-completeness shortfall that costs you on conversion.",
  "76-89":
    "Strong defense posture. The score above this band requires weekly active monitoring, not quarterly cleanup.",
  "90-100":
    "Top-decile defense. If we missed something it's because you didn't share an ASIN. Add one and we'll re-score.",
};

export function getNarrative(
  subscoreName: "growth" | "profit" | "defense",
  score: number,
): string {
  const map =
    subscoreName === "growth"
      ? GROWTH_NARRATIVES
      : subscoreName === "profit"
        ? PROFIT_NARRATIVES
        : DEFENSE_NARRATIVES;

  if (score <= 30) return map["0-30"];
  if (score <= 55) return map["31-55"];
  if (score <= 75) return map["56-75"];
  if (score <= 89) return map["76-89"];
  return map["90-100"];
}
