// /api/ad-roas — Back-End-ROAS: Leads → Glow → Termine (→ Show-up/Sales) pro Ad-Dimension
//   Gruppiert Workshop-Leads nach utm_campaign / utm_content (Ad) / utm_term (Adset)
//   + Diagnose, welche Dimensionen die Leads überhaupt tragen (zeigt, ob Ad-Level-Attribution möglich ist)
//   Glow-Umsatz = Glow-Käufe × 19,95. Termin via calendly_calls_booked / KIT_TERMIN_TAG.
//   Query: ?from=ISO&to=ISO
const KIT_API = "https://api.kit.com/v4";
const KIT_WORKSHOP_TAG = 20481004;
const KIT_GLOW_TAG = 20501833;
const SHOWUP_TAG1 = parseInt(process.env.KIT_SHOWUP_TAG1 || "0", 10);
const SHOWUP_TAG2 = parseInt(process.env.KIT_SHOWUP_TAG2 || "0", 10);
const TERMIN_TAG = parseInt(process.env.KIT_TERMIN_TAG || "0", 10);
const GLOW_PREIS = 19.95;

function isPaid(f) {
  const s = String(f.utm_source || "").toLowerCase();
  const m = String(f.utm_medium || "").toLowerCase();
  if (m === "email" || s === "convertkit" || s === "kit") return false;
  const adSrc = /facebook|instagram|meta|fb|ig|_feed|_stories|_reels|_explore|_search|audience_network|messenger|marketplace/.test(s);
  const paidMed = /cpc|ppc|paid|paid_social|^ads?$|_ads?$/.test(m);
  return paidMed || (adSrc && m !== "organic" && m !== "referral" && m !== "bio");
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

    const [glowSet, t1Set, t2Set, terminSet] = await Promise.all([
      tagIdSet(key, KIT_GLOW_TAG),
      SHOWUP_TAG1 ? tagIdSet(key, SHOWUP_TAG1) : Promise.resolve(new Set()),
      SHOWUP_TAG2 ? tagIdSet(key, SHOWUP_TAG2) : Promise.resolve(new Set()),
      TERMIN_TAG ? tagIdSet(key, TERMIN_TAG) : Promise.resolve(new Set()),
    ]);

    // Diagnose: welche Dimensionen tragen die PAID-Leads?
    const dims = { paid_total: 0, has_campaign: 0, has_content: 0, has_term: 0 };
    const groups = {}; // key = campaign -> {leads,glow,glowRev,termine,t1,t2,contents:Set}

    function addGroup(map, gkey, lead) {
      if (!map[gkey]) map[gkey] = { key: gkey, leads: 0, glow: 0, glowRev: 0, termine: 0, tag1: 0, tag2: 0 };
      const g = map[gkey];
      g.leads++;
      if (lead.glow) { g.glow++; g.glowRev += GLOW_PREIS; }
      if (lead.termin) g.termine++;
      if (lead.tag1) g.tag1++;
      if (lead.tag2) g.tag2++;
    }

    const byCampaign = {}, byContent = {};
    for (const s of leads) {
      const f = s.fields || {};
      if (!isPaid(f)) continue;
      const calBooked = f.calendly_calls_booked && parseInt(f.calendly_calls_booked, 10) > 0;
      const lead = {
        glow: glowSet.has(s.id),
        termin: TERMIN_TAG ? terminSet.has(s.id) : !!calBooked,
        tag1: SHOWUP_TAG1 ? t1Set.has(s.id) : false,
        tag2: SHOWUP_TAG2 ? t2Set.has(s.id) : false,
      };
      dims.paid_total++;
      const camp = String(f.utm_campaign || "").trim();
      const cont = String(f.utm_content || "").trim();
      const term = String(f.utm_term || "").trim();
      if (camp) dims.has_campaign++;
      if (cont) dims.has_content++;
      if (term) dims.has_term++;
      addGroup(byCampaign, camp || "(ohne Kampagne)", lead);
      addGroup(byContent, cont || "(ohne Ad-Name)", lead);
    }

    // Normalisierung: Umlaute falten, "Ad"/Ziffern/Sonderzeichen raus → fuzzy-Schlüssel
    const fold = function (x) {
      return String(x || "").toLowerCase()
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    };
    const normLoose = function (x) { return fold(x).replace(/^[^a-z0-9]+/, "").trim(); }; // für Kampagne (Emoji-Prefix weg)
    const fuzzy = function (x) { return fold(x).replace(/\bad\b/g, "").replace(/[0-9]+/g, "").replace(/[^a-z]/g, ""); };
    const isNum = function (x) { return /^\d{6,}$/.test(String(x || "").trim()); };

    // Meta-Spend auf Ad- + Kampagnen-Ebene
    const adByFuzzy = {}, adById = {}, campSpend = {};
    const mToken = process.env.META_ADS_TOKEN || process.env.META_CAPI_TOKEN;
    const mAcct = process.env.META_ADS_ACCOUNT_ID || "1201983351858555";
    let metaOk = false;
    if (mToken) {
      try {
        const filtering = JSON.stringify([{ field: "campaign.name", operator: "CONTAIN", value: "Abnehmrevolution" }]);
        let mUrl = `https://graph.facebook.com/v19.0/act_${mAcct}/insights?level=ad&fields=ad_id,ad_name,campaign_name,spend` +
          `&filtering=${encodeURIComponent(filtering)}&limit=500&access_token=${encodeURIComponent(mToken)}`;
        if (from && to) mUrl += `&time_range=${encodeURIComponent(JSON.stringify({ since: from.slice(0, 10), until: to.slice(0, 10) }))}`;
        else mUrl += `&date_preset=maximum`;
        const mr = await fetch(mUrl);
        const md = await mr.json();
        if (Array.isArray(md.data)) metaOk = true;
        for (const row of (md.data || [])) {
          const sp = parseFloat(row.spend || 0);
          if (row.ad_id) adById[String(row.ad_id)] = (adById[String(row.ad_id)] || 0) + sp;
          if (row.ad_name) { const k = fuzzy(row.ad_name); if (k) adByFuzzy[k] = (adByFuzzy[k] || 0) + sp; }
          if (row.campaign_name) campSpend[normLoose(row.campaign_name)] = (campSpend[normLoose(row.campaign_name)] || 0) + sp;
        }
      } catch (e) { /* Meta optional */ }
    }

    function finalizeAd(map) {
      let matched = 0;
      const rows = Object.values(map).map(function (g) {
        const umsatz = Math.round(g.glowRev * 100) / 100; // später + Produkt-Sales
        let spend;
        if (isNum(g.key) && adById[g.key] !== undefined) spend = adById[g.key];
        else if (adByFuzzy[fuzzy(g.key)] !== undefined) spend = adByFuzzy[fuzzy(g.key)];
        const hasSpend = spend !== undefined && spend > 0;
        if (hasSpend) matched++;
        return {
          key: g.key, leads: g.leads,
          spend: hasSpend ? Math.round(spend * 100) / 100 : null,
          cpl: hasSpend && g.leads > 0 ? Math.round((spend / g.leads) * 100) / 100 : null,
          glow: g.glow, glowUmsatz: umsatz, umsatz: umsatz,
          roas: hasSpend ? Math.round((umsatz / spend) * 100) / 100 : null,
          termine: g.termine, tag1: g.tag1, tag2: g.tag2,
        };
      }).sort(function (a, b) { return b.leads - a.leads; });
      return { rows: rows, matched: matched };
    }
    function finalizeCamp(map) {
      return Object.values(map).map(function (g) {
        const umsatz = Math.round(g.glowRev * 100) / 100;
        const spend = campSpend[normLoose(g.key)];
        const hasSpend = spend !== undefined && spend > 0;
        return {
          key: g.key, leads: g.leads,
          spend: hasSpend ? Math.round(spend * 100) / 100 : null,
          cpl: hasSpend && g.leads > 0 ? Math.round((spend / g.leads) * 100) / 100 : null,
          glow: g.glow, glowUmsatz: umsatz, umsatz: umsatz,
          roas: hasSpend ? Math.round((umsatz / spend) * 100) / 100 : null,
          termine: g.termine, tag1: g.tag1, tag2: g.tag2,
        };
      }).sort(function (a, b) { return b.leads - a.leads; });
    }

    const adRes = finalizeAd(byContent);
    return res.status(200).json({
      dims,
      ad_level_possible: dims.paid_total > 0 && dims.has_content === dims.paid_total,
      campaign_level_possible: dims.paid_total > 0 && dims.has_campaign === dims.paid_total,
      meta_ok: metaOk,
      ads_total: adRes.rows.length,
      ads_matched: adRes.matched,
      by_campaign: finalizeCamp(byCampaign),
      by_ad: adRes.rows,
      showup_wired: !!(SHOWUP_TAG1 && SHOWUP_TAG2),
      glow_preis: GLOW_PREIS,
      ts,
    });
  } catch (e) {
    return res.status(200).json({ error: "fetch_error", message: String(e), ts });
  }
};
