import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";
import { StickyCTA } from "@/components/sticky-cta";
import { SocialProof } from "@/components/social-proof";
import { SampleScorecard } from "@/components/sample-scorecard";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-almond">
          <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
            <h1
              className="font-extrabold text-brand-vault"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
              }}
            >
              Amazon.
              <br />
              Diagnosed.
            </h1>

            <p className="mt-6 max-w-[700px] text-lg leading-relaxed text-brand-vault sm:text-xl">
              Eight questions. Ninety seconds. We grade your Amazon against the
              top 10% in your category and put a dollar number on the gap.
            </p>

            {/* Trust strip — CRO: tightened to 4, lead with highest-trust signals */}
            <div className="mt-8 flex flex-col gap-3 text-sm text-brand-sesame sm:flex-row sm:flex-wrap sm:items-start sm:gap-0 sm:divide-x sm:divide-brand-backbar">
              <span className="sm:pr-5">
                No P&amp;L upload. No screen share.
              </span>
              <span className="sm:px-5">
                Methodology and sample size published on every score
              </span>
              <span className="sm:px-5">
                Built on 540M+ ASINs across pet, food/bev, beauty, supplements
              </span>
              <span className="sm:pl-5">
                Scorecard hits your inbox in under two minutes
              </span>
            </div>

            {/* Killer line */}
            <p className="mt-8 max-w-[700px] text-base italic text-brand-sesame">
              Most brands optimize Amazon for revenue. Top-decile brands
              optimize for profit per impression. Your dashboard shows you the
              first. Ours shows you the second.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="/start"
                className="inline-block rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90"
              >
                Run the diagnostic
              </Link>
              <p className="mt-3 max-w-[540px] text-sm text-brand-sesame">
                We&apos;ve operated Amazon for $10M+ brands across pet, food,
                beauty, and supplements. The score grades the operating model,
                not the operator.
              </p>
            </div>
          </div>
        </section>

        {/* Social proof / number proofpoints — CRO: concrete numbers above fold */}
        <section className="border-t border-brand-backbar bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-center text-sm font-medium text-brand-sesame sm:gap-x-12">
            <span>
              <span className="font-bold text-brand-vault">540M+</span> ASINs
              benchmarked
            </span>
            <span className="hidden text-brand-backbar sm:inline">|</span>
            <span>
              <span className="font-bold text-brand-vault">4</span> categories
              with P&amp;L depth
            </span>
            <span className="hidden text-brand-backbar sm:inline">|</span>
            <span>
              n= published on <span className="font-bold text-brand-vault">every</span> score
            </span>
            <span className="hidden text-brand-backbar sm:inline">|</span>
            <span>
              <span className="font-bold text-brand-vault">$10M&ndash;$100M+</span> brands
              calibrated
            </span>
            <span className="hidden text-brand-backbar sm:inline">|</span>
            <span>
              Free. <span className="font-bold text-brand-vault">No sales call</span> attached.
            </span>
          </div>
        </section>

        {/* Validators */}
        <section className="border-t border-brand-backbar bg-brand-oat">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3 sm:gap-12 sm:py-20">
            <div>
              <p className="text-lg font-bold text-brand-vault">
                540M+ ASINs in the benchmark dataset
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-sesame">
                SmartScout backbone + Neato Impact portfolio overlay.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-vault">
                n= published on every score
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-sesame">
                If we don&apos;t have enough peer data in your category, we
                label the score directional. We don&apos;t fake it.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-vault">
                Calibrated for pet, food/bev, beauty, supplements
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-sesame">
                Categories where Neato has operating P&amp;L depth. Other
                categories use SmartScout-only benchmarks (and we&apos;ll tell
                you that on the score).
              </p>
            </div>
          </div>
        </section>

        {/* Stat-based social proof */}
        <SocialProof />

        {/* Three personas */}
        <section className="bg-brand-almond">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <h2 className="text-2xl font-bold text-brand-vault sm:text-3xl">
              Built for three people who keep different scoreboards.
            </h2>

            <div className="mt-10 space-y-8">
              <div className="border-l-2 border-brand-tender pl-6">
                <p className="text-base leading-relaxed text-brand-vault">
                  <span className="font-bold">CEO</span> &mdash; you want to
                  know whether the brand beating you on Page 1 is also growing
                  2x.{" "}
                  <span className="font-semibold text-brand-tender">
                    Growth Score
                  </span>{" "}
                  answers it.
                </p>
              </div>
              <div className="border-l-2 border-brand-tender pl-6">
                <p className="text-base leading-relaxed text-brand-vault">
                  <span className="font-bold">CFO</span> &mdash; you want to
                  know which Amazon line items leak three to seven margin points
                  without surfacing on a P&amp;L line.{" "}
                  <span className="font-semibold text-brand-tender">
                    Profit Score
                  </span>{" "}
                  answers it.
                </p>
              </div>
              <div className="border-l-2 border-brand-tender pl-6">
                <p className="text-base leading-relaxed text-brand-vault">
                  <span className="font-bold">VP eCom</span> &mdash; you want
                  to know your Buy Box health, unauthorized-seller exposure, and
                  where your content stacks.{" "}
                  <span className="font-semibold text-brand-tender">
                    Defense Score
                  </span>{" "}
                  answers it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample scorecard */}
        <SampleScorecard />

        {/* FAQ */}
        <section className="border-t border-brand-backbar bg-brand-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <h2 className="text-2xl font-bold text-brand-vault sm:text-3xl">
              The five questions every CFO asks before clicking.
            </h2>
            <div className="mt-10">
              <FAQ />
            </div>
          </div>
        </section>

        {/* Methodology card */}
        <section className="bg-brand-almond">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="rounded-lg border border-brand-backbar bg-white p-8 sm:p-10">
              <p className="text-base leading-relaxed text-brand-vault">
                <span className="font-bold">The math is published.</span> Four
                inputs per sub-score, all sourced (SmartScout, Neato Flow,
                portfolio P&amp;L benchmarks). Sample size visible on every
                line.{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-brand-tender underline decoration-brand-tender/30 underline-offset-2 transition-colors hover:text-brand-tender/80"
                >
                  Read the full methodology &rarr;
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-brand-backbar bg-brand-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
            <h2 className="text-2xl font-bold text-brand-vault sm:text-3xl">
              Ready to see where you sit?
            </h2>
            <div className="mt-8">
              <Link
                href="/start"
                className="inline-block rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90"
              >
                Run the diagnostic
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
