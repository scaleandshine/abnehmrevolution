// /api/funnel — Funnel-Performance: Seitenaufrufe pro Stufe + Käufe
//   Besucher (Landing) → Danke-Seite → (gekauft/nicht) → Danke-Seite 2
//   Seiten aus PostHog server_visit (properties.page), Käufe aus Kit (Glow-Tag)
//   Query: ?from=ISO&to=ISO
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_PROJECT = "174473";

async function kitTagCount(key, tagId, fromIso, toIso) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  let total = 0, after = null;
  for (let i = 0; i < 20; i++) {
    let url = `${KIT_API}/tags/${tagId}/subscribers?per_page=500`;
    if (fromIso) url += `&tagged_after=${encodeURIComponent(fromIso)}`;
    if (toIso) url += `&tagged_before=${encodeURIComponent(toIso)}`;
    if (after) url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) break;
    const d = await r.json();
    total += (d.subscribers || []).length;
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return total;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const ts = new Date().toISOString();
  const from = req.query.from || null;
  const to = req.query.to || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_WORKSHOP_TAG;
  const out = { pages: { landing: 0, danke: 0, bestaetigung: 0, aufzeichnung: 0 }, leads: 0, glow: 0, ts };

  // 1) PostHog: Seitenaufrufe pro page
  const phKey = process.env.POSTHOG_PERSONAL_KEY;
  if (phKey) {
    try {
      let tf = "timestamp >= now() - interval 90 day";
      if (from && to) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}' AND timestamp <= '${to.slice(0, 19).replace("T", " ")}'`;
      else if (from) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}'`;
      const hogql = `SELECT properties.page as p, count() as n FROM events WHERE event = 'server_visit' AND properties.funnel = 'abnehmrevolution' AND ${tf} GROUP BY p`;
      const r = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + phKey, "Content-Type": "application/json" },
        body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
      });
      if (r.ok) {
        const d = await r.json();
        for (const row of (d.results || [])) {
          const p = String(row[0] || "");
          if (out.pages[p] !== undefined) out.pages[p] = row[1];
        }
      } else { out.posthog_error = "posthog_http_" + r.status; }
    } catch (e) { out.posthog_error = "fetch_error"; }
  } else { out.posthog_error = "not_configured"; }

  // 2) Kit: Anmeldungen + Glow-Käufe
  const kitKey = process.env.KIT_API_KEY;
  if (kitKey) {
    try {
      const [leads, glow] = await Promise.all([
        kitTagCount(kitKey, wsTag, from, to),
        kitTagCount(kitKey, KIT_GLOW_TAG, from, to),
      ]);
      out.leads = leads; out.glow = glow;
    } catch (e) { out.kit_error = "fetch_error"; }
  } else { out.kit_error = "not_configured"; }

  return res.status(200).json(out);
};
