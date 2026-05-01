"use client";

import { useState } from "react";
import Link from "next/link";
import { type ScoreResult } from "@/lib/scoring";
import { ResultsClient } from "./results-client";

export function ResultsFallback({ id }: { id: string }) {
  const [result] = useState<ScoreResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(`result-${id}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as ScoreResult;
    } catch {
      return null;
    }
  });

  if (result) {
    return <ResultsClient result={result} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-brand-vault">
        Scorecard not found
      </h1>
      <p className="mt-3 text-brand-sesame">
        This result may have expired or the link is invalid. Run the diagnostic
        again to get a fresh scorecard.
      </p>
      <Link
        href="/start"
        className="mt-6 inline-block rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90"
      >
        Run the diagnostic
      </Link>
    </div>
  );
}
