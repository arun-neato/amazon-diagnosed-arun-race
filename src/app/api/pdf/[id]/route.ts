import { NextResponse } from "next/server";

/**
 * PDF download endpoint — STUB
 * TODO(env): implement with @sparticuz/chromium + Puppeteer when configured
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Stub: return a redirect to a placeholder
  console.log(`[STUB] PDF requested for result: ${id}`);

  return NextResponse.json(
    {
      message:
        "PDF generation is not yet configured. The scorecard is available at the results URL.",
      resultId: id,
    },
    { status: 200 },
  );
}
