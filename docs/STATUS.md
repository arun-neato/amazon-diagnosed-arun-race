# Status

## Complete

- [x] Project scaffold (Next.js 16, TypeScript strict, Tailwind v4, pnpm)
- [x] Brand system (Neato palette only, Inter font, zero gradients/shadows/icons)
- [x] Scoring engine with full weight tables, gap calc, band mapping
- [x] 7 unit tests for scoring engine (all passing)
- [x] Landing page with all sections + CRO optimizations
- [x] Sticky CTA (bottom bar mobile, side card desktop) after 600px scroll
- [x] Social proof number strip below hero
- [x] Diagnostic flow Q1-Q6 at `/start` with progress bar and card-style answers
- [x] Email gate with Zod validation, disposable email block, urgency line
- [x] Q7-Q9 flow at `/start/details` (multi-select Q7, single-select Q8, optional ASIN Q9)
- [x] API routes: submit-gate, submit-final, pdf/[id], results/[id]
- [x] Vercel Blob persistence (when token set) + in-memory + client sessionStorage fallback
- [x] Results page with interactive scorecard, sub-score cards, benchmark bars, narratives
- [x] Client-side results fallback for cold-start resilience
- [x] Score band narratives (15 total, verbatim from spec)
- [x] Resend email integration with full HTML scorecard template
- [x] PDF generation via @sparticuz/chromium + Puppeteer
- [x] Methodology page with all 7 sections
- [x] Header and footer components
- [x] Mobile-first: all tap targets >= 44px, input font-size >= 16px
- [x] Lighthouse mobile: 98/100/100/100 (Perf/Acc/BP/SEO)
- [x] Quality scrub: zero banned phrases, zero exclamation points, AC scrub clean
- [x] Deployed to Vercel, all routes 200

## Stubbed (needs env vars to activate)

- [ ] Vercel Blob persistence — needs `BLOB_READ_WRITE_TOKEN` (app works without via client cache)
- [ ] Resend email delivery — needs `RESEND_API_KEY` (logs full payload without it)
- [ ] Resend sender domain — `arun@neato.com` needs domain verification; currently uses `onboarding@resend.dev`
- [ ] HubSpot CRM — needs `HUBSPOT_PORTAL_ID`, `HUBSPOT_GATE_FORM_GUID`, `HUBSPOT_FINAL_FORM_GUID`
- [ ] SmartScout ASIN lookup — needs `SMARTSCOUT_API_KEY`

## Not in v1

- Full 30+ gap label library (v1 uses 7 generic gap labels)
- iframe embed compatibility (postMessage height sync)
- LinkedIn OAuth pre-fill
- Content-Security-Policy headers for embed routes
- Real SmartScout ASIN-level Defense score measurement
