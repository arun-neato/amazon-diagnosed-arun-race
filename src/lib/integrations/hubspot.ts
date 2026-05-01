/**
 * HubSpot Forms API integration — STUB
 * TODO(env): swap when ARUN provides HUBSPOT_PORTAL_ID, HUBSPOT_GATE_FORM_GUID, HUBSPOT_FINAL_FORM_GUID
 */

export async function submitToHubSpot(data: {
  email: string;
  firstName: string;
  company: string;
  role: string;
  formType: "gate" | "final";
}): Promise<{ success: boolean }> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid =
    data.formType === "gate"
      ? process.env.HUBSPOT_GATE_FORM_GUID
      : process.env.HUBSPOT_FINAL_FORM_GUID;

  if (!portalId || !formGuid) {
    console.log("[STUB] HubSpot submission:", JSON.stringify(data));
    return { success: true };
  }

  // Production implementation would POST to HubSpot Forms API
  console.log("[STUB] HubSpot configured but not yet implemented");
  return { success: true };
}
