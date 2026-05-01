import { notFound } from "next/navigation";
import { getResult } from "@/lib/store";
import { getNarrative } from "@/lib/narratives";

const CATEGORY_LABELS: Record<string, string> = {
  pet: "Pet",
  "food-bev": "Food & Beverage",
  beauty: "Beauty",
  supplements: "Supplements",
  home: "Home",
  other: "Other",
};

function scoreColor(s: number): string {
  if (s <= 39) return "#A6322B";
  if (s <= 69) return "#B58A3A";
  return "#075D44";
}

function formatDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export default async function PdfRenderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    notFound();
  }

  const cat = CATEGORY_LABELS[result.category] || result.category;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #222223;
            background: #fff;
            padding: 48px 56px;
            width: 8.5in;
            min-height: 11in;
            line-height: 1.5;
          }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #E4E2DE; }
          .logo { font-weight: 800; font-size: 18px; letter-spacing: -0.02em; }
          .title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px; }
          .subtitle { font-size: 13px; color: #6E6B66; }
          .overall { display: flex; align-items: baseline; gap: 6px; margin: 24px 0 8px; }
          .overall-num { font-size: 56px; font-weight: 800; line-height: 1; }
          .overall-of { font-size: 22px; color: #6E6B66; }
          .band { font-size: 14px; font-weight: 600; margin-bottom: 24px; }
          .scores-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 28px; }
          .score-card { border: 1px solid #E4E2DE; border-radius: 8px; padding: 20px; }
          .score-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6E6B66; }
          .score-num { font-size: 32px; font-weight: 800; line-height: 1.2; }
          .score-of { font-size: 14px; color: #6E6B66; }
          .score-band { font-size: 12px; font-weight: 600; margin-top: 2px; }
          .narrative { font-size: 11px; color: #6E6B66; margin-top: 8px; line-height: 1.5; }
          .gap-section { background: #F9F1ED; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
          .gap-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; }
          .gap-body { font-size: 13px; line-height: 1.6; }
          .gaps-list { margin-bottom: 24px; }
          .gap-item { display: flex; gap: 10px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #E4E2DE; }
          .gap-item:last-child { border-bottom: none; }
          .gap-num { background: #075D44; color: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
          .gap-text { font-size: 13px; font-weight: 500; }
          .footer { margin-top: auto; padding-top: 20px; border-top: 1px solid #E4E2DE; font-size: 11px; color: #6E6B66; display: flex; justify-content: space-between; }
        `,
          }}
        />
      </head>
      <body>
        <div className="header">
          <span className="logo">Neato</span>
          <span style={{ fontSize: "12px", color: "#6E6B66" }}>
            Amazon. Diagnosed.
          </span>
        </div>

        <div className="title">Your Amazon Scorecard</div>
        <div className="subtitle">
          {cat} &middot; Top-decile baseline: 84 &middot; Generated{" "}
          {new Date(result.computed_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="overall">
          <span
            className="overall-num"
            style={{ color: scoreColor(result.scores.overall) }}
          >
            {result.scores.overall}
          </span>
          <span className="overall-of">/100</span>
        </div>
        <div
          className="band"
          style={{ color: scoreColor(result.scores.overall) }}
        >
          {result.bands.overall}
        </div>

        <div className="scores-grid">
          {(["growth", "profit", "defense"] as const).map((name) => (
            <div key={name} className="score-card">
              <div className="score-label">{name} Score</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span
                  className="score-num"
                  style={{ color: scoreColor(result.scores[name]) }}
                >
                  {result.scores[name]}
                </span>
                <span className="score-of">/100</span>
              </div>
              <div
                className="score-band"
                style={{ color: scoreColor(result.scores[name]) }}
              >
                {result.bands[name]}
              </div>
              <div className="narrative">
                {getNarrative(name, result.scores[name])}
              </div>
            </div>
          ))}
        </div>

        <div className="gap-section">
          <div className="gap-title">Three gaps. One number.</div>
          <div className="gap-body">
            Closing them is worth{" "}
            <strong>
              {formatDollars(result.gap.revenue.low)}&ndash;
              {formatDollars(result.gap.revenue.high)}
            </strong>{" "}
            in revenue, or roughly{" "}
            <strong>
              {formatDollars(result.gap.cm.low)}&ndash;
              {formatDollars(result.gap.cm.high)}
            </strong>{" "}
            in contribution margin annually.
          </div>
        </div>

        <div className="gaps-list">
          {result.top_gaps.map((gap, i) => (
            <div key={i} className="gap-item">
              <span className="gap-num">{i + 1}</span>
              <span className="gap-text">{gap}</span>
            </div>
          ))}
        </div>

        <div className="footer">
          <span>&copy; 2026 Neato. All rights reserved.</span>
          <span>amazon-diagnosed.neato.com/methodology</span>
        </div>
      </body>
    </html>
  );
}
