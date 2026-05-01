"use client";

import { useState } from "react";
import Link from "next/link";
import { type ScoreResult } from "@/lib/scoring";
import { getNarrative } from "@/lib/narratives";

function scoreColor(score: number): string {
  if (score <= 39) return "var(--color-score-critical)";
  if (score <= 69) return "var(--color-score-mid)";
  return "var(--color-score-top)";
}

function formatDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  pet: "Pet",
  "food-bev": "Food & Beverage",
  beauty: "Beauty",
  supplements: "Supplements",
  home: "Home",
  other: "Other",
};

const SUBSCORE_WEIGHTS: Record<string, Record<string, string>> = {
  growth: {
    "Revenue scale (Q1)": "25%",
    "Operating model (Q3)": "15%",
    "Category position (Q6)": "25%",
    "Frustration signal (Q7)": "10%",
    "Growth ambition (Q8)": "25%",
  },
  profit: {
    "Revenue scale (Q1)": "10%",
    "Contribution margin (Q2)": "35%",
    "Operating model (Q3)": "20%",
    "Fulfillment (Q4)": "20%",
    "Growth ambition (Q8)": "5%",
    "Frustration signal (Q7)": "10%",
  },
  defense: {
    "Revenue scale (Q1)": "5%",
    "Operating model (Q3)": "15%",
    "Fulfillment (Q4)": "25%",
    "Brand defense (Q5)": "30%",
    "Growth ambition (Q8)": "5%",
    "Frustration signal (Q7)": "10%",
  },
};

function BenchmarkBar({ score: s }: { score: number }) {
  const median = 50;
  const topDecile = 84;
  return (
    <div className="relative mt-4 h-2 w-full rounded-full bg-brand-backbar">
      {/* Median marker */}
      <div
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-sesame"
        style={{ left: `${median}%` }}
        title={`Median: ${median}`}
      />
      {/* Top decile marker */}
      <div
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-tender"
        style={{ left: `${Math.min(topDecile, 100)}%` }}
        title={`Top 10%: ${topDecile}`}
      />
      {/* Your score */}
      <div
        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white"
        style={{
          left: `${Math.min(s, 100)}%`,
          backgroundColor: scoreColor(s),
        }}
        title={`Your score: ${s}`}
      />
    </div>
  );
}

function SubScoreCard({
  name,
  score: s,
  band,
}: {
  name: "growth" | "profit" | "defense";
  score: number;
  band: string;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const narrative = getNarrative(name, s);
  const weights = SUBSCORE_WEIGHTS[name];

  return (
    <div className="rounded-lg border border-brand-backbar bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-sesame">
        {displayName} Score
      </p>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="text-4xl font-extrabold"
          style={{ color: scoreColor(s) }}
        >
          {s}
        </span>
        <span className="text-lg text-brand-sesame">/100</span>
      </div>
      <p
        className="mt-1 text-sm font-semibold"
        style={{ color: scoreColor(s) }}
      >
        {band}
      </p>

      <BenchmarkBar score={s} />
      <div className="mt-1 flex justify-between text-xs text-brand-sesame">
        <span>Median</span>
        <span>Top 10%</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-brand-vault">
        {narrative}
      </p>

      <button
        onClick={() => setShowDetail(!showDetail)}
        className="mt-4 text-xs font-medium text-brand-tender transition-colors hover:text-brand-tender/80"
      >
        {showDetail ? "Hide" : "How we measured this"}{" "}
        {showDetail ? "\u25B2" : "\u25BC"}
      </button>
      {showDetail && (
        <div className="mt-3 space-y-1 border-t border-brand-backbar pt-3">
          {Object.entries(weights).map(([label, weight]) => (
            <div
              key={label}
              className="flex justify-between text-xs text-brand-sesame"
            >
              <span>{label}</span>
              <span className="font-mono">{weight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultsClient({ result }: { result: ScoreResult }) {
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const categoryLabel = CATEGORY_LABELS[result.category] || result.category;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-brand-vault sm:text-4xl">
        Here&apos;s where you sit.
      </h1>
      <p className="mt-3 max-w-[600px] text-base text-brand-sesame">
        Three sub-scores. One overall. The three biggest gaps named, with a
        dollar range on closing them.
      </p>

      {/* Overall score */}
      <div className="mt-10 rounded-lg border border-brand-backbar bg-white p-8 sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-6xl font-extrabold sm:text-7xl"
                style={{ color: scoreColor(result.scores.overall) }}
              >
                {result.scores.overall}
              </span>
              <span className="text-2xl text-brand-sesame">/100</span>
            </div>
            <p
              className="mt-1 text-lg font-semibold"
              style={{ color: scoreColor(result.scores.overall) }}
            >
              {result.bands.overall}
            </p>
          </div>
          <div className="text-sm text-brand-sesame">
            <p>
              Top-decile in {categoryLabel} is 84.{" "}
              <span className="italic">(n=directional)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Three sub-score cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <SubScoreCard
          name="growth"
          score={result.scores.growth}
          band={result.bands.growth}
        />
        <SubScoreCard
          name="profit"
          score={result.scores.profit}
          band={result.bands.profit}
        />
        <SubScoreCard
          name="defense"
          score={result.scores.defense}
          band={result.bands.defense}
        />
      </div>

      {/* Gap callout */}
      <div className="mt-10 rounded-lg border border-brand-backbar bg-brand-oat p-8 sm:p-10">
        <p className="text-lg font-bold text-brand-vault">
          Three gaps. One number.
        </p>
        <p className="mt-3 text-base leading-relaxed text-brand-vault">
          Closing them is worth{" "}
          <span className="font-bold">
            {formatDollars(result.gap.revenue.low)}&ndash;
            {formatDollars(result.gap.revenue.high)}
          </span>{" "}
          in revenue, or roughly{" "}
          <span className="font-bold">
            {formatDollars(result.gap.cm.low)}&ndash;
            {formatDollars(result.gap.cm.high)}
          </span>{" "}
          in contribution margin annually.
        </p>
        <p className="mt-2 text-sm italic text-brand-sesame">
          Range based on top-decile baseline ({categoryLabel}) and your reported
          scale.{" "}
          <Link
            href="/methodology"
            className="text-brand-tender underline underline-offset-2"
          >
            Methodology &rarr;
          </Link>
        </p>
      </div>

      {/* Top 3 gaps */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-brand-vault">
          Your three biggest gaps
        </h2>
        <div className="mt-6 space-y-4">
          {result.top_gaps.map((gap, i) => (
            <div
              key={i}
              className="rounded-lg border border-brand-backbar bg-white p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-tender text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-base font-semibold text-brand-vault">
                  {gap}
                </p>
              </div>
            </div>
          ))}
        </div>

        {result.asin_provided ? (
          <p className="mt-4 text-sm text-brand-sesame">
            Defense score: live ASIN read coming +5 min
          </p>
        ) : (
          <p className="mt-4 text-sm text-brand-sesame">
            Defense score: category-default benchmark. Add an ASIN for a live
            read.
          </p>
        )}
      </div>

      {/* CTAs */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-brand-backbar bg-white p-6">
          <a
            href="https://calendly.com/neato/diagnostic-review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-md bg-brand-tender px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-brand-tender/90"
          >
            Book a 15-min review with a senior partner
          </a>
          <p className="mt-3 text-sm leading-relaxed text-brand-sesame">
            No deck. We pull your audit on screen, walk through the three gaps,
            and tell you what closing them looks like. If we&apos;re not the
            right fit, we&apos;ll say so.
          </p>
        </div>
        <div className="rounded-lg border border-brand-backbar bg-white p-6">
          <button
            onClick={async () => {
              setEmailSending(true);
              try {
                await fetch(`/api/pdf/${result.id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: result.answers.q1 ? undefined : undefined,
                  }),
                });
                setEmailSent(true);
              } catch {
                // Still show success — the server-side email fires on submit
              } finally {
                setEmailSending(false);
              }
            }}
            disabled={emailSent || emailSending}
            className="w-full rounded-md border-2 border-brand-tender bg-white px-8 py-4 text-center text-base font-semibold text-brand-tender transition-colors hover:bg-brand-tender/5 disabled:opacity-60"
          >
            {emailSent
              ? "Sent. Check your inbox in 2 minutes."
              : emailSending
                ? "Generating PDF..."
                : "Email me the PDF"}
          </button>
          <p className="mt-3 text-sm leading-relaxed text-brand-sesame">
            Hits your inbox in under two minutes. Forwardable. One page. No
            fluff.
          </p>
        </div>
      </div>

      {/* Methodology footer */}
      <div className="mt-12 rounded-lg border border-brand-backbar bg-white p-8 sm:p-10">
        <p className="text-base leading-relaxed text-brand-vault">
          <span className="font-bold">The math is published.</span> Four inputs
          per sub-score, sourced. Sample size on every benchmark.{" "}
          <Link
            href="/methodology"
            className="font-semibold text-brand-tender underline decoration-brand-tender/30 underline-offset-2 transition-colors hover:text-brand-tender/80"
          >
            Read the full methodology &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
