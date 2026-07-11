// /api/email-stats — Kit E-Mail-Statistiken für dieses Projekt
//   - Sequenzen (Abnehmrevolution): Name, aktive Subscriber, E-Mail-Anzahl
//   - Broadcasts: Workshop-Reminder + Aktivierungs-/Launch-Mails an die Gesamtliste
//     (Match über Betreff ODER interne description, da Aktivierungsmails kein
//      "Abnehmrevolution" im Betreff tragen). [TEST]-Mails werden ausgeschlossen.
//   - Zustellbarkeit: aggregiert über gesendete Broadcasts
const KIT_API = "https://api.kit.com/v4";
const PROJECT_KEYWORD = "abnehmrevolution";
// Keywords in Betreff ODER description, die einen Broadcast diesem Projekt zuordnen
const PROJECT_KEYWORDS = ["abnehmrevolution", "aktivierung", "workshop broadcast", "reminder"];
const EXCLUDE_KEYWORDS = ["[test]", "design-test", "branding-check"];
function isProjectBroadcast(b) {
  const hay = ((b.subject || "") + " " + (b.description || "")).toLowerCase();
  if (EXCLUDE_KEYWORDS.some((k) => hay.includes(k))) return false;
  return PROJECT_KEYWORDS.some((k) => hay.includes(k));
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ error: "not_configured", ts: new Date().toISOString() });

  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const out = { sequences: [], broadcasts: [], deliverability: null, ts: new Date().toISOString() };

  try {
    // 1) Sequenzen filtern auf Projekt-Keyword
    const seqRes = await fetch(`${KIT_API}/sequences?per_page=100`, { headers });
    if (seqRes.ok) {
      const seqData = await seqRes.json();
      out.sequences = (seqData.sequences || [])
        .filter((s) => (s.name || "").toLowerCase().includes(PROJECT_KEYWORD))
        .map((s) => ({
          id: s.id, name: s.name, active: s.active,
          email_count: s.email_count, subscriber_count: s.subscriber_count,
        }));
    }

    // 2) Broadcasts listen + Betreff filtern
    const bcRes = await fetch(`${KIT_API}/broadcasts?per_page=100`, { headers });
    let candidates = [];
    if (bcRes.ok) {
      const bcData = await bcRes.json();
      candidates = (bcData.broadcasts || []).filter(isProjectBroadcast);
    }

    // 3) Pro Broadcast Stats holen (nur gesendete/laufende zählen für Zustellbarkeit)
    let sumRecip = 0, sumOpened = 0, sumClicks = 0, sumUnsub = 0, sentCount = 0;
    for (const b of candidates.slice(0, 60)) {
      let stats = null;
      try {
        const sRes = await fetch(`${KIT_API}/broadcasts/${b.id}/stats`, { headers });
        if (sRes.ok) {
          const sData = await sRes.json();
          stats = (sData.broadcast && sData.broadcast.stats) || sData.stats || null;
        }
      } catch (e) {}
      const st = stats || {};
      const row = {
        id: b.id, subject: b.subject, send_at: b.send_at, status: st.status || b.status || "draft",
        recipients: st.recipients || 0,
        open_rate: st.open_rate || 0,
        click_rate: st.click_rate || 0,
        unsubscribe_rate: st.unsubscribe_rate || 0,
        unsubscribes: st.unsubscribes || 0,
        total_clicks: st.total_clicks || 0,
        emails_opened: st.emails_opened || 0,
      };
      out.broadcasts.push(row);
      if (row.status === "completed" || row.status === "sending") {
        sentCount++;
        sumRecip += row.recipients;
        sumOpened += row.emails_opened;
        sumClicks += row.total_clicks;
        sumUnsub += row.unsubscribes;
      }
    }

    // Broadcasts: gesendete zuerst, dann nach Datum
    out.broadcasts.sort((a, b) => {
      const order = { sending: 0, completed: 1, scheduled: 2, draft: 3, aborted: 4 };
      const oa = order[a.status] ?? 5, ob = order[b.status] ?? 5;
      if (oa !== ob) return oa - ob;
      return String(b.send_at || "").localeCompare(String(a.send_at || ""));
    });

    // 4) Zustellbarkeit aggregiert
    out.deliverability = {
      sent_broadcasts: sentCount,
      total_recipients: sumRecip,
      avg_open_rate: sumRecip > 0 ? (sumOpened / sumRecip) * 100 : null,
      avg_click_rate: sumRecip > 0 ? (sumClicks / sumRecip) * 100 : null,
      unsubscribe_rate: sumRecip > 0 ? (sumUnsub / sumRecip) * 100 : null,
      total_unsubscribes: sumUnsub,
    };
  } catch (e) {
    out.error = "fetch_error";
  }

  return res.status(200).json(out);
};
