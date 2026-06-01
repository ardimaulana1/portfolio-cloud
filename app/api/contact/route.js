import { validateContact } from "../../../lib/validate.js";
import { log } from "../../../lib/logger.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    log("warn", "contact.invalid_json");
    return Response.json({ ok: false, error: "Body bukan JSON yang valid." }, { status: 400 });
  }

  const { valid, errors } = validateContact(body);
  if (!valid) {
    log("warn", "contact.validation_failed", { errors });
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // In a production app you would send an email or persist to a database here.
  // For this project we record a structured log entry that shows up in
  // Cloud Logging and can be turned into a log-based metric / alert.
  log("info", "contact.received", { name: body.name, email: body.email });

  return Response.json({ ok: true, message: "Pesan terkirim. Terima kasih!" });
}
