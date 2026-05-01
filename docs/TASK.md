# Amazon. Diagnosed. — Self-Contained Build Prompt for Claude Code

**Audience:** A coding agent (Claude Code) starting cold with no prior context.
**Mission:** Build a complete, production-quality, top 0.001% web application with marketing landing page in a single session. Deploy to a live Vercel URL.
**Quality bar:** Every line must clear the "would a CEO put their name on this without revision" test. Two review passes mandatory before declaring done.
**Time pressure:** Ship fast, ship correct. Speed gates on quality, not the reverse.

---

## How to use this prompt

Save this file. Then from the project parent directory:

```bash
mkdir -p ~/projects/amazon-diagnosed-v2 && cd ~/projects/amazon-diagnosed-v2
claude --dangerously-skip-permissions "$(cat /path/to/this/prompt.md)"
```

Or pipe directly. Claude Code should run end-to-end: scaffold, build, test, deploy. No interactive interruption needed.

---

## 1. PRODUCT OVERVIEW

**Name:** Amazon. Diagnosed.
**Owner brand:** Neato (a 2P eCommerce accelerator)
**Pitch:** A free 9-question diagnostic that grades a brand's Amazon performance against the top 10% in their category. Outputs an interactive scorecard with three sub-scores (Growth, Profit, Defense), a dollar-value gap, three named gaps with diagnoses, and a downloadable PDF.

**Target user:** $10M+ consumer brand operators in pet, food/beverage, beauty, supplements categories. Three personas: CEO, CFO, VP eCommerce.

**Strategic goal:** Lead generation. Diagnostic completion → email capture → senior-team follow-up → booked discovery call → qualified opportunity → closed 2P partnership.

**Conversion target:** 10–15% diagnostic-to-meeting rate (honest, pressure-tested).

---

## 2. TECH STACK (LOCKED)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict mode, zero `any`) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui primitives where useful, hand-rolled where shadcn doesn't fit |
| Hosting | Vercel (`vercel deploy --prod`) |
| Validation | Zod for all form inputs and API boundaries |
| State | React server components + client hooks for diagnostic flow. NO global state library. |
| Email | Resend (transactional only) — STUB if no API key, write to console.log + return mock success |
| PDF | `@sparticuz/chromium` + Puppeteer in Vercel function — STUB v1 (return placeholder PDF URL) if dependency install delays the deploy |
| CRM | HubSpot Forms API (public submission, no auth) — STUB with console.log if portal/form GUIDs unavailable |
| Storage | Vercel Blob for PDF artifacts — STUB if not configured |
| Package manager | pnpm |

**Stub philosophy:** Anything that requires external credentials Arun must provide (HubSpot portal ID, form GUIDs, Resend API key, SmartScout API, Vercel Blob token) gets a clean stub with a `// TODO(env): swap when ARUN provides X` comment and a `lib/integrations/<service>.ts` file that throws an obvious error if env var is missing in production. The diagnostic flow, scoring, and results page MUST work end-to-end without ANY external integrations. The deploy MUST succeed without those env vars.

---

## 3. ROUTES

| Route | Purpose | Component type |
|---|---|---|
| `/` | Public marketing landing page | Server component |
| `/start` | Diagnostic Q1–Q6 (pre-email-gate, multi-step) | Client component, multi-step state machine |
| `/start/details` | Email gate + Q7–Q9 (post-gate) | Client component |
| `/results/[id]` | Interactive scorecard reveal (shareable URL) | Server component, reads from server state |
| `/methodology` | Public methodology page | Server component |
| `/api/submit-gate` | Server action: persist Q1–Q6 + email gate fields, return `gateId` | POST, returns `{ gateId: uuid }` |
| `/api/submit-final` | Server action: score diagnostic, persist all answers + scores, render PDF (stub okay), trigger email (stub okay), return `resultId` | POST, returns `{ resultId: uuid }` |
| `/api/pdf/[id]` | Direct PDF download — stub returns 302 to placeholder if Puppeteer unavailable | GET |

**Persistence:** For v1, in-memory store + filesystem JSON dump is acceptable IF Vercel deploy supports it (it does not — serverless is ephemeral). Use Vercel KV or Vercel Postgres if available; otherwise the simplest viable choice is a free-tier hosted Postgres or just write to Vercel Blob as `result-<id>.json`. **Pick the simplest path that survives a serverless cold start.** Document the choice in `docs/DECISIONS.md`.

**Embed compatibility (NICE TO HAVE, not blocking):** All `/start` and `/start/details` routes should be iframe-friendly. Set `Content-Security-Policy: frame-ancestors *.neato.com vercel.app` headers on those routes only. Use `postMessage` to send height to parent on every render via `ResizeObserver`. Don't block deploy on this — ship the standalone flow first.

---

## 4. BRAND SYSTEM

**Fonts:**
- Headings: **Lausanne** (or close substitute: `Inter` with `font-weight: 700`, `letter-spacing: -0.02em`)
- Body: **Inter** (Google Fonts, `font-weight: 400` and `500`)

**Colors — use the actual Neato brand palette. Do NOT invent shades.**

```ts
// tailwind.config.ts colors — these are the canonical Neato hex values
{
  brand: {
    tender:    '#075D44',   // signature green — primary CTAs, top-decile score color, hero accent
    sunset:    '#FF5C23',   // signature orange — accent only, never large fills, never on bg
    vault:     '#222223',   // true black — body text, dark surfaces
    almond:    '#F8F9FB',   // page background — clean off-white, NOT pure white
    oat:       '#F9F1ED',   // section background, warm neutral
    sesame:    '#6E6B66',   // muted text, captions, footnotes
    backbar:   '#E4E2DE',   // borders, dividers
    buttercream: '#FFF7BD', // highlight only, sparingly
    flamingo:  '#F9BBDD',   // accent only
  }
}
```

**Score color logic (apply to score numbers + benchmark visuals):**
- 0-39 (Critical/Underperforming): `#A6322B` (muted charcoal red, NOT stoplight red)
- 40-69 (Mid/Solid): `#B58A3A` (amber graphite)
- 70-100 (Top quartile/Top 10%): `#075D44` (Tender deep green)

**Visual rules (hard):**
- No gradients on backgrounds. Tender as a solid hero block is fine; soft gradient washes are not.
- No drop shadows. Use borders + spacing for hierarchy.
- No icons or illustrations. This is a tear-sheet, not a brochure.
- No stock photography, no spot art.
- Generous whitespace. Mobile-first — design for 375px viewport first.

**Visual style:**
- Editorial, confident, restrained. Think *The Atlantic* meets a senior consulting firm.
- Generous whitespace. Wide line-heights (1.5–1.7 body, 1.1–1.2 display).
- Display headlines large (clamp(2.5rem, 5vw, 4.5rem)).
- No gradients on text. No drop shadows. No glass effects. No emojis in copy.
- Buttons: solid `brand.accent` background, `brand.paper` text, no border, slight rounded corners (`rounded-md`), generous padding (`px-8 py-4`).
- Forms: large input targets, clear focus states, generous spacing.
- Mobile-first responsive — every section must look intentional on a 375px viewport.

**Logo placeholder:** Top-left wordmark "Neato" in Lausanne/Inter bold. No graphic mark. Footer: small "Neato" + nav links.

---

## 5. LANDING PAGE — FULL COPY

> Build a single-page LP at `/`. Every line below is shippable as-is.

### 5.1 Hero section (above the fold)

**H1:** `Amazon. Diagnosed.`
- Render as wordmark, full stop after each word, very tight line-height. The dot is the visual anchor.
- Display size, `brand.ink` color, font-weight 800.

**Sub-hook (immediately under H1, max 700px width):**
`Eight questions. Ninety seconds. We grade your Amazon against the top 10% in your category and put a dollar number on the gap.`

**Trust strip (single horizontal row beneath sub-hook, ÷ dividers):**
- Built on a 540M-ASIN dataset and Neato's portfolio P&L benchmarks
- Calibrated for $10M+ brands in pet, food/bev, beauty, supplements
- Methodology and sample size published on every score
- Scorecard hits your inbox in under two minutes

**Above-CTA killer line (italic, smoke color, 700px max width):**
`Most brands optimize Amazon for revenue. Top-decile brands optimize for profit per impression. Your dashboard shows you the first. Ours shows you the second.`

**Primary CTA button:** `Run the diagnostic` → links to `/start`

**Near-CTA de-personalization line (small, smoke color, under button):**
`We've operated Amazon for $10M+ brands across pet, food, beauty, and supplements. The score grades the operating model, not the operator.`

### 5.2 Hero validators (3 columns desktop, stacked mobile)

| # | Headline | Sub-line |
|---|---|---|
| 1 | **540M+ ASINs in the benchmark dataset** | SmartScout backbone + Neato Impact portfolio overlay. |
| 2 | **n= published on every score** | If we don't have enough peer data in your category, we label the score directional. We don't fake it. |
| 3 | **Calibrated for pet, food/bev, beauty, supplements** | Categories where Neato has operating P&L depth. Other categories use SmartScout-only benchmarks (and we'll tell you that on the score). |

### 5.3 "Built for three people" section

**H2:** `Built for three people who keep different scoreboards.`

Three stacked rows, each with persona label bolded:

> **CEO** — you want to know whether the brand beating you on Page 1 is also growing 2x. **Growth Score** answers it.
>
> **CFO** — you want to know which Amazon line items leak three to seven margin points without surfacing on a P&L line. **Profit Score** answers it.
>
> **VP eCom** — you want to know your Buy Box health, unauthorized-seller exposure, and where your content stacks. **Defense Score** answers it.

### 5.4 FAQ section (accordion, closed by default)

**H2:** `The five questions every CFO asks before clicking.`

**Q1. How long does this take?**
Eight questions, about ninety seconds. The optional ninth (drop a hero ASIN, see live benchmarks) adds thirty seconds. We've timed it.

**Q2. What data do you need from me?**
Revenue band, category, current operating model (1P, 2P, 3P, agency, hybrid), TACoS band, return-rate band, and your top frustrations. No P&L upload. No screen share. No SKU dump unless you choose to share an ASIN.

**Q3. What do you do with my answers?**
We score them, send you the result, and route you to the appropriate next step. We don't sell your data. We don't add you to a six-month nurture sequence. If you want a follow-up call, ask for one. If you don't, the scorecard is yours.

**Q4. Who sees the output?**
You. The senior partner reviewing the top 20% of completions sees the score (no PII beyond what you submit). Nobody outside Neato.

**Q5. Why should I trust your benchmarks?**
We publish the methodology and sample size on every sub-score. If we don't have enough peer data in your category to grade confidently (n<10), the score is labeled "directional" and visually downweighted. Most diagnostic tools don't do that. Most diagnostic tools also don't show you their math.

### 5.5 Methodology footer card

> **The math is published.** Four inputs per sub-score, all sourced (SmartScout, Neato Flow, portfolio P&L benchmarks). Sample size visible on every line. **[Read the full methodology →](/methodology)**

### 5.6 Final CTA repeat

H2: `Ready to see where you sit?`
Button: `Run the diagnostic` → `/start`

### 5.7 Footer

`© 2026 Neato. All rights reserved.` · `[Methodology](/methodology)` · `[Privacy](#)` · `[Contact](#)`

---

## 6. THE NINE QUESTIONS

> All 9 questions ship with verbatim copy below. Two-step UX: Q1–Q6 in `/start`, then email gate, then Q7–Q9 in `/start/details`. Q9 is OPTIONAL.
> Render: question copy as H2, helper text as small italic, answers as large click-targets (radio buttons styled as cards), one answer per click. Visible progress bar (e.g. "Question 3 of 9"). Animated transitions between questions (slide left on next, slide right on back).

### Q1. Where's your Amazon revenue today?
*Helper:* Annualized run rate is fine. Round if you have to.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | Under $5M | 2 |
| B | $5M–$10M | 4 |
| C | $10M–$25M | 6 |
| D | $25M–$75M | 8 |
| E | $75M+ | 10 |

### Q2. What's your contribution margin on Amazon, after fees, ads, and returns?
*Helper:* If you don't track it that way, give your best read. Most brands underestimate this number by 3-5 points.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | Negative or break-even | 1 |
| B | 1-10% | 3 |
| C | 11-20% | 6 |
| D | 21-30% | 8 |
| E | 30%+ | 10 |
| F | Not sure / don't track | 2 |

### Q3. Who runs Amazon for you today?
*Helper:* Pick the closest. Hybrid is fine if it's actually how you operate.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | In-house team, 3+ people | 7 |
| B | In-house, 1-2 people wearing other hats | 4 |
| C | Agency on retainer (we still own 1P/3P relationship) | 5 |
| D | 2P operator / aggregator (they buy our inventory) | 8 |
| E | Founder + part-time help / Fiverr / nothing structured | 2 |

### Q4. How would you describe your Amazon inventory and fulfillment situation?
*Helper:* Pick the answer closest to the last 90 days.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | FBA-only, rarely OOS | 8 |
| B | FBA-only, 1-3 OOS events per quarter on hero SKUs | 5 |
| C | FBA + FBM mix, occasional OOS | 6 |
| D | FBM-heavy or 3PL-routed (we manage units ourselves) | 4 |
| E | OOS more often than we'd like to admit | 1 |

### Q5. How exposed are you on brand defense — counterfeits, unauthorized sellers, MAP erosion?
*Helper:* If you've checked your hero SKU on Amazon in the last 30 days, you know.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | Locked down. Brand registry active, no unauthorized sellers I'm aware of, MAP holds. | 9 |
| B | Mostly clean, 1-2 unauthorized sellers we tolerate or chase quarterly. | 6 |
| C | Persistent unauthorized sellers, we play whack-a-mole. | 3 |
| D | MAP is broken on at least one hero SKU. | 2 |
| E | Honestly haven't checked recently. | 2 |

### Q6. Where do you sit in your category on Amazon today?
*Helper:* Best guess. The diagnostic adjusts using SmartScout category data on the back end.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | Top 3 in our subcategory | 9 |
| B | Top 10, not top 3 | 7 |
| C | Mid-pack. We exist, we're not winning. | 4 |
| D | Behind. We watch competitors out-position us on Page 1. | 2 |
| E | Not sure how to rank ourselves. | 3 |

### EMAIL GATE (between Q6 and Q7)

**Modal/page headline:** `You're 75% done. Where do we send the scorecard?`

**Body:** `Drop your email and we'll save your progress. Three more questions, one optional. The full scorecard hits your inbox in under two minutes.`

**Form fields:**

| Field | Type | Required |
|---|---|---|
| Email | text + email validator + disposable-email block list | Yes |
| First name | text | Yes |
| Company | text | Yes |
| Role | dropdown: CEO/Founder, CFO, VP eCommerce, Director eCommerce, Marketing Lead, Operations, Other | Yes |

**Submit button:** `Save my progress and continue`

**Privacy line (small, under button):** `One follow-up email with your scorecard. Nothing else unless you ask.`

**LinkedIn OAuth pre-fill (NICE TO HAVE):** "Continue with LinkedIn" button above the form. STUB if not configured — show button but log "OAuth not configured" on click and fall back to manual entry.

### Q7. What are your top 1-2 frustrations on Amazon right now? (multi-select, max 2)
*Helper:* Pick up to two. The honest answer beats the strategic one.

| Letter | Answer | Persona signal | Internal flag |
|---|---|---|---|
| A | Stagnant growth — we're up YoY but the category is up more | Growth | high-fit if Q1 ≥ C and Q8 ≥ ambitious |
| B | Margin pressure — Amazon is profitable but worse every quarter | Profit | high-fit CFO |
| C | Agency frustration — we're paying for output we could do ourselves | Profit + Growth | high-fit 2P pitch |
| D | Account health risk — suspensions, IP claims, listing pulls | Defense | urgency flag |
| E | Brand control — unauthorized sellers, MAP, counterfeits | Defense | high-fit VP eCom |
| F | Channel expansion stalled — TikTok Shop / Walmart can't operate | Growth | Phase 2 fit |
| G | Inventory and forecasting | Profit + Defense | ops-fit |
| H | Other | — | manual triage |

> Q7 is routing-only — no point score. Persists `frustrations: string[]` on the result.

### Q8. What does success on Amazon look like in twelve months?
*Helper:* Be honest. The growth score weights ambition against current scale.

| Letter | Answer | Score (0-10) |
|---|---|---|
| A | Hold the line. We're happy where we are. | 3 |
| B | Grow 20-40% on Amazon, status quo elsewhere | 6 |
| C | Grow 40%+ on Amazon AND launch one new channel (TikTok Shop, Walmart, DTC) | 9 |
| D | Replace our agency and build it in-house or with a 2P partner | 8 |
| E | Honestly, we want a partner who runs it for us so we can focus on retail and brand | 10 |

### Q9 (OPTIONAL). Want a live read on your hero ASIN?
*Helper:* +30 seconds, optional. Drop a hero ASIN and we pull live Buy Box health, unauthorized-seller exposure, and content completeness from the same SmartScout backbone the top 2P operators use. Skip and we'll use category-level benchmarks.

| Field | Type | Validation |
|---|---|---|
| ASIN | text input | regex `^B0[A-Z0-9]{8}$`, do not block on invalid — fall back to category benchmark |

**Skip button:** `Skip and finish` (equally weighted visually with Submit)
**Submit button:** `Submit and see my score`

> Q9 boost: when ASIN provided AND SmartScout integration is live, Defense input weight shifts to 80% measured. For v1, STUB this — set a flag `asin_provided: boolean` and add badge to results: "Defense score: live ASIN read coming +5 min" vs "Defense score: category-default benchmark."

### "We need a category" hidden field

> The 9 questions don't directly ask category. Add a category dropdown to the email gate (or as Q1.5 if cleaner): pet, food/bev, beauty, supplements, home, other. Required. Drives the gap calc and benchmarks.

---

## 7. SCORING ENGINE

> Build as a pure TypeScript module at `src/lib/scoring.ts`. Pure function `score(answers): ScoreResult`. Unit-tested with 5+ test cases. No I/O. No async. Portable.

### 7.1 Sub-score weight tables

```ts
type Answers = {
  q1: 'A' | 'B' | 'C' | 'D' | 'E'
  q2: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  q3: 'A' | 'B' | 'C' | 'D' | 'E'
  q4: 'A' | 'B' | 'C' | 'D' | 'E'
  q5: 'A' | 'B' | 'C' | 'D' | 'E'
  q6: 'A' | 'B' | 'C' | 'D' | 'E'
  q7: string[]    // up to 2 selected
  q8: 'A' | 'B' | 'C' | 'D' | 'E'
  q9?: string      // optional ASIN
  category: 'pet' | 'food-bev' | 'beauty' | 'supplements' | 'home' | 'other'
  frustration_count: number  // = q7.length
}

const ANSWER_SCORES = {
  q1: { A: 2, B: 4, C: 6, D: 8, E: 10 },
  q2: { A: 1, B: 3, C: 6, D: 8, E: 10, F: 2 },
  q3: { A: 7, B: 4, C: 5, D: 8, E: 2 },
  q4: { A: 8, B: 5, C: 6, D: 4, E: 1 },
  q5: { A: 9, B: 6, C: 3, D: 2, E: 2 },
  q6: { A: 9, B: 7, C: 4, D: 2, E: 3 },
  q8: { A: 3, B: 6, C: 9, D: 8, E: 10 },
}

// Q7 routing-only, no score. But frustration_count contributes to Profit slightly.
const Q7_PROFIT_BONUS = (count: number) => Math.min(count * 1, 2)  // 0, 1, or 2

const WEIGHTS = {
  growth:  { q1: 0.25, q3: 0.15, q6: 0.25, q7: 0.10, q8: 0.25 },
  profit:  { q1: 0.10, q2: 0.35, q3: 0.20, q4: 0.20, q7: 0.10, q8: 0.05 },
  defense: { q1: 0.05, q3: 0.15, q4: 0.25, q5: 0.30, q7: 0.10, q8: 0.05 },
  // Q9 (ASIN provided): if true, override 20% of defense from measured inputs (stub for v1: just adds +5 to defense)
}
```

### 7.2 Computation

For each sub-score:
1. Compute weighted sum of answer scores (each answer score is 0-10, weights sum to 1.0)
2. Multiply by 10 to land on 0-100
3. Add Q7 bonus where applicable (Profit only)
4. If Q9 provided AND sub-score is Defense: add +5 (stub for v1)
5. Clamp to [0, 100]

### 7.3 Score band mapping

```ts
const BANDS = [
  { min: 0,  max: 30,  label: 'Critical' },
  { min: 31, max: 55,  label: 'Underperforming' },
  { min: 56, max: 75,  label: 'Solid' },
  { min: 76, max: 89,  label: 'Top quartile' },
  { min: 90, max: 100, label: 'Top 10%' },
]
```

### 7.4 Overall score
`overall = round((growth + profit + defense) / 3)`

### 7.5 Gap calculation (dollar value)

```ts
const REVENUE_ANCHORS = {
  A: 3_000_000,
  B: 7_500_000,
  C: 17_500_000,
  D: 50_000_000,
  E: 100_000_000,
}

const CATEGORY_GROWTH_FACTORS = {
  pet: 1.0,
  'food-bev': 0.85,
  beauty: 1.15,
  supplements: 1.10,
  home: 0.90,
  other: 0.90,
}

const CATEGORY_CM = {
  pet: 0.22,
  'food-bev': 0.18,
  beauty: 0.30,
  supplements: 0.35,
  home: 0.22,
  other: 0.22,
}

// Top-decile baseline = 90
function gapMultipliers(scores: { growth: number; profit: number; defense: number }) {
  return {
    growth:  Math.min((90 - scores.growth) / 100, 0.6),
    profit:  Math.min((90 - scores.profit) / 100, 0.45),
    defense: Math.min((90 - scores.defense) / 100, 0.30),
  }
}

function dollarGap(answers: Answers, scores) {
  const anchor = REVENUE_ANCHORS[answers.q1]
  const catGrowth = CATEGORY_GROWTH_FACTORS[answers.category]
  const catCM = CATEGORY_CM[answers.category]
  const m = gapMultipliers(scores)

  const growthRev  = anchor * m.growth  * catGrowth
  const profitCM   = anchor * m.profit  * 0.5  // profit gap is margin-points → CM dollars
  const defenseRev = anchor * m.defense * 0.4

  const totalRev = growthRev + (profitCM / catCM) + defenseRev   // back to revenue equiv
  const totalCM  = totalRev * catCM

  return {
    revenue: { low: totalRev * 0.75, high: totalRev * 1.25 },
    cm:      { low: totalCM  * 0.75, high: totalCM  * 1.25 },
  }
}
```

### 7.6 Top 3 gaps

For v1: derive top 3 gaps as the three sub-score answers with the lowest score (after weighting). Label generically:
- If lowest is in Q5 (brand defense): "Brand defense exposure — unauthorized sellers and Buy Box drift"
- If lowest is in Q4 (inventory/OOS): "Stockout pattern on hero SKUs — Buy Box loss + lost sales"
- If lowest is in Q2 (margin): "Contribution margin retention — fee variance and ad efficiency leak"
- If lowest is in Q3 (operating model): "Operating model misfit for revenue scale — capacity gap"
- If lowest is in Q6 (category position): "Category share trajectory — losing ground on Page 1"
- If lowest is in Q1 (revenue): "Sub-scale on Amazon — under-leveraged channel"
- If lowest is in Q8 (ambition): "Conservative growth posture limits available upside"

For v2, replace with full library (30+ entries indexed by sub-score band + Q7 frustration). Document as TODO.

### 7.7 Result data structure

```ts
type ScoreResult = {
  id: string  // uuid
  computed_at: string  // ISO timestamp
  answers: Answers
  scores: {
    overall: number
    growth: number
    profit: number
    defense: number
  }
  bands: {
    overall: string
    growth: string
    profit: string
    defense: string
  }
  gap: {
    revenue: { low: number; high: number }
    cm:      { low: number; high: number }
  }
  top_gaps: string[]  // 3 entries
  asin_provided: boolean
  category: string
}
```

### 7.8 Test cases (mandatory)

Write Vitest unit tests for `scoring.ts`:

1. **Critical brand:** Q1=A, Q2=A, Q3=E, Q4=E, Q5=D, Q6=D, Q7=['D'], Q8=A, no ASIN, category=pet → all sub-scores ≤ 30
2. **Top decile brand:** Q1=E, Q2=E, Q3=D, Q4=A, Q5=A, Q6=A, Q7=[], Q8=E, ASIN=B0XXXXXXXX, category=beauty → all sub-scores ≥ 80
3. **Median brand:** Q1=C, Q2=C, Q3=B, Q4=B, Q5=B, Q6=C, Q7=['A','B'], Q8=B, no ASIN, category=pet → all sub-scores 45-65
4. **Margin-not-sure brand:** Q2=F → Profit sub-score reflects 2 (not 5) — "not sure" is a signal, not neutral
5. **Gap calc sanity:** $25M brand (Q1=C), Profit=42, category=pet → CM gap range $650K–$1.08M (±25% of computed value)

---

## 8. SCORE BAND NARRATIVES

> 5 narratives × 3 sub-scores = 15 total. Render verbatim. AC voice — short declaratives, belief-flips, specific numbers, dry deflation. Never use exclamation points. No "I" pronoun.

### Growth Score narratives

| Band | Narrative |
|---|---|
| 0-30 | Your category is moving 2-3x faster than you are. The brand beating you on Page 1 isn't beating you by 10%. They're operating in a different mode. |
| 31-55 | You're growing. The category is growing more. That's a share-loss story that doesn't show up as red on the dashboard until it's too late to course-correct cheaply. |
| 56-75 | You're keeping pace. Top-decile brands in your band are pulling 30-40% growth without adding ad spend. The gap is operating model, not effort. |
| 76-89 | You're winning more than you're losing. The remaining gap is one of: keyword coverage, organic-vs-paid mix, or category-share trajectory. We can name which. |
| 90-100 | You're top-decile on growth inputs at your scale. We probably can't tell you something your team doesn't already know on this axis. |

### Profit Score narratives

| Band | Narrative |
|---|---|
| 0-30 | You're either subsidizing Amazon to hold shelf or you don't have a clean read on what you're earning here. Both are fixable. Neither is fixable in the dashboard you have today. |
| 31-55 | Five line items leak 3-7 margin points on most $10M brands without surfacing on a P&L line. You're sitting on at least three of them. |
| 56-75 | Your contribution margin is in the median band for your category. Top-decile is 5-8 points above you, and the gap is mostly fee variance and ad efficiency, not pricing. |
| 76-89 | Healthy margin retention. The gap to top-decile is one or two specific line items, not a structural problem. |
| 90-100 | Top-decile margin retention. Your CFO already knows this and we'd be talking past you to claim otherwise. |

### Defense Score narratives

| Band | Narrative |
|---|---|
| 0-30 | Your brand is exposed. Buy Box loss, unauthorized sellers, or MAP erosion — pick one or all three. The cost is showing up in returns, reviews, and conversion rate, not in a single line item. |
| 31-55 | You have brand registry. You don't have brand defense. The difference shows up at the SKU level and bleeds at the category level. |
| 56-75 | You're holding the line. The remaining gap is either a routine Buy Box loss pattern or a content-completeness shortfall that costs you on conversion. |
| 76-89 | Strong defense posture. The score above this band requires weekly active monitoring, not quarterly cleanup. |
| 90-100 | Top-decile defense. If we missed something it's because you didn't share an ASIN. Add one and we'll re-score. |

---

## 9. RESULTS PAGE (`/results/[id]`)

> Server component. Reads result by id. Renders interactive scorecard. Shareable URL. No login required.

### 9.1 Loading state (handled if results aren't ready)

If result not yet computed, show:

> **Pulling category benchmarks…** *(1.5s)*
> **Scoring your inputs against the top 10%…** *(1.5s)*
> **Pricing the gap.** *(1.5s)*

Then redirect/refresh to populated results.

### 9.2 Reveal H1 + sub-hook

**H1:** `Here's where you sit.`
**Sub-hook:** `Three sub-scores. One overall. The three biggest gaps named, with a dollar range on closing them.`

### 9.3 Overall score callout

Large display number (e.g. `67`), `/100` smaller. Below: `Top-decile in [category] is 84. (n=[stub: "directional"])`

### 9.4 Three sub-score cards

Three side-by-side cards (stacked on mobile). Each card shows:
- Sub-score name (Growth / Profit / Defense)
- Score number (large, /100)
- Band label (`Solid`, `Critical`, etc.)
- Mini benchmark visual: a horizontal line with median dot + top-decile dot + your-score marker
- Narrative (from §8 above, verbatim by band)
- "How we measured this" expandable detail (collapsed by default — shows the questions and weights that fed the sub-score)

### 9.5 Gap callout (single horizontal block under cards)

> **Three gaps. One number.**
>
> **Closing them is worth $[X]M–$[Y]M in revenue, or roughly $[A]K–$[B]K in contribution margin annually.**
>
> *Range based on top-decile baseline ([category]) and your reported scale ([revenue band]). [Methodology →](/methodology)*

### 9.6 Top 3 gaps (stacked rows)

Each row:
- Gap label (one short noun phrase from §7.6)
- Diagnostic sentence (auto-generated for v1, library-driven for v2)
- "How we measured this" expandable

### 9.7 Two CTAs

**Primary:** `Book a 15-min review with a senior partner`
- Sub-copy: *No deck. We pull your audit on screen, walk through the three gaps, and tell you what closing them looks like. If we're not the right fit, we'll say so.*
- Link: STUB to `https://calendly.com/neato/diagnostic-review` (placeholder)

**Secondary:** `Email me the PDF`
- Sub-copy: *Hits your inbox in under two minutes. Forwardable. One page. No fluff.*
- Behavior: STUB — show "Sent. Check your inbox in 2 minutes." toast. Console.log the would-be Resend call.

### 9.8 Footer card

> **The math is published.** Four inputs per sub-score, sourced. Sample size on every benchmark. **[Read the full methodology →](/methodology)**

---

## 10. METHODOLOGY PAGE (`/methodology`)

Single static page. ~600-800 words. Sections:

1. **Why we built this.** Explain the omnichannel 2P thesis and why diagnosing is step zero.
2. **The four data sources.** SmartScout (540M ASINs), Neato Flow (operating data), Neato Impact (portfolio analytics), Neato P&L benchmarks (anonymized aggregates). Sample sizes per category.
3. **The three sub-scores.** What each measures, what feeds it. Reference §3 weight table.
4. **The gap calculation.** Plain-English version of §7.5. Worked example for a $25M pet brand.
5. **What we don't do.** No P&L upload. No screen share. No data sale. No six-month nurture if you don't ask for it.
6. **What "n=" means.** If we don't have ≥10 peer brands in your category at your revenue band, the score is labeled "directional" and visually downweighted. Honesty is the moat.
7. **Footer:** Contact link.

Voice: same AC-style declarative as the LP. Read like a serious operator wrote it for other serious operators.

---

## 11. AC VOICE / BANNED PHRASES

The product is **NOT** signed by AC anywhere in customer-facing surfaces. Per direct order from Arun Srinivasan (April 2026), Anthony Connelly (CEO) is OUT of:
- Sender name on any email
- Signed footer line
- Quoted text in body copy
- Video embed
- Named reference in any LP section

The voice (AC-derived editorial tone) IS used; the name and signature are NOT.

**Banned phrases (hard reject in QA):**
innovative · cutting-edge · best-in-class · synergy · leverage (verb) · disrupt · industry-leading · world-class · transformative · game-changer · ecosystem · holistic · at the end of the day · move the needle · circle back · touch base · bandwidth · thrilled to · excited to share · I think · I believe · in my opinion

**Required style:**
- Numbers over adjectives.
- Every claim with a number has a sample size or methodology pointer.
- Zero exclamation points.
- Em dashes okay where they earn the beat.
- Short declaratives. Belief-flips. Self-disqualifying trust lines.
- "We" voice except where individual signing is explicit (and there is no individual signing in v1 per Arun's order).

---

## 12. DEPLOY & DELIVERABLES

### 12.1 Repo

- Initialize a fresh git repo. Push to `arun-neato/amazon-diagnosed-v2` on GitHub if `gh auth status` works; otherwise leave local with clean commit history.
- Commit cadence: at least one commit per major section completed (scaffold, LP, diagnostic flow, scoring engine, results page, methodology page, deploy). Commit messages should be descriptive.

### 12.2 Deploy

**FIRST DEPLOY ORDER (do this BEFORE building the full app — you want a clickable URL up early so the human can watch progress):**

1. Build a minimal scaffold (LP shell + one Q1 page).
2. `vercel link` (create new project, name it whatever — `amazon-diagnosed-arun` is fine).
3. `vercel --prod`.
4. Hit the URL. **If you get HTTP 401 on every route, Vercel Deployment Protection is on by default for new Hobby projects.** Disable it manually:
   - Open: `https://vercel.com/<your-team>/<project-name>/settings/deployment-protection`
   - Set "Vercel Authentication" → **Disabled** (or "Public")
   - URL goes live in 30 seconds.
5. **If you get `TEAM_ACCESS_REQUIRED`** on deploy: the git author email isn't on the Vercel team. Workaround: deploy without git association first (`vercel --prod` from a directory that isn't `git init`'d), then connect git later. Or change git author to a known-team email.
6. **Fallback if Vercel is fundamentally blocked:** Netlify or Cloudflare Pages on free tier. Same Next.js build, no team-member checks. Document the choice.
7. Confirm clickable URL. THEN continue building.

The deployed URL must be functional end-to-end (when full build completes):
  - LP loads at `/`
  - Click `Run the diagnostic` → `/start` works
  - Walk Q1–Q6 → email gate → Q7–Q9 → submit → `/results/[id]` renders with computed scores
  - Results page is shareable (URL works in incognito)
  - Methodology page loads
- All routes return 200. No console errors. No hydration mismatches. No layout shift on mobile.

### 12.3 Env vars

Document in `.env.example`:

```
# Required for production (STUB if missing — app must still work)
HUBSPOT_PORTAL_ID=
HUBSPOT_GATE_FORM_GUID=
HUBSPOT_FINAL_FORM_GUID=
RESEND_API_KEY=
VERCEL_BLOB_READ_WRITE_TOKEN=
SMARTSCOUT_API_KEY=
DATABASE_URL=
```

For v1 deploy, NONE of these are required — the app must scaffold a working demo without them.

### 12.4 Documentation

In `/docs`:
- `README.md` — what this is, how to run locally, deploy command, env vars
- `DECISIONS.md` — every architectural choice with rationale (storage choice, persistence, stub strategy, etc.)
- `STATUS.md` — what's done, what's stubbed, what's remaining for v2

### 12.5 Quality gate before declaring done

Run all of these. Fix anything that fails:

```bash
pnpm install
pnpm typecheck    # zero errors
pnpm lint         # zero errors
pnpm test         # all scoring tests pass
pnpm build        # clean build
```

Then walk the deployed URL once on desktop, once on a mobile viewport (DevTools 375×667). Catch any:
- Layout breaks
- Color/font inconsistencies
- Copy typos or banned-phrase hits
- Console errors
- Slow loads

Two-pass review: substance (does the math/copy/flow work) THEN polish (does it look top 0.001%).

---

## 13. WHAT TO RETURN AT THE END

Print a final summary that includes:

1. **Live URL** (the Vercel production URL)
2. **GitHub repo URL** (if pushed)
3. **What's complete** (checklist of all 13 sections above)
4. **What's stubbed** (list of integrations skipped + the env vars needed to activate them)
5. **What's NOT in v1** (anything you punted — be honest, not defensive)
6. **Time elapsed** (rough estimate, useful for the race vs. Forge)
7. **Suggested v2 priorities** (top 3 things to build next)

---

## 14. STANDING ORDERS

These come from the project owner (Arun Srinivasan, VP Marketing at Neato). They override defaults:

1. **Quality bar is top 0.001%.** Not "good," not "solid" — top 0.001%. Anything below the bar gets held and fixed before delivery.
2. **Speed gates on quality, not the reverse.** Ship the moment the bar is cleared. Not a minute later. Not a minute earlier.
3. **No padding, no unrequested scope.** Build what's specified. Don't add features the spec doesn't ask for. Iterative > comprehensive.
4. **AC scrub is absolute.** Anthony Connelly's name appears nowhere in customer-facing surfaces.
5. **Two review passes mandatory before declaring done.** Pass 1: substance. Pass 2: polish.
6. **Honest stubs over fake completions.** If you didn't build it, say "stubbed" and explain why. Never claim completion of work that wasn't done.

---

## END OF SPEC

This is the complete brief. Everything to build the production product is above. Start with the scaffold + scoring engine + tests (the high-confidence, blocking-rest-of-build pieces), then LP, then diagnostic flow, then results page, then methodology page, then deploy.

Don't ask for clarification before starting. Make the call yourself when something is ambiguous, document the choice in `DECISIONS.md`, and keep moving. If you genuinely cannot proceed, surface the specific blocker — not a category of blockers.

Push hard. Ship.
