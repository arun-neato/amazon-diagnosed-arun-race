/**
 * Resend transactional email integration — STUB
 * TODO(env): swap when ARUN provides RESEND_API_KEY
 */

export async function sendScorecardEmail(data: {
  to: string;
  firstName: string;
  resultId: string;
  overallScore: number;
}): Promise<{ success: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[STUB] Resend email:", JSON.stringify(data));
    return { success: true };
  }

  // Production implementation would call Resend API
  console.log("[STUB] Resend configured but not yet implemented");
  return { success: true };
}
