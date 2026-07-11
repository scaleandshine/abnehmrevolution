// /api/purchases — Glow Käufer aus Kit (Tag buy-glow-starterpaket #20501833)
const KIT_API = "https://api.kit.com/v4";
const KIT_GLOW_TAG_ID = 20501833;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ glow: null, error: "not_configured", ts: new Date().toISOString() });

  const from = req.query.from || null;
  const to   = req.query.to   || null;
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  let total = 0, after = null;

  try {
    for (let i = 0; i < 10; i++) {
      // tagged_after/before = Kaufzeitpunkt (Tag-Zeit), NICHT created_* (Subscriber-Anlage)
      let url = `${KIT_API}/tags/${KIT_GLOW_TAG_ID}/subscribers?per_page=500`;
      if (from) url += `&tagged_after=${encodeURIComponent(from)}`;
      if (to)   url += `&tagged_before=${encodeURIComponent(to)}`;
      if (after) url += `&after=${after}`;
      const r = await fetch(url, { headers });
      if (!r.ok) return res.status(200).json({ glow: null, error: "kit_http_" + r.status, ts: new Date().toISOString() });
      const d = await r.json();
      total += (d.subscribers || []).length;
      if (!d.pagination?.has_next_page) break;
      after = d.pagination.end_cursor;
    }
  } catch (e) {
    return res.status(200).json({ glow: null, error: "fetch_error", ts: new Date().toISOString() });
  }

  return res.status(200).json({ glow: total, ts: new Date().toISOString() });
};
