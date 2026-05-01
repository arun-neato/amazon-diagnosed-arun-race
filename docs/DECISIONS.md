# Architectural Decisions

## Persistence: Vercel Blob + In-Memory + Client Cache (Triple Fallback)

**Choice:** Three-layer persistence strategy:
1. **Vercel Blob** (when `BLOB_READ_WRITE_TOKEN` set) — durable, survives cold starts
2. **In-memory Map** — same-invocation reads (submit-final → results within one process)
3. **Client sessionStorage** — submit-final returns full ScoreResult, client caches it before redirect

**Rationale:** Vercel serverless functions are ephemeral. Without Blob token, layers 2+3 ensure the submit → results flow works seamlessly. The client cache means even without Blob, the user who just completed the diagnostic will always see their results.

**Limitation without Blob token:** Bookmarked/shared result URLs won't work after the serverless process recycles. With Blob token, results persist for 30+ days.

## Email: Resend SDK with Graceful Degradation

**Choice:** Resend SDK (`resend` package) with full HTML scorecard template.

**Sender:** `onboarding@resend.dev` (Resend sandbox). Preferred sender `arun@neato.com` requires domain verification on Resend dashboard. When verified, update the `from` field in `src/lib/email.ts`.

**Degradation:** When `RESEND_API_KEY` is unset, full email payload is logged to console and the function returns success. The user flow is never blocked by email failures.

## PDF Generation: @sparticuz/chromium + Puppeteer

**Choice:** Server-side PDF rendering via headless Chromium.

**How it works:** `/pdf-render/[id]` is an HTML page styled for US Letter print. `/api/pdf/[id]` launches Puppeteer, navigates to that page, and generates a PDF buffer. The PDF can be returned as a download (GET) or attached to a Resend email (POST).

**Degradation:** If Chromium binary is unavailable (local dev, some deployment configs), the endpoint logs a message and returns a JSON fallback. The "Email me the PDF" button still works — it sends the scorecard email without the PDF attachment.

## Styling: Tailwind CSS v4 with Custom Theme

**Choice:** Tailwind v4 `@theme inline` for brand colors, no additional CSS-in-JS.

**Rationale:** v4's inline theme keeps colors co-located with the stylesheet. Only Neato brand palette colors are used — zero stray hex values.

## Scoring Engine: Pure TypeScript Module

**Choice:** Pure function at `src/lib/scoring.ts`, zero I/O, zero async.

**Rationale:** Spec mandates portability and testability. 7 unit tests cover critical, top-decile, median, margin-edge, gap-calc, gap-count, and overall-average scenarios.

## CRM: Stub via Console.log

**Choice:** All HubSpot form submissions log to console and return mock success.

**Rationale:** No HUBSPOT_PORTAL_ID or form GUIDs provided. Ready to activate at `src/lib/integrations/hubspot.ts`.

## Validation: Zod v4

**Choice:** Zod for all API input validation, including disposable email blocking.

## Framework: Next.js 16 (App Router)

**Choice:** Next.js 16.2.4 with App Router. `create-next-app@latest` installed 16 (spec said 15). Fully backwards-compatible.
