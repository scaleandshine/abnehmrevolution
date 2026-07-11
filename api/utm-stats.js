// /api/utm-stats — Kit-Subscriber nach UTM-Kombination gruppieren
// Gibt zurück: { by_utm: { "instagram|story|abnehmrevolution|funnelguru|": 5, ... }, total, ts }
const KIT_API = "https://api.kit.com/v4";
const KIT_TAG_ID = 20481004;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ error: "not_configured", by_utm: {}, total: 0, ts: new Date().toISOString() });

  const from = req.query.from || null;
  const to   = req.query.to   || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_TAG_ID;
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const byUtm = {};
  let total = 0, after = null;

  try {
    for (let i = 0; i < 20; i++) {
      // include[]=fields nötig, sonst kommen Custom Fields (UTMs) leer zurück
      // status=all → ECHTE Anmeldungen (inkl. wieder Abgemeldete), damit Paid+Organic = echte Gesamtzahl
      // tagged_after/before = Anmeldezeitpunkt (Tag-Zeit), NICHT created_* (Subscriber-Anlage/Import)
      let url = `${KIT_API}/tags/${wsTag}/subscribers?per_page=500&status=all&include[]=fields`;
      if (from) url += `&tagged_after=${encodeURIComponent(from)}`;
      if (to)   url += `&tagged_before=${encodeURIComponent(to)}`;
      if (after) url += `&after=${after}`;
      const r = await fetch(url, { headers });
      if (!r.ok) return res.status(200).json({ error: "kit_http_" + r.status, by_utm: {}, total, ts: new Date().toISOString() });
      const d = await r.json();
      for (const s of (d.subscribers || [])) {
        total++;
        const f = s.fields || {};
        const utmKey = [
          (f.utm_source || ""),
          (f.utm_medium || ""),
          (f.utm_campaign || ""),
          (f.utm_content || ""),
          (f.utm_term || ""),
        ].join("|");
        byUtm[utmKey] = (byUtm[utmKey] || 0) + 1;
      }
      if (!d.pagination?.has_next_page) break;
      after = d.pagination.end_cursor;
    }
  } catch (e) {
    return res.status(200).json({ error: "fetch_error", by_utm: {}, total, ts: new Date().toISOString() });
  }

  return res.status(200).json({ by_utm: byUtm, total, ts: new Date().toISOString() });
};
