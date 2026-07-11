// /api/leads — Detailliertes Leadboard
//   Pro Lead: Name, E-Mail, Quelle (UTM/Variante), Glow gekauft, Show-up Tag1/Tag2, Termin gebucht
//   Quelle: Kit workshop-Tag (#20481004) inkl. fields (utm_*, ab_variant, calendly_*)
//   Glow:   Kit glow-Tag (#20501833)
//   Show-up Tag1/Tag2: optionale Kit-Tags (von Zoom→Zapier gesetzt). 0 = noch nicht verdrahtet → "—"
//   Termin: Kit-Feld calendly_calls_booked > 0
//   Query: ?from=ISO&to=ISO
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const SHOWUP_TAG1 = parseInt(process.env.KIT_SHOWUP_TAG1 || "0", 10); // Zoom-Teilnahme Tag 1
const SHOWUP_TAG2 = parseInt(process.env.KIT_SHOWUP_TAG2 || "0", 10); // Zoom-Teilnahme Tag 2
const TERMIN_TAG = parseInt(process.env.KIT_TERMIN_TAG || "0", 10);   // optional: Termin-Tag

function classifySource(f) {
  const s = String(f.utm_source || "").toLowerCase();
  const m = String(f.utm_medium || "").toLowerCase();
  if (!s && !m) return { type: "direct", label: "Direkt", detail: "" };
  if (m === "email" || s === "convertkit" || s === "kit") {
    return { type: "email", label: "E-Mail", detail: f.utm_campaign || "" };
  }
  const adSrc = /facebook|instagram|meta|fb|ig|_feed|_stories|_reels|_explore|_search|audience_network|messenger|marketplace/.test(s);
  const paidMed = /cpc|ppc|paid|paid_social|^ads?$|_ads?$/.test(m);
  if (paidMed || (adSrc && m !== "organic" && m !== "referral" && m !== "bio")) {
    return { type: "paid", label: "Paid" + (f.utm_source ? " · " + f.utm_source : ""), detail: f.utm_campaign || "" };
  }
  if (s) return { type: "organic", label: f.utm_source + (m ? " / " + m : ""), detail: f.utm_campaign || "" };
  return { type: "organic", label: "Organic", detail: "" };
}

async function tagIdSet(key, tagId) {
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const set = new Set();
  let after = null;
  for (let i = 0; i < 30; i++) {
    let url = `${KIT_API}/tags/${tagId}/subscribers?per_page=100`;
    if (after) url += `&after=${after}`;
    const r = await fetch(url, { headers });
    if (!r.ok) break;
    const d = await r.json();
    for (const s of (d.subscribers || [])) set.add(s.id);
    if (!d.pagination?.has_next_page) break;
    after = d.pagination.end_cursor;
  }
  return set;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const ts = new Date().toISOString();
  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ error: "not_configured", ts });

  const from = req.query.from || null;
  const to = req.query.to || null;
  const wsTag = ({ "20481004": 20481004, "20703609": 20703609 })[String(req.query.ws)] || KIT_WORKSHOP_TAG;
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };

  try {
    // 1) Workshop-Leads inkl. fields
    const leads = [];
    let after = null;
    for (let i = 0; i < 30; i++) {
      let url = `${KIT_API}/tags/${wsTag}/subscribers?per_page=100&include[]=fields`;
      if (from) url += `&tagged_after=${encodeURIComponent(from)}`;
      if (to) url += `&tagged_before=${encodeURIComponent(to)}`;
      if (after) url += `&after=${after}`;
      const r = await fetch(url, { headers });
      if (!r.ok) break;
      const d = await r.json();
      for (const s of (d.subscribers || [])) leads.push(s);
      if (!d.pagination?.has_next_page) break;
      after = d.pagination.end_cursor;
    }

    // 2) Referenz-Tags parallel
    const [glowSet, t1Set, t2Set, terminSet] = await Promise.all([
      tagIdSet(key, KIT_GLOW_TAG),
      SHOWUP_TAG1 ? tagIdSet(key, SHOWUP_TAG1) : Promise.resolve(new Set()),
      SHOWUP_TAG2 ? tagIdSet(key, SHOWUP_TAG2) : Promise.resolve(new Set()),
      TERMIN_TAG ? tagIdSet(key, TERMIN_TAG) : Promise.resolve(new Set()),
    ]);

    const counts = { total: 0, paid: 0, organic: 0, email: 0, direct: 0, glow: 0, tag1: 0, tag2: 0, termin: 0 };
    const items = leads.map(function (s) {
      const f = s.fields || {};
      const src = classifySource(f);
      const glow = glowSet.has(s.id);
      const calBooked = f.calendly_calls_booked && parseInt(f.calendly_calls_booked, 10) > 0;
      const termin = TERMIN_TAG ? terminSet.has(s.id) : !!calBooked;
      const tag1 = SHOWUP_TAG1 ? t1Set.has(s.id) : null;
      const tag2 = SHOWUP_TAG2 ? t2Set.has(s.id) : null;
      counts.total++;
      counts[src.type]++;
      if (glow) counts.glow++;
      if (tag1) counts.tag1++;
      if (tag2) counts.tag2++;
      if (termin) counts.termin++;
      return {
        name: s.first_name || (s.email_address || "").split("@")[0],
        email: s.email_address || "",
        source: src.label,
        type: src.type,
        campaign: (src.detail || "")
          .replace(/\{\{[^}]*default:\s*"([^"]*)"[^}]*\}\}/g, "$1")
          .replace(/\{\{[^}]*\}\}/g, "")
          .replace(/\s*-\s*\d+\s*$/, "")
          .replace(/\s{2,}/g, " ").trim().slice(0, 60),
        variant: f.ab_variant || "",
        glow: glow,
        tag1: tag1,
        tag2: tag2,
        termin: termin,
        signup: s.tagged_at || s.created_at || "",
      };
    });
    items.sort(function (a, b) { return (b.signup || "").localeCompare(a.signup || ""); });

    return res.status(200).json({
      counts,
      showup_wired: !!(SHOWUP_TAG1 && SHOWUP_TAG2),
      leads: items,
      ts,
    });
  } catch (e) {
    return res.status(200).json({ error: "fetch_error", message: String(e), ts });
  }
};
