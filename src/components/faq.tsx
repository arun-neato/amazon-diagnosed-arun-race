"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How long does this take?",
    a: "Eight questions, about ninety seconds. The optional ninth (drop a hero ASIN, see live benchmarks) adds thirty seconds. We've timed it.",
  },
  {
    q: "What data do you need from me?",
    a: "Revenue band, category, current operating model (1P, 2P, 3P, agency, hybrid), TACoS band, return-rate band, and your top frustrations. No P&L upload. No screen share. No SKU dump unless you choose to share an ASIN.",
  },
  {
    q: "What do you do with my answers?",
    a: "We score them, send you the result, and route you to the appropriate next step. We don't sell your data. We don't add you to a six-month nurture sequence. If you want a follow-up call, ask for one. If you don't, the scorecard is yours.",
  },
  {
    q: "Who sees the output?",
    a: "You. The senior partner reviewing the top 20% of completions sees the score (no PII beyond what you submit). Nobody outside Neato.",
  },
  {
    q: "Why should I trust your benchmarks?",
    a: 'We publish the methodology and sample size on every sub-score. If we don\'t have enough peer data in your category to grade confidently (n<10), the score is labeled "directional" and visually downweighted. Most diagnostic tools don\'t do that. Most diagnostic tools also don\'t show you their math.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-backbar">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <span className="pr-4 text-base font-semibold text-brand-vault">
              {faq.q}
            </span>
            <span
              className="flex-shrink-0 text-brand-sesame transition-transform duration-200"
              style={{
                transform:
                  openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="10" y1="4" x2="10" y2="16" />
                <line x1="4" y1="10" x2="16" y2="10" />
              </svg>
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-200"
            style={{
              maxHeight: openIndex === i ? "300px" : "0px",
              opacity: openIndex === i ? 1 : 0,
            }}
          >
            <p className="pb-5 text-sm leading-relaxed text-brand-sesame">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
