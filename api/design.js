// /api/design — Speicher für die Design-Overrides des Landingpage-Editors (/intern/design-editor).
// Store: Kit-Snippet 139614 ("ar-design-config") als JSON-Blob — kein eigenes KV nötig,
// KIT_API_KEY liegt ohnehin in den Envs. GET ist CDN-gecacht (30 s), POST braucht die
// gleichen Basic-Auth-Zugangsdaten wie /intern/* (INTERN_USER / INTERN_PASS).
const KIT_API = "https://api.kit.com/v4";
const SNIPPET_ID = 139614;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ error: "not_configured", config: {} });
  const headers = { "X-Kit-Api-Key": key, "Content-Type": "application/json", "Accept": "application/json" };

  if (req.method === "GET") {
    try {
      const r = await fetch(`${KIT_API}/snippets/${SNIPPET_ID}`, { headers });
      if (!r.ok) return res.status(200).json({ error: "kit_http_" + r.status, config: {} });
      const d = await r.json();
      let cfg = {};
      try { cfg = JSON.parse((d.snippet && d.snippet.content) || "{}"); } catch (e) { cfg = {}; }
      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
      return res.status(200).json({ config: cfg, ts: new Date().toISOString() });
    } catch (e) {
      return res.status(200).json({ error: "fetch_error", config: {} });
    }
  }

  if (req.method === "POST") {
    // Auth: gleiche Zugangsdaten wie das interne Dashboard
    const user = process.env.INTERN_USER || "mamaspagat";
    const pass = process.env.INTERN_PASS || "";
    const expected = "Basic " + Buffer.from(user + ":" + pass).toString("base64");
    if (!pass || (req.headers.authorization || "") !== expected) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const cfg = (body && body.config && typeof body.config === "object") ? body.config : null;
    if (!cfg) return res.status(400).json({ ok: false, error: "config_required" });
    const json = JSON.stringify(cfg);
    if (json.length > 100000) return res.status(400).json({ ok: false, error: "config_too_large" });
    try {
      const r = await fetch(`${KIT_API}/snippets/${SNIPPET_ID}`, {
        method: "PUT", headers,
        body: JSON.stringify({ name: "ar-design-config", content: json, snippet_type: "inline" }),
      });
      if (!r.ok) return res.status(200).json({ ok: false, error: "kit_http_" + r.status });
      return res.status(200).json({ ok: true, ts: new Date().toISOString() });
    } catch (e) {
      return res.status(200).json({ ok: false, error: "fetch_error" });
    }
  }

  return res.status(405).end();
};
