// /api/abtest — A/B-Test-Auswertung pro Variante (A/B)
//   Besucher (PostHog server_visit) · Anmeldungen + Glow (Kit, nach ab_variant-Field)
//   Query: ?test=headline_v1 (default), ?from=ISO&to=ISO
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_PROJECT = "174473";
const DEFAULT_TEST = "headline_v1";

async function kitVariantCounts(key, tagId, test, fromIso, toIso) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const counts = { A: 0, B: 0 };
  let after = null;
  for (let i = 0; i < 20; i++) {
    let url = `${KIT_API}/tags/${tagId}/subscribers?per_page=500&include[]=fields`;
    if (fromIso) url += `&tagged_after=${encodeURIComponent(fromIso)}`;
    if (toIso) url += `&tagged_before=${encodeURIComponent(toIso)}`;
    if (after) url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) break;
    const d = await r.json();
    for (const s of (d.subscribers || [])) {
      const f = s.fields || {};
      if (test && String(f.ab_test || "") !== test) continue;
      const v = String(f.ab_variant || "");
      if (v === "A" || v === "B") counts[v]++;
    }
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return counts;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const test = String(req.query.test || DEFAULT_TEST).replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  const from = req.query.from || null;
  const to = req.query.to || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_WORKSHOP_TAG;
  const out = { test, A: { visitors: 0, leads: 0, glow: 0 }, B: { visitors: 0, leads: 0, glow: 0 }, ts: new Date().toISOString() };

  // 1) Kit: Anmeldungen + Glow pro Variante
  const kitKey = process.env.KIT_API_KEY;
  if (kitKey) {
    try {
      const [leads, glow] = await Promise.all([
        kitVariantCounts(kitKey, wsTag, test, from, to),
        kitVariantCounts(kitKey, KIT_GLOW_TAG, test, from, to),
      ]);
      out.A.leads = leads.A; out.B.leads = leads.B;
      out.A.glow = glow.A; out.B.glow = glow.B;
    } catch (e) { out.kit_error = "fetch_error"; }
  } else { out.kit_error = "not_configured"; }

  // 2) PostHog: Besucher pro Variante
  const phKey = process.env.POSTHOG_PERSONAL_KEY;
  if (phKey) {
    try {
      let tf = "timestamp >= now() - interval 90 day";
      if (from && to) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}' AND timestamp <= '${to.slice(0, 19).replace("T", " ")}'`;
      else if (from) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}'`;
      const hogql = `SELECT properties.ab_variant as v, count() as n, min(timestamp) as first FROM events WHERE event = 'server_visit' AND properties.funnel = 'abnehmrevolution' AND properties.ab_test = '${test}' AND ${tf} GROUP BY v`;
      const r = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + phKey, "Content-Type": "application/json" },
        body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
      });
      if (r.ok) {
        const d = await r.json();
        let earliest = null;
        for (const row of (d.results || [])) {
          if (row[0] === "A") out.A.visitors = row[1];
          else if (row[0] === "B") out.B.visitors = row[1];
          const first = row[2];
          if (first && (!earliest || String(first) < String(earliest))) earliest = first;
        }
        out.since = earliest;
      } else { out.posthog_error = "posthog_http_" + r.status; }
    } catch (e) { out.posthog_error = "fetch_error"; }
  } else { out.posthog_error = "not_configured"; }

  // 3) Quoten berechnen
  ["A", "B"].forEach(function (k) {
    const v = out[k];
    v.cr = v.visitors > 0 ? Math.round((v.leads / v.visitors) * 1000) / 10 : null;
    v.upsell = v.leads > 0 ? Math.round((v.glow / v.leads) * 1000) / 10 : null;
  });

  return res.status(200).json(out);
};
