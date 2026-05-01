import { NextResponse } from "next/server";
import { finalSchema } from "@/lib/validation";
import { getGate, saveResult } from "@/lib/store";
import { score, type Answers } from "@/lib/scoring";
import { submitToHubSpot } from "@/lib/integrations/hubspot";
import { sendScorecardEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = finalSchema.parse(body);

    const gate = await getGate(parsed.gateId);
    if (!gate) {
      return NextResponse.json(
        { error: "Gate session not found. Please restart the diagnostic." },
        { status: 404 },
      );
    }

    const answers: Answers = {
      q1: gate.answers.q1 as Answers["q1"],
      q2: gate.answers.q2 as Answers["q2"],
      q3: gate.answers.q3 as Answers["q3"],
      q4: gate.answers.q4 as Answers["q4"],
      q5: gate.answers.q5 as Answers["q5"],
      q6: gate.answers.q6 as Answers["q6"],
      q7: parsed.q7,
      q8: parsed.q8,
      q9: parsed.q9 || undefined,
      category: gate.category as Answers["category"],
    };

    const result = score(answers);
    await saveResult(result);

    // Build results URL from request origin
    const origin = new URL(request.url).origin;
    const resultsUrl = `${origin}/results/${result.id}`;

    // Fire-and-forget: HubSpot + scorecard email
    submitToHubSpot({
      email: gate.email,
      firstName: gate.firstName,
      company: gate.company,
      role: gate.role,
      formType: "final",
    }).catch((err) => console.error("[HubSpot final error]", err));

    sendScorecardEmail({
      to: gate.email,
      firstName: gate.firstName,
      result,
      resultsUrl,
    }).catch((err) => console.error("[Resend error]", err));

    return NextResponse.json({ resultId: result.id, result });
  } catch (error) {
    console.error("[submit-final error]", error);
    return NextResponse.json(
      { error: "Invalid submission" },
      { status: 400 },
    );
  }
}
