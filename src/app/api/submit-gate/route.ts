import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { gateSchema } from "@/lib/validation";
import { saveGate } from "@/lib/store";
import { submitToHubSpot } from "@/lib/integrations/hubspot";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = gateSchema.parse(body);

    const gateId = uuid();

    saveGate(gateId, {
      answers: parsed.answers,
      email: parsed.email,
      firstName: parsed.firstName,
      company: parsed.company,
      role: parsed.role,
      category: parsed.category,
    });

    // Fire-and-forget HubSpot submission
    submitToHubSpot({
      email: parsed.email,
      firstName: parsed.firstName,
      company: parsed.company,
      role: parsed.role,
      formType: "gate",
    }).catch((err) => console.error("[HubSpot gate error]", err));

    return NextResponse.json({ gateId });
  } catch (error) {
    console.error("[submit-gate error]", error);
    return NextResponse.json(
      { error: "Invalid submission" },
      { status: 400 },
    );
  }
}
