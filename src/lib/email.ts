/**
 * Transactional email via Resend.
 *
 * When RESEND_API_KEY is set, sends real email.
 * When unset, logs the full payload to console and returns success.
 *
 * Sender domain: arun@neato.com is preferred but requires domain verification.
 * Fallback: onboarding@resend.dev (Resend sandbox sender).
 * See DECISIONS.md for rationale.
 */

import { Resend } from "resend";
import { type ScoreResult } from "./scoring";

const CATEGORY_LABELS: Record<string, string> = {
  pet: "Pet",
  "food-bev": "Food & Beverage",
  beauty: "Beauty",
  supplements: "Supplements",
  home: "Home",
  other: "Other",
};

function formatDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function buildEmailHtml(
  firstName: string,
  result: ScoreResult,
  resultsUrl: string,
): string {
  const cat = CATEGORY_LABELS[result.category] || result.category;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #222223; line-height: 1.6; margin: 0; padding: 0; background: #F8F9FB; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .card { background: #fff; border: 1px solid #E4E2DE; border-radius: 8px; padding: 32px; margin-bottom: 24px; }
    .score-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E4E2DE; }
    .score-row:last-child { border-bottom: none; }
    .score-label { font-weight: 600; }
    .score-value { font-weight: 700; }
    .critical { color: #A6322B; }
    .mid { color: #B58A3A; }
    .top { color: #075D44; }
    .cta { display: inline-block; background: #075D44; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    .muted { color: #6E6B66; font-size: 14px; }
    .sig { margin-top: 32px; color: #6E6B66; font-size: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <p>Hi ${firstName},</p>
      <p>Your Amazon. Diagnosed. scorecard is ready. Here's the summary:</p>

      <div style="margin: 24px 0;">
        <div class="score-row">
          <span class="score-label">Overall</span>
          <span class="score-value ${result.scores.overall <= 39 ? "critical" : result.scores.overall <= 69 ? "mid" : "top"}">${result.scores.overall}/100 &mdash; ${result.bands.overall}</span>
        </div>
        <div class="score-row">
          <span class="score-label">Growth</span>
          <span class="score-value ${result.scores.growth <= 39 ? "critical" : result.scores.growth <= 69 ? "mid" : "top"}">${result.scores.growth}/100</span>
        </div>
        <div class="score-row">
          <span class="score-label">Profit</span>
          <span class="score-value ${result.scores.profit <= 39 ? "critical" : result.scores.profit <= 69 ? "mid" : "top"}">${result.scores.profit}/100</span>
        </div>
        <div class="score-row">
          <span class="score-label">Defense</span>
          <span class="score-value ${result.scores.defense <= 39 ? "critical" : result.scores.defense <= 69 ? "mid" : "top"}">${result.scores.defense}/100</span>
        </div>
      </div>

      <p><strong>Closing your three biggest gaps is worth ${formatDollars(result.gap.revenue.low)}&ndash;${formatDollars(result.gap.revenue.high)} in revenue</strong>, or roughly ${formatDollars(result.gap.cm.low)}&ndash;${formatDollars(result.gap.cm.high)} in contribution margin annually. (${cat}, top-decile baseline.)</p>

      <a href="${resultsUrl}" class="cta">View your full scorecard</a>

      <p style="margin-top: 24px;" class="muted">
        <a href="${resultsUrl.replace(/\/results\/.*/, "/methodology")}" style="color: #075D44;">Read our methodology</a> &mdash; sample size and data sources published on every score.
      </p>
    </div>

    <div class="sig">
      <p>&mdash; Arun, VP Marketing, Neato</p>
    </div>

    <p class="muted" style="margin-top: 24px; font-size: 12px;">
      You received this because you completed the Amazon. Diagnosed. assessment. One email. Nothing else unless you ask.
    </p>
  </div>
</body>
</html>`;
}

export async function sendScorecardEmail(data: {
  to: string;
  firstName: string;
  result: ScoreResult;
  resultsUrl: string;
  pdfBuffer?: Buffer;
}): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  const emailPayload = {
    from: "Neato <onboarding@resend.dev>",
    to: data.to,
    subject: "Your Amazon. Diagnosed. scorecard",
    html: buildEmailHtml(data.firstName, data.result, data.resultsUrl),
    attachments: data.pdfBuffer
      ? [
          {
            filename: `amazon-diagnosed-${data.result.id.slice(0, 8)}.pdf`,
            content: data.pdfBuffer,
          },
        ]
      : undefined,
  };

  if (!apiKey) {
    console.log("[STUB] Resend email payload:", JSON.stringify({
      ...emailPayload,
      html: "[HTML truncated]",
      attachments: data.pdfBuffer ? "[PDF buffer present]" : undefined,
    }));
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send(emailPayload);
    if (response.error) {
      console.error("[Resend error]", response.error);
      return { success: false };
    }
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error("[Resend exception]", err);
    return { success: false };
  }
}
