import { log } from "../../../lib/logger.js";

// Health endpoint — used by Cloud Monitoring uptime checks and load balancers.
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = {
    status: "ok",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  };
  log("info", "health.check", payload);
  return Response.json(payload);
}
