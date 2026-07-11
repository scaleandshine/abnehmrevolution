// /api/visit — Server-seitiger Besuch-Zähler (kein Client-Consent erforderlich).
// Sendet ein anonymes page_visit-Event an PostHog (server-side capture).
// Wird vom 1px-Beacon in index.html aufgerufen, vor der Consent-Abfrage.
// Antwortet mit 1x1 transparentem GIF um img-src-Aufruf sauber abzuschließen.
const POSTHOG_HOST = "https://eu.i.posthog.com";
const POSTHOG_TOKEN = "phc_rjxg7eY6YVADiyY4yBWWGn6dAGxnR9kjKfovzpxBcpCk";
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"
);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const page = String(req.query.p || "landing").replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  const abTest = String(req.query.abt || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  const abVariant = String(req.query.abv || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 10);
  // Optionales Event (z.B. Aufzeichnungs-Tracking): ev=calendly_click|video_play|watch, tag=1|2, secs=N
  const ev = String(req.query.ev || "").replace(/[^a-z0-9_]/gi, "").slice(0, 30);
  const tag = String(req.query.tag || "").replace(/[^0-9]/g, "").slice(0, 2);
  const secs = Math.max(0, Math.min(86400, parseInt(req.query.secs || "0", 10) || 0));
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ua = (req.headers["user-agent"] || "").slice(0, 200);
  const ref = (req.headers["referer"] || "").slice(0, 200);

  // Hash IP for anonymisation (no PII stored)
  const crypto = require("crypto");
  const distinctId = "sv_" + crypto.createHash("sha256").update(ip + ua.slice(0, 40)).digest("hex").slice(0, 16);

  // WICHTIG: awaiten! Vercel friert die Function nach der Response ein —
  // ein fire-and-forget-fetch stirbt sonst meistens unterwegs (Besucher-Undercount).
  // Timeout 1500ms, damit das Pixel nie lange blockiert.
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 1500);
    await fetch(POSTHOG_HOST + "/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ac.signal,
      body: JSON.stringify({
        api_key: POSTHOG_TOKEN,
        event: ev ? ("rec_" + ev) : "server_visit",
        distinct_id: distinctId,
        properties: { page, funnel: "abnehmrevolution", $ip: ip, $user_agent: ua, referrer: ref, ab_test: abTest, ab_variant: abVariant, tag: tag || undefined, secs: secs || undefined },
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
    clearTimeout(t);
  } catch (_) {}

  res.setHeader("Content-Type", "image/gif");
  return res.status(200).send(TRANSPARENT_GIF);
};
