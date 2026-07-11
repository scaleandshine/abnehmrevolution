// /api/aufzeichnung — KPIs der Aufzeichnungsseite
//   - visitors:  server_visit page=aufzeichnung
//   - calendly:  rec_calendly_click
//   - play1/2:   rec_video_play je tag
//   - watch1/2:  Summe secs aus rec_watch je tag (Sekunden Watch-Time)
//   Query: ?from=ISO&to=ISO
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_PROJECT = "174473";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const ts = new Date().toISOString();
  const from = req.query.from || null;
  const to = req.query.to || null;
  const out = { visitors: 0, calendly: 0, play1: 0, play2: 0, watch1: 0, watch2: 0, ts };

  const phKey = process.env.POSTHOG_PERSONAL_KEY;
  if (!phKey) { out.posthog_error = "not_configured"; return res.status(200).json(out); }

  let tf = "timestamp >= now() - interval 90 day";
  if (from && to) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}' AND timestamp <= '${to.slice(0, 19).replace("T", " ")}'`;
  else if (from) tf = `timestamp >= '${from.slice(0, 19).replace("T", " ")}'`;

  const hogql = `SELECT
      countIf(event = 'server_visit' AND properties.page = 'aufzeichnung') AS visitors,
      countIf(event = 'rec_calendly_click') AS calendly,
      countIf(event = 'rec_video_play' AND properties.tag = '1') AS play1,
      countIf(event = 'rec_video_play' AND properties.tag = '2') AS play2,
      sumIf(toFloat64OrNull(properties.secs), event = 'rec_watch' AND properties.tag = '1') AS watch1,
      sumIf(toFloat64OrNull(properties.secs), event = 'rec_watch' AND properties.tag = '2') AS watch2
    FROM events
    WHERE properties.funnel = 'abnehmrevolution' AND ${tf}`;

  try {
    const r = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + phKey, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
    });
    if (r.ok) {
      const d = await r.json();
      const row = (d.results || [])[0] || [];
      out.visitors = row[0] || 0;
      out.calendly = row[1] || 0;
      out.play1 = row[2] || 0;
      out.play2 = row[3] || 0;
      out.watch1 = Math.round(row[4] || 0);
      out.watch2 = Math.round(row[5] || 0);
    } else { out.posthog_error = "posthog_http_" + r.status; }
  } catch (e) { out.posthog_error = "fetch_error"; }

  // Einzel-Views: pro Zuschauer (distinct_id) + Video die Watch-Time summieren
  out.views = [];
  try {
    const viewsql = `SELECT properties.tag AS tag, distinct_id AS vid,
        sum(toFloat64OrNull(properties.secs)) AS secs, max(timestamp) AS last, count() AS hits
      FROM events
      WHERE event = 'rec_watch' AND properties.funnel = 'abnehmrevolution' AND ${tf}
      GROUP BY tag, vid
      ORDER BY last DESC
      LIMIT 25`;
    const r2 = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + phKey, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: viewsql } }),
    });
    if (r2.ok) {
      const d2 = await r2.json();
      out.views = (d2.results || []).map(function (v) {
        return {
          tag: String(v[0] || ""),
          viewer: String(v[1] || "").replace(/^sv_/, "").slice(-5),
          secs: Math.round(v[2] || 0),
          last: v[3],
          hits: v[4] || 0,
        };
      });
    }
  } catch (e) { /* views optional */ }

  return res.status(200).json(out);
};
