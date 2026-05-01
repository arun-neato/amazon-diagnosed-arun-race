function scoreColor(s: number): string {
  if (s <= 39) return "#A6322B";
  if (s <= 69) return "#8B6B2C"; // darkened for WCAG 4.5:1 contrast on white
  return "#075D44";
}

function MiniBar({ score: s }: { score: number }) {
  return (
    <div className="relative mt-3 h-1.5 w-full rounded-full bg-brand-backbar">
      <div
        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-sesame"
        style={{ left: "50%" }}
      />
      <div
        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-tender"
        style={{ left: "84%" }}
      />
      <div
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white"
        style={{
          left: `${Math.min(s, 100)}%`,
          backgroundColor: scoreColor(s),
        }}
      />
    </div>
  );
}

function SampleSubScoreCard({
  name,
  score: s,
  band,
}: {
  name: string;
  score: number;
  band: string;
}) {
  return (
    <div className="rounded-lg border border-brand-backbar bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-sesame">
        {name} Score
      </p>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className="text-3xl font-extrabold"
          style={{ color: scoreColor(s) }}
        >
          {s}
        </span>
        <span className="text-sm text-brand-sesame">/100</span>
      </div>
      <p
        className="mt-0.5 text-xs font-semibold"
        style={{ color: scoreColor(s) }}
      >
        {band}
      </p>
      <MiniBar score={s} />
      <div className="mt-1 flex justify-between text-xs text-brand-sesame">
        <span>Median</span>
        <span>Top 10%</span>
      </div>
    </div>
  );
}

export function SampleScorecard() {
  return (
    <section className="border-t border-brand-backbar bg-brand-oat">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-bold text-brand-vault sm:text-3xl">
          What you get back
        </h2>

        {/* Sample scorecard container */}
        <div className="mt-8 rounded-lg border border-brand-backbar bg-brand-almond p-5 sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-brand-sesame">
                Sample scorecard
              </p>
              <p className="text-sm text-brand-sesame">
                Pet &middot; $25M Amazon revenue band
              </p>
            </div>
          </div>

          {/* Overall score */}
          <div className="mt-5 rounded-lg border border-brand-backbar bg-white p-5">
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl font-extrabold"
                style={{ color: scoreColor(57) }}
              >
                57
              </span>
              <span className="text-xl text-brand-sesame">/100</span>
            </div>
            <p
              className="mt-0.5 text-sm font-semibold"
              style={{ color: scoreColor(57) }}
            >
              Solid
            </p>
          </div>

          {/* Sub-scores */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <SampleSubScoreCard name="Growth" score={58} band="Solid" />
            <SampleSubScoreCard
              name="Profit"
              score={42}
              band="Underperforming"
            />
            <SampleSubScoreCard name="Defense" score={71} band="Solid" />
          </div>

          {/* Gap */}
          <div className="mt-4 rounded-lg border border-brand-backbar bg-white p-5">
            <p className="text-sm font-bold text-brand-vault">
              Three gaps. One number.
            </p>
            <p className="mt-2 text-sm text-brand-vault">
              Closing them is worth{" "}
              <span className="font-bold">$1.4M&ndash;$2.7M</span> in revenue,
              or roughly{" "}
              <span className="font-bold">$310K&ndash;$590K</span> in
              contribution margin annually.
            </p>
          </div>

          {/* Top gap */}
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-brand-backbar bg-white p-5">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-tender text-xs font-bold text-white">
              1
            </span>
            <p className="text-sm font-medium text-brand-vault">
              TACoS efficiency &mdash; 5 line items leak 3&ndash;7 margin points
              without surfacing on a P&amp;L line
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm italic text-brand-sesame">
          Real format. Yours arrives in your inbox in under two minutes.
        </p>
      </div>
    </section>
  );
}
