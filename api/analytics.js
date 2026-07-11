// /api/analytics — Besucher-Zahl aus PostHog server_visit Events
// Benötigt POSTHOG_PERSONAL_KEY (Personal API Key aus PostHog → Settings → Personal API Keys)
// Gibt zurück: { visitors: N, ts: ISO } oder { visitors: null, error: "..." }
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_PROJECT = "174473";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.POSTHOG_PERSONAL_KEY;
  const result = { visitors: null, ts: new Date().toISOString() };

  if (!key) { result.error = "not_configured"; return res.status(200).json(result); }

  const from = req.query.from || null;
  const to   = req.query.to   || null;
  let timeFilter = "timestamp >= now() - interval 90 day";
  if (from && to) timeFilter = `timestamp >= '${from.slice(0,19).replace("T"," ")}' AND timestamp <= '${to.slice(0,19).replace("T"," ")}'`;
  else if (from) timeFilter = `timestamp >= '${from.slice(0,19).replace("T"," ")}'`;
  else if (to)   timeFilter = `timestamp <= '${to.slice(0,19).replace("T"," ")}'`;

  // HogQL: count visits from server_visit events for this funnel
  const hogql = `SELECT count() as n FROM events WHERE event = 'server_visit' AND properties.funnel = 'abnehmrevolution' AND ${timeFilter}`;

  try {
    const r = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
    });
    if (!r.ok) { result.error = "posthog_http_" + r.status; return res.status(200).json(result); }
    const d = await r.json();
    const n = d?.results?.[0]?.[0];
    result.visitors = typeof n === "number" ? n : null;
    if (result.visitors === null) result.error = "no_data";
  } catch (e) { result.error = "fetch_error"; }

  return res.status(200).json(result);
};
