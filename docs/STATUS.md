# Status

## Complete

- [x] Project scaffold (Next.js 16, TypeScript strict, Tailwind v4, pnpm)
- [x] Brand system (colors, fonts, visual rules)
- [x] Scoring engine with full weight tables, gap calc, band mapping
- [x] 7 unit tests for scoring engine (all passing)
- [x] Landing page with all 5 sections (hero, validators, personas, FAQ, methodology card, CTAs)
- [x] Diagnostic flow Q1-Q6 at `/start` with progress bar and card-style answers
- [x] Email gate with validation (disposable email block, Zod)
- [x] Q7-Q9 flow at `/start/details` (multi-select Q7, single-select Q8, optional ASIN Q9)
- [x] API routes: `/api/submit-gate`, `/api/submit-final`, `/api/pdf/[id]`
- [x] Results page at `/results/[id]` with interactive scorecard
- [x] Score band narratives (15 total, verbatim from spec)
- [x] Methodology page with all 7 sections
- [x] Header and footer components
- [x] Deployed to Vercel

## Stubbed

- [ ] PDF generation (`@sparticuz/chromium` + Puppeteer) — needs `VERCEL_BLOB_READ_WRITE_TOKEN`
- [ ] Email delivery (Resend) — needs `RESEND_API_KEY`
- [ ] CRM integration (HubSpot Forms) — needs `HUBSPOT_PORTAL_ID`, `HUBSPOT_GATE_FORM_GUID`, `HUBSPOT_FINAL_FORM_GUID`
- [ ] Live ASIN lookup (SmartScout) — needs `SMARTSCOUT_API_KEY`
- [ ] Persistent storage — currently in-memory, needs `DATABASE_URL` or Vercel KV
- [ ] LinkedIn OAuth pre-fill — button not shown (nice-to-have per spec)

## Not in v1

- Persistent storage across cold starts (results are ephemeral)
- Full gap library (30+ entries) — v1 uses 7 generic gap labels
- iframe embed compatibility (postMessage height sync)
- Real SmartScout ASIN lookups for Defense score
- Content-Security-Policy headers for embed routes
