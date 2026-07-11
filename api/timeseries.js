// /api/timeseries — Tageswerte für Zeitverlauf-Graph
//   - visitors: PostHog server_visit pro Tag (braucht POSTHOG_PERSONAL_KEY)
//   - signups:  Kit Workshop-Tag-Subscriber nach tagged_at gebucketet
//   - glow/revenue: Kit Glow-Tag-Subscriber nach tagged_at × 19,95 €
// Query: ?days=30 (default) oder ?from=ISO&to=ISO
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const GLOW_PREIS = 19.95;
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_PROJECT = "174473";

function dayKey(iso) { return String(iso || "").slice(0, 10); }

async function kitTaggedByDay(key, tagId, fromIso, toIso) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const byDay = {};
  let after = null;
  for (let i = 0; i < 20; i++) {
    let url = `${KIT_API}/tags/${tagId}/subscribers?per_page=500&include[]=fields`;
    if (fromIso) url += `&tagged_after=${encodeURIComponent(fromIso)}`;
    if (toIso)   url += `&tagged_before=${encodeURIComponent(toIso)}`;
    if (after)   url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) break;
    const d = await r.json();
    for (const s of (d.subscribers || [])) {
      const k = dayKey(s.tagged_at || s.created_at);
      if (k) byDay[k] = (byDay[k] || 0) + 1;
    }
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return byDay;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  // Zeitfenster bestimmen
  let from = req.query.from || null;
  let to   = req.query.to   || null;
  const days = parseInt(req.query.days || "30", 10);
  if (!from) {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - (days - 1));
    from = start.toISOString();
  }

  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_WORKSHOP_TAG;
  const out = { days: [], ts: new Date().toISOString() };
  const kitKey = process.env.KIT_API_KEY;
  const phKey = process.env.POSTHOG_PERSONAL_KEY;

  // 1) Kit Signups + Glow parallel
  let signupsByDay = {}, glowByDay = {};
  if (kitKey) {
    try {
      [signupsByDay, glowByDay] = await Promise.all([
        kitTaggedByDay(kitKey, wsTag, from, to),
        kitTaggedByDay(kitKey, KIT_GLOW_TAG, from, to),
      ]);
    } catch (e) { out.kit_error = "fetch_error"; }
  } else { out.kit_error = "not_configured"; }

  // 2) PostHog Besucher pro Tag
  let visitorsByDay = {};
  if (phKey) {
    try {
      const tf = from ? `timestamp >= '${from.slice(0, 19).replace("T", " ")}'` : "timestamp >= now() - interval 30 day";
      const hogql = `SELECT toDate(timestamp) as d, count() as n FROM events WHERE event = 'server_visit' AND properties.funnel = 'abnehmrevolution' AND ${tf} GROUP BY d ORDER BY d`;
      const r = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT}/query/`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + phKey, "Content-Type": "application/json" },
        body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
      });
      if (r.ok) {
        const d = await r.json();
        for (const row of (d.results || [])) {
          visitorsByDay[dayKey(row[0])] = row[1];
        }
      } else { out.posthog_error = "posthog_http_" + r.status; }
    } catch (e) { out.posthog_error = "fetch_error"; }
  } else { out.posthog_error = "not_configured"; }

  // 2b) Meta pro Tag: Spend + Impressionen + Klicks + Leads (für CPL-Verlauf & Tracking-Tabelle)
  let spendByDay = {}, imprByDay = {}, clicksByDay = {}, mleadsByDay = {};
  const LEAD_TYPES = ["offsite_conversion.fb_pixel_lead", "onsite_conversion.lead_grouped", "lead", "leadgen.other", "offsite_conversion.lead"];
  function leadsFromActions(actions) {
    if (!Array.isArray(actions)) return 0;
    for (const t of LEAD_TYPES) { const a = actions.find(function (x) { return x.action_type === t; }); if (a) return parseInt(a.value || 0, 10); }
    return 0;
  }
  const mToken = process.env.META_ADS_TOKEN || process.env.META_CAPI_TOKEN;
  const mAcct = process.env.META_ADS_ACCOUNT_ID || "1201983351858555";
  if (mToken) {
    try {
      const filtering = JSON.stringify([{ field: "campaign.name", operator: "CONTAIN", value: "Abnehmrevolution" }]);
      // Berlin-Kalendertage statt UTC-Slice (Berlin-Mitternacht = 22:00Z des Vortags)
      const berlinDay = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
      const until = berlinDay(to || new Date());
      const since = berlinDay(from);
      const mUrl = `https://graph.facebook.com/v19.0/act_${mAcct}/insights?level=campaign&fields=spend,impressions,clicks,actions&time_increment=1` +
        `&time_range=${encodeURIComponent(JSON.stringify({ since: since, until: until }))}` +
        `&filtering=${encodeURIComponent(filtering)}&limit=500&access_token=${encodeURIComponent(mToken)}`;
      const mr = await fetch(mUrl);
      const md = await mr.json();
      for (const row of (md.data || [])) {
        const k = dayKey(row.date_start);
        if (!k) continue;
        spendByDay[k] = Math.round(((spendByDay[k] || 0) + parseFloat(row.spend || 0)) * 100) / 100;
        imprByDay[k] = (imprByDay[k] || 0) + parseInt(row.impressions || 0, 10);
        clicksByDay[k] = (clicksByDay[k] || 0) + parseInt(row.clicks || 0, 10);
        mleadsByDay[k] = (mleadsByDay[k] || 0) + leadsFromActions(row.actions);
      }
    } catch (e) { out.meta_error = "fetch_error"; }
  }

  // 3) Tagesreihe lückenlos aufbauen
  const startD = new Date(from);
  const endD = to ? new Date(to) : new Date();
  const cur = new Date(Date.UTC(startD.getUTCFullYear(), startD.getUTCMonth(), startD.getUTCDate()));
  const last = new Date(Date.UTC(endD.getUTCFullYear(), endD.getUTCMonth(), endD.getUTCDate()));
  for (let guard = 0; cur <= last && guard < 400; guard++) {
    const k = cur.toISOString().slice(0, 10);
    const glow = glowByDay[k] || 0;
    out.days.push({
      date: k,
      visitors: visitorsByDay[k] || 0,
      signups: signupsByDay[k] || 0,
      glow: glow,
      revenue: Math.round(glow * GLOW_PREIS * 100) / 100,
      spend: spendByDay[k] || 0,
      impressions: imprByDay[k] || 0,
      clicks: clicksByDay[k] || 0,
      metaLeads: mleadsByDay[k] || 0,
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return res.status(200).json(out);
};
