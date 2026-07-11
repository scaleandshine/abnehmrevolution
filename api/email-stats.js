// /api/email-stats — E-Mail-Statistik NUR für die Kampagne zum aktuellen Workshop (18.+19.07.2026).
// Fest verdrahtete Broadcast-IDs statt Keyword-Matching, getrennt nach den zwei Strecken:
//   - "angemeldet":  Reminder an die Workshop-Anmelder (Tag 20703609)
//   - "nicht":       Aktivierung an die Bestandsliste (Nicht-Angemeldete) + ReInvite (Juni-Teilnehmerinnen)
// Unique Empfänger = größter Einzelversand der Strecke (alle Mails gehen an dieselbe Zielgruppe),
// NICHT die Summe über alle Mails. Newsletter-Bilanz über /v4/account/growth_stats.
const KIT_API = "https://api.kit.com/v4";

const SENT_WITHOUT_UTM = [24764177, 24764178, 24898485]; // A2, A3, RI1 gingen ohne UTM raus
const WORKSHOP_TAG = 20703609;

const CAMPAIGN = {
  label: "Workshop 18.+19. Juli 2026",
  start: "2026-07-09", // erste Kampagnen-Mail (Aktivierung 2 + ReInvite 1)
  end: "2026-07-19",   // letzte Mail (Tag 2)
};

const MAILS = [
  // ---- Strecke 1: Angemeldete (Reminder) ----
  { id: 24764103, g: "angemeldet", kind: "Reminder", label: "R1 · 2 Wochen vorher" },
  { id: 24764104, g: "angemeldet", kind: "Reminder", label: "R2 · 7 Tage vorher" },
  { id: 24764108, g: "angemeldet", kind: "Reminder", label: "R3 · VIP-Telegram" },
  { id: 24764111, g: "angemeldet", kind: "Reminder", label: "R4 · Agenda" },
  { id: 24764112, g: "angemeldet", kind: "Reminder", label: "R5 · 1 Tag vorher" },
  { id: 24764113, g: "angemeldet", kind: "Reminder", label: "R6 · 12h vorher" },
  { id: 24764115, g: "angemeldet", kind: "Reminder", label: "R7 · 4h vorher (T1)" },
  { id: 24764116, g: "angemeldet", kind: "Reminder", label: "R8 · 15min vorher (T1)" },
  { id: 24830692, g: "angemeldet", kind: "Reminder", label: "R8b · 🔴 LIVE (T1)" },
  { id: 24764118, g: "angemeldet", kind: "Reminder", label: "R9 · Pause (T1, optional)" },
  { id: 24764121, g: "angemeldet", kind: "Reminder", label: "R10 · Abend vor Tag 2" },
  { id: 24764125, g: "angemeldet", kind: "Reminder", label: "R11 · 4h vorher (T2)" },
  { id: 24764128, g: "angemeldet", kind: "Reminder", label: "R12 · 15min vorher (T2)" },
  { id: 24830693, g: "angemeldet", kind: "Reminder", label: "R12b · 🔴 LIVE (T2)" },
  { id: 24764129, g: "angemeldet", kind: "Reminder", label: "R13 · Pause (T2, optional)" },
  { id: 24950245, g: "angemeldet", kind: "Nachfass", label: "GN1 · Glow-Nachfass" },
  // ---- Strecke 2: Nicht-Angemeldete (Aktivierung Bestandsliste + ReInvite) ----
  { id: 24764174, g: "nicht", kind: "Aktivierung", label: "A1 · Einladung" },
  { id: 24764177, g: "nicht", kind: "Aktivierung", label: "A2 · Gain" },
  { id: 24764178, g: "nicht", kind: "Aktivierung", label: "A3 · Story" },
  { id: 24764182, g: "nicht", kind: "Aktivierung", label: "A4 · Trust" },
  { id: 24764186, g: "nicht", kind: "Aktivierung", label: "A5 · Logic" },
  { id: 24764187, g: "nicht", kind: "Aktivierung", label: "A6 · FOMO" },
  { id: 24764189, g: "nicht", kind: "Aktivierung", label: "A7 · Letzte Chance" },
  { id: 24764191, g: "nicht", kind: "Aktivierung", label: "A8 · Heute geht's los" },
  { id: 24764192, g: "nicht", kind: "Aktivierung", label: "A9 · Ansturm (T1 live)" },
  { id: 24764195, g: "nicht", kind: "Aktivierung", label: "A10 · Finale (T2)" },
  { id: 24898485, g: "nicht", kind: "ReInvite", label: "RI1 · Wiedersehen" },
  { id: 24898488, g: "nicht", kind: "ReInvite", label: "RI2 · Warum nochmal" },
  { id: 24898489, g: "nicht", kind: "ReInvite", label: "RI3 · Last Call" },
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).end();

  const key = process.env.KIT_API_KEY;
  if (!key) return res.status(200).json({ error: "not_configured", ts: new Date().toISOString() });
  const headers = { "X-Kit-Api-Key": key, "Accept": "application/json" };
  const jget = (url) => fetch(url, { headers }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

  // 0) Anmeldungen über E-Mails: Juli-Anmelder (status=all) mit utm_medium=email nach utm_content
  async function emailSignups() {
    const byContent = {};
    let after = null, total = 0;
    for (let i = 0; i < 10; i++) {
      let url = `${KIT_API}/tags/${WORKSHOP_TAG}/subscribers?per_page=500&status=all&include[]=fields`;
      if (after) url += `&after=${after}`;
      const d = await jget(url);
      if (!d) break;
      for (const s of (d.subscribers || [])) {
        const f = s.fields || {};
        if ((f.utm_medium || "").toLowerCase() === "email" && f.utm_content) {
          byContent[f.utm_content] = (byContent[f.utm_content] || 0) + 1;
          total++;
        }
      }
      if (!d.pagination || !d.pagination.has_next_page) break;
      after = d.pagination.end_cursor;
    }
    return { byContent, total };
  }
  const signupsPromise = emailSignups();

  // 1) Broadcast-Metadaten + Stats parallel
  const rows = await Promise.all(MAILS.map(async (m) => {
    const [bd, sd] = await Promise.all([
      jget(`${KIT_API}/broadcasts/${m.id}`),
      jget(`${KIT_API}/broadcasts/${m.id}/stats`),
    ]);
    const b = (bd && bd.broadcast) || {};
    const s = (sd && sd.broadcast && sd.broadcast.stats) || {};
    const status = s.status === "completed" || s.status === "sending" ? s.status : (b.status || "draft");
    return {
      id: m.id, g: m.g, kind: m.kind, label: m.label,
      subject: b.subject || "", status,
      send_at: b.send_at || null, published_at: b.published_at || null,
      recipients: s.recipients || 0,
      open_rate: s.open_rate || 0, click_rate: s.click_rate || 0,
      opens: s.emails_opened || 0, clicks: s.total_clicks || 0,
      unsubs: s.unsubscribes || 0, unsub_rate: s.unsubscribe_rate || 0,
    };
  }));

  const su = await signupsPromise;
  rows.forEach((r) => {
    if (r.g !== "nicht") return;
    const code = r.label.split(" ·")[0].trim();
    const sent = r.status === "completed" || r.status === "sending";
    if (sent && SENT_WITHOUT_UTM.indexOf(r.id) !== -1) r.signups = null; // ohne UTM gesendet → nicht zuordenbar
    else r.signups = su.byContent[code] || 0;
  });

  // 2) Gruppen-Aggregate: Unique = größter Einzelversand; Raten gewichtet über gesendete Mails
  function agg(g) {
    const list = rows.filter((r) => r.g === g);
    const sent = list.filter((r) => r.status === "completed" || r.status === "sending");
    const sumRec = sent.reduce((a, r) => a + r.recipients, 0);
    const sumOpens = sent.reduce((a, r) => a + r.opens, 0);
    const sumClicks = sent.reduce((a, r) => a + r.clicks, 0);
    return {
      mails: list,
      unique_recipients: sent.length ? Math.max.apply(null, sent.map((r) => r.recipients)) : 0,
      sent: sent.length,
      scheduled: list.filter((r) => r.status === "scheduled").length,
      draft: list.filter((r) => r.status === "draft").length,
      total: list.length,
      opens: sumOpens, clicks: sumClicks,
      unsubs: sent.reduce((a, r) => a + r.unsubs, 0),
      avg_open_rate: sumRec ? Math.round((sumOpens / sumRec) * 1000) / 10 : null,
      avg_click_rate: sumRec ? Math.round((sumClicks / sumRec) * 1000) / 10 : null,
      signups: g === "nicht" ? list.reduce((a, r) => a + (r.signups || 0), 0) : undefined,
    };
  }

  // 3) Newsletter-Bilanz über den Kampagnenzeitraum (ganze Liste: Zugänge vs. Abmeldungen)
  let newsletter = null;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const ending = today < CAMPAIGN.end ? today : CAMPAIGN.end;
    const g = await jget(`${KIT_API}/account/growth_stats?starting=${CAMPAIGN.start}&ending=${ending}`);
    if (g && g.stats) {
      const st = g.stats;
      const current = st.subscribers || 0;
      const net = st.net_new_subscribers || 0;
      newsletter = {
        start_count: current - net,          // im Newsletter, bevor die erste Kampagnen-Mail raus ging
        new_subscribers: st.new_subscribers || 0,
        cancellations: Math.abs(st.cancellations || 0),
        net: net,
        current: current,
        starting: CAMPAIGN.start, ending,
        campaign_running: today < CAMPAIGN.end,
      };
    }
  } catch (e) {}

  return res.status(200).json({
    campaign: CAMPAIGN,
    angemeldet: agg("angemeldet"),
    nicht: agg("nicht"),
    newsletter,
    ts: new Date().toISOString(),
  });
};
