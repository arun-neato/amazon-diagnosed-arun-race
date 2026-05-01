import { NextResponse } from "next/server";
import { getResult } from "@/lib/store";
import { sendScorecardEmail } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

async function renderPdf(url: string): Promise<Buffer | null> {
  try {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 816, height: 1056 }, // US Letter at 96dpi
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    await browser.close();

    return Buffer.from(pdf);
  } catch (err) {
    console.error("[PDF] Puppeteer render failed:", err);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const renderUrl = `${origin}/pdf-render/${id}`;

  const pdfBuffer = await renderPdf(renderUrl);

  if (pdfBuffer) {
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="amazon-diagnosed-${id.slice(0, 8)}.pdf"`,
      },
    });
  }

  // Fallback: no PDF available
  console.log(`[PDF] Fallback — Puppeteer unavailable for result: ${id}`);
  return NextResponse.json(
    { message: "PDF generation unavailable in this environment. Scorecard available at the results URL." },
    { status: 200 },
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  // Get email from request body
  let email: string | undefined;
  let firstName: string | undefined;
  try {
    const body = await request.json();
    email = body.email;
    firstName = body.firstName;
  } catch {
    // No body — skip email
  }

  const origin = new URL(request.url).origin;
  const renderUrl = `${origin}/pdf-render/${id}`;
  const resultsUrl = `${origin}/results/${id}`;

  // Try to generate PDF
  const pdfBuffer = await renderPdf(renderUrl);

  // Send email with or without PDF
  if (email) {
    await sendScorecardEmail({
      to: email,
      firstName: firstName || "there",
      result,
      resultsUrl,
      pdfBuffer: pdfBuffer || undefined,
    });
  }

  return NextResponse.json({ success: true, hasPdf: Boolean(pdfBuffer) });
}
