// /api/glow-source — Glow-Käufe nach Zeitpunkt & Quelle
//   Heuristik: Abstand zwischen Anmeldung (Workshop-Tag tagged_at) und Kauf (Glow-Tag tagged_at)
//   klein  → "direct"   (sofort auf der Danke-Seite / im Anmeldemoment)
//   größer → "followup" (später über die E-Mail-Sequenz)
//   Query: ?from=ISO&to=ISO (filtert nach Kaufzeitpunkt)
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const DIRECT_MAX_MIN = 60; // bis 60 Min nach Anmeldung = Direktkauf

function classifyAcq(f) {
  const s = String(f.utm_source || "").toLowerCase();
  const m = String(f.utm_medium || "").toLowerCase();
  if (!s && !m) return { type: "direct", label: "Direkt" };
  if (m === "email" || s === "convertkit" || s === "kit") return { type: "email", label: "E-Mail" };
  const adSrc = /facebook|instagram|meta|fb|ig|_feed|_stories|_reels|_explore|_search|audience_network|messenger|marketplace/.test(s);
  const paidMed = /cpc|ppc|paid|paid_social|^ads?$|_ads?$/.test(m);
  if (paidMed || (adSrc && m !== "organic" && m !== "referral" && m !== "bio")) return { type: "paid", label: "Paid" + (f.utm_source ? " · " + f.utm_source : "") };
  if (s) return { type: "organic", label: f.utm_source + (m ? " / " + m : "") };
  return { type: "organic", label: "Organic" };
}
function cleanCamp(x) {
  return String(x || "")
    .replace(/\{\{[^}]*default:\s*"([^"]*)"[^}]*\}\}/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\s*-\s*\d+\s*$/, "")
    .replace(/\s{2,}/g, " ").trim();
}

async function allTagSubs(key, tagId, extra) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const out = [];
  let after = null;
  for (let i = 0; i < 20; i++) {
    let url = `${KIT_API}/tags/${tagId}/subscribers?per_page=500`;
    if (extra) url += extra;
    if (after) url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) break;
    const d = await r.json();
    for (const s of (d.subscribers || [])) out.push(s);
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return out;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  const ts = new Date().toISOString();
  if (!key) return res.status(200).json({ error: "not_configured", ts });

  const from = req.query.from || null;
  const to = req.query.to || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_WORKSHOP_TAG;
  let glowExtra = "";
  if (from) glowExtra += `&tagged_after=${encodeURIComponent(from)}`;
  if (to) glowExtra += `&tagged_before=${encodeURIComponent(to)}`;

  try {
    const [glow, workshop] = await Promise.all([
      allTagSubs(key, KIT_GLOW_TAG, glowExtra + "&include[]=fields"),
      allTagSubs(key, wsTag, "&include[]=fields"),
    ]);
    const wsMap = {}, wsFields = {};
    for (const s of workshop) { wsMap[s.id] = s.tagged_at; wsFields[s.id] = s.fields || {}; }

    let direct = 0, followup = 0, unknown = 0;
    const acqCounts = { paid: 0, organic: 0, email: 0, direct: 0 };
    const items = glow.map(function (s) {
      const purchase = s.tagged_at;
      const signup = wsMap[s.id] || null;
      // UTMs aus dem Anmelde-Datensatz (Workshop-Tag); Fallback auf den Glow-Datensatz
      const f = (wsFields[s.id] && Object.keys(wsFields[s.id]).length) ? wsFields[s.id] : (s.fields || {});
      let gapMin = null, source = "unbekannt";
      if (signup) {
        gapMin = Math.round((new Date(purchase) - new Date(signup)) / 60000);
        if (gapMin < 0) gapMin = 0;
        source = gapMin <= DIRECT_MAX_MIN ? "direct" : "followup";
      }
      if (source === "direct") direct++; else if (source === "followup") followup++; else unknown++;
      const acq = classifyAcq(f);
      acqCounts[acq.type] = (acqCounts[acq.type] || 0) + 1;
      return {
        name: s.first_name || s.email_address,
        email: s.email_address,
        signup_at: signup,
        purchase_at: purchase,
        gap_min: gapMin,
        source: source,
        acq_type: acq.type,
        acq_label: acq.label,
        variant: f.ab_variant || "",
        utm_source: f.utm_source || "",
        utm_medium: f.utm_medium || "",
        utm_campaign: cleanCamp(f.utm_campaign),
        utm_content: f.utm_content || "",
        utm_term: f.utm_term || "",
      };
    });
    items.sort(function (a, b) { return String(b.purchase_at).localeCompare(String(a.purchase_at)); });

    return res.status(200).json({ total: glow.length, direct, followup, unknown, acq: acqCounts, items, ts });
  } catch (e) {
    return res.status(200).json({ error: "fetch_error", ts });
  }
};
