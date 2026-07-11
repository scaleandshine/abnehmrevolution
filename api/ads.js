// /api/ads — Meta Ads Insights, gefiltert auf Abnehmrevolution-Kampagnen
//   Token: META_ADS_TOKEN, Fallback META_CAPI_TOKEN (System-User-Token mit ads_read)
//   Konto: META_ADS_ACCOUNT_ID (numerisch, ohne act_)
//   Query: ?from=ISO&to=ISO (sonst date_preset=maximum)
const ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID || "1201983351858555";
const CAMPAIGN_KEYWORD = "Abnehmrevolution";
const GRAPH = "https://graph.facebook.com/v19.0";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const token = process.env.META_ADS_TOKEN || process.env.META_CAPI_TOKEN;
  const ts = new Date().toISOString();
  if (!token) return res.status(200).json({ error: "not_configured", ts });

  const from = req.query.from || null;
  const to = req.query.to || null;
  const fields = "campaign_name,spend,impressions,reach,clicks,actions";
  // Lead-Action-Typen nach Priorität (pro Kampagne EINEN nehmen, sonst Doppelzählung)
  const LEAD_TYPES = ["offsite_conversion.fb_pixel_lead", "onsite_conversion.lead_grouped", "lead", "leadgen.other", "offsite_conversion.lead"];
  function leadsFromActions(actions) {
    if (!Array.isArray(actions)) return 0;
    for (const t of LEAD_TYPES) {
      const a = actions.find(function (x) { return x.action_type === t; });
      if (a) return parseInt(a.value || 0, 10);
    }
    var s = 0;
    for (const x of actions) { if (/lead/i.test(x.action_type)) s += parseInt(x.value || 0, 10); }
    return s;
  }
  const filtering = JSON.stringify([{ field: "campaign.name", operator: "CONTAIN", value: CAMPAIGN_KEYWORD }]);

  let url = `${GRAPH}/act_${ACCOUNT_ID}/insights?level=campaign&fields=${fields}` +
            `&filtering=${encodeURIComponent(filtering)}&limit=200&access_token=${encodeURIComponent(token)}`;
  // Zeitfenster anwenden, sobald ein from da ist (to offen → bis heute).
  // WICHTIG: ISO-Instants in BERLIN-Kalendertage umrechnen (nicht UTC slicen!) —
  // Berlin-Mitternacht ist 22:00Z des Vortags, sonst umfasst "Heute" zwei Meta-Tage.
  const berlinDay = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
  if (from) {
    const since = berlinDay(from);
    const until = berlinDay(to || new Date().toISOString());
    url += `&time_range=${encodeURIComponent(JSON.stringify({ since: since, until: until }))}`;
  } else {
    url += `&date_preset=maximum`;
  }

  try {
    const r = await fetch(url);
    const d = await r.json();
    if (d.error) {
      return res.status(200).json({ error: "meta_" + (d.error.code || "error"), message: d.error.message, ts });
    }
    let spend = 0, impressions = 0, reach = 0, clicks = 0, leads = 0;
    const leadBreakdown = {}; // alle lead-bezogenen action_types aufsummiert (Diagnose, um Metas „Leads" zu treffen)
    const campaignRows = [];
    for (const row of (d.data || [])) {
      const cs = parseFloat(row.spend || 0);
      const ci = parseInt(row.impressions || 0, 10);
      const cr = parseInt(row.reach || 0, 10);
      const cc = parseInt(row.clicks || 0, 10);
      const cl = leadsFromActions(row.actions);
      if (Array.isArray(row.actions)) {
        for (const a of row.actions) {
          if (/lead/i.test(a.action_type)) leadBreakdown[a.action_type] = (leadBreakdown[a.action_type] || 0) + parseInt(a.value || 0, 10);
        }
      }
      spend += cs; impressions += ci; reach += cr; clicks += cc; leads += cl;
      campaignRows.push({
        name: (row.campaign_name || "").replace(/^[^A-Za-zÄÖÜ0-9]+/, "").trim(),
        spend: Math.round(cs * 100) / 100,
        impressions: ci, reach: cr, clicks: cc, leads: cl,
        ctr: ci > 0 ? Math.round((cc / ci) * 10000) / 100 : 0,
        cpc: cc > 0 ? Math.round((cs / cc) * 100) / 100 : 0,
        cpl: cl > 0 ? Math.round((cs / cl) * 100) / 100 : null,
      });
    }
    campaignRows.sort(function (a, b) { return b.spend - a.spend; });
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    const cpl = leads > 0 ? spend / leads : null;
    return res.status(200).json({
      spend: Math.round(spend * 100) / 100,
      impressions, reach, clicks, leads,
      ctr: Math.round(ctr * 100) / 100,
      cpc: Math.round(cpc * 100) / 100,
      cpm: Math.round(cpm * 100) / 100,
      cpl: cpl !== null ? Math.round(cpl * 100) / 100 : null,
      campaigns: (d.data || []).length,
      campaignRows,
      leadBreakdown,
      ts,
    });
  } catch (e) {
    return res.status(200).json({ error: "fetch_error", ts });
  }
};
