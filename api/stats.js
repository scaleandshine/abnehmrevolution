// /api/stats — Live-KPIs: Anmeldungen aus Kit (Workshop-Tag, per ?ws= umschaltbar)
//   leads  = ECHTE Anmeldungen (alle Status: aktiv + abgemeldet + bounced) — wer sich je eingetragen hat
//   active = aktuell in der Liste (status=active)
//   unsub  = wieder ausgetragen (status=cancelled)
const KIT_API = "https://api.kit.com/v4";
const KIT_TAG_ID = 20481004;

async function countTag(key, tag, status, from, to) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  let after = null, total = 0;
  for (let i = 0; i < 40; i++) {
    let url = `${KIT_API}/tags/${tag}/subscribers?per_page=500`;
    if (status) url += `&status=${status}`;
    if (from) url += `&tagged_after=${encodeURIComponent(from)}`;
    if (to)   url += `&tagged_before=${encodeURIComponent(to)}`;
    if (after) url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) return { error: "kit_http_" + r.status, total };
    const d = await r.json();
    total += (d.subscribers || []).length;
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return { total };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  const from = req.query.from || null;
  const to   = req.query.to   || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_TAG_ID;
  const result = { leads: null, active: null, unsub: 0, ts: new Date().toISOString(), from, to };

  if (!key) { result.error = "not_configured"; return res.status(200).json(result); }

  try {
    const [all, cancelled] = await Promise.all([
      countTag(key, wsTag, "all", from, to),
      countTag(key, wsTag, "cancelled", from, to),
    ]);
    if (all.error) { result.error = all.error; }
    result.leads = all.total;                          // echte Anmeldungen (alle Status)
    result.unsub = cancelled.total || 0;               // wieder ausgetragen
    result.active = Math.max(0, all.total - result.unsub); // aktuell aktiv in der Liste
  } catch (e) { result.error = "kit_error"; }

  return res.status(200).json(result);
};
