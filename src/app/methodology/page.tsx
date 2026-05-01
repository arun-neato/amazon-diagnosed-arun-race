import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-brand-almond">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-extrabold text-brand-vault sm:text-4xl">
            Methodology
          </h1>

          {/* 1. Why we built this */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              Why we built this
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              Amazon is the largest eCommerce channel for most consumer brands.
              It is also the hardest to diagnose. The standard dashboard shows
              revenue, ad spend, and return rate. It does not show profit per
              impression, Buy Box drift, or unauthorized-seller bleed. The
              result: brands optimize for the metrics they can see, which are
              revenue metrics. Top-decile brands optimize for the metrics that
              compound, which are margin metrics.
            </p>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              The diagnostic exists to surface the gap between those two
              approaches in under two minutes, without requiring a P&amp;L
              upload, a screen share, or a sales call. Diagnosing is step zero.
              The 2P thesis &mdash; a model where a partner operates your Amazon
              as a full-stack channel, buying inventory and owning the P&amp;L
              &mdash; only makes sense when the gap is clear and the operator fit
              is proven.
            </p>
          </section>

          {/* 2. Four data sources */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              The four data sources
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  SmartScout (540M+ ASINs)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Category-level revenue estimates, seller counts, brand
                  presence, Buy Box ownership, and ASIN-level competitive
                  intelligence. This is the backbone of the benchmark dataset.
                  Sample sizes by category: pet (48K+ brands), food/bev (62K+),
                  beauty (71K+), supplements (34K+), home (89K+).
                </p>
              </div>
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  Neato Flow (operating data)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Real-time operational metrics from brands Neato currently
                  operates. Includes fulfillment velocity, restock timing,
                  advertising efficiency curves, and content-score benchmarks.
                </p>
              </div>
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  Neato Impact (portfolio analytics)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Aggregate performance data across the Neato 2P portfolio.
                  Anonymized, category-indexed. Used to set the top-decile
                  baseline for brands at each revenue band.
                </p>
              </div>
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  P&amp;L benchmarks (anonymized)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Contribution margin benchmarks from Neato-operated brands,
                  broken out by category: pet (22%), food/bev (18%), beauty
                  (30%), supplements (35%), home (22%). These are median figures
                  for brands in the $10M&ndash;$75M band with mature Amazon
                  operations.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Three sub-scores */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              The three sub-scores
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  Growth Score (0&ndash;100)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Measures category momentum relative to scale. Inputs: revenue
                  scale (25%), operating model fit (15%), category position
                  (25%), frustration signal (10%), and growth ambition (25%).
                  High scores mean the brand is growing at or above category
                  rate at its scale band.
                </p>
              </div>
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  Profit Score (0&ndash;100)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Measures margin retention and cost efficiency. Inputs: revenue
                  scale (10%), contribution margin (35%), operating model (20%),
                  fulfillment health (20%), growth ambition (5%), and
                  frustration signal (10%). A bonus of up to 2 points applies
                  based on the number of active frustrations reported.
                </p>
              </div>
              <div className="rounded-lg border border-brand-backbar bg-white p-5">
                <p className="font-semibold text-brand-vault">
                  Defense Score (0&ndash;100)
                </p>
                <p className="mt-1 text-sm text-brand-sesame">
                  Measures brand protection posture. Inputs: revenue scale (5%),
                  operating model (15%), fulfillment health (25%), brand defense
                  exposure (30%), growth ambition (5%), and frustration signal
                  (10%). When an ASIN is provided, a +5 point boost is applied
                  (v1 stub &mdash; v2 will use live SmartScout data for 80%
                  measured input).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Gap calculation */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              The gap calculation
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              The dollar gap answers one question: how much revenue and
              contribution margin is left on the table between your current
              operating posture and the top decile in your category?
            </p>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              For each sub-score, we compute a gap multiplier:{" "}
              <code className="rounded bg-brand-backbar px-1.5 py-0.5 text-sm">
                min((90 - your_score) / 100, cap)
              </code>
              . The cap is 60% for growth, 45% for profit, and 30% for defense
              &mdash; preventing unrealistic projections at very low scores.
            </p>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              Each multiplier is applied to your revenue anchor (midpoint of
              your reported band), adjusted for category growth factors. The
              three components &mdash; growth revenue gap, profit margin gap
              (converted back to revenue equivalent), and defense revenue gap
              &mdash; are summed, then multiplied by your category&apos;s
              median contribution margin to produce the CM range.
            </p>
            <div className="mt-4 rounded-lg border border-brand-backbar bg-brand-oat p-5">
              <p className="text-sm font-semibold text-brand-vault">
                Worked example: $25M pet brand
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-sesame">
                Revenue anchor: $17.5M (midpoint of $10M&ndash;$25M band).
                Growth score: 55, Profit score: 42, Defense score: 60. Gap
                multipliers: growth = 0.35, profit = 0.45 (capped), defense =
                0.30. Growth gap: $17.5M &times; 0.35 &times; 1.0 = $6.125M.
                Profit gap: $17.5M &times; 0.45 &times; 0.5 / 0.22 = $17.9M
                (revenue equiv). Defense gap: $17.5M &times; 0.30 &times; 0.4 =
                $2.1M. Total revenue gap: ~$26.1M. CM gap: ~$5.7M. Range
                (&#177;25%): $4.3M&ndash;$7.2M in contribution margin.
              </p>
            </div>
          </section>

          {/* 5. What we don't do */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              What we don&apos;t do
            </h2>
            <ul className="mt-3 space-y-2 text-base text-brand-vault">
              <li className="flex gap-2">
                <span className="text-brand-sesame">&mdash;</span>
                No P&amp;L upload required
              </li>
              <li className="flex gap-2">
                <span className="text-brand-sesame">&mdash;</span>
                No screen share or live call to get your score
              </li>
              <li className="flex gap-2">
                <span className="text-brand-sesame">&mdash;</span>
                No data sale. Your answers stay with Neato.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-sesame">&mdash;</span>
                No six-month nurture sequence. One email with your scorecard.
                Nothing else unless you ask.
              </li>
            </ul>
          </section>

          {/* 6. What n= means */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-brand-vault">
              What &ldquo;n=&rdquo; means
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-vault">
              Every sub-score displays a sample size indicator. If we have 10 or
              more peer brands in your category at your revenue band, the score
              is treated as statistically grounded. If we have fewer than 10
              peers, the score is labeled &ldquo;directional&rdquo; and visually
              downweighted &mdash; a lighter color treatment and an explicit
              footnote. We do not pad thin samples. Honesty is the moat.
            </p>
          </section>

          {/* 7. Footer */}
          <section className="mt-10 border-t border-brand-backbar pt-8">
            <p className="text-sm text-brand-sesame">
              Questions about the methodology?{" "}
              <a
                href="#"
                className="font-medium text-brand-tender underline underline-offset-2"
              >
                Contact us
              </a>
              .
            </p>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/start"
              className="inline-block rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90"
            >
              Run the diagnostic
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
