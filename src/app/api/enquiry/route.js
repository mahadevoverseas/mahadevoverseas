import { addEnquiry } from "@/lib/content";

const PHONE_RE = /^[+]?[\d\s-]{10,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Receives enquiries from the contact form and the eligibility checker and
 * saves them to content/enquiries.json (visible under Admin → Enquiries).
 *
 * TODO (optional): also notify the team — e.g. send an email (Resend, SMTP)
 * or push to a CRM / Google Sheet. Keep secrets in .env.local.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (clean(body.website)) return Response.json({ ok: true });

  const lead = {
    source: clean(body.source, 40) || "website",
    name: clean(body.name, 120),
    phone: clean(body.phone, 20),
    email: clean(body.email, 160),
    country: clean(body.country, 60),
    intake: clean(body.intake, 60),
    message: clean(body.message, 2000),
    answers: body.answers && typeof body.answers === "object" ? body.answers : undefined,
    suggestions: Array.isArray(body.suggestions) ? body.suggestions.slice(0, 3).map((s) => clean(s, 60)) : undefined,
    receivedAt: new Date().toISOString(),
  };

  const errors = [];
  if (!lead.name) errors.push("name");
  if (!PHONE_RE.test(lead.phone)) errors.push("phone");
  if (!EMAIL_RE.test(lead.email)) errors.push("email");
  if (errors.length) {
    return Response.json({ error: `Please check: ${errors.join(", ")}.` }, { status: 422 });
  }

  try {
    await addEnquiry(lead);
  } catch (err) {
    console.error("[enquiry] could not save", err);
    return Response.json({ error: "We couldn't save your enquiry. Please call or WhatsApp us." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
