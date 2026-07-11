// /api/lead — Workshop-Opt-in entgegennehmen und weiterleiten:
//   1) Google Sheet (primär, sofort aktiv via GSHEET_WEBHOOK_URL → Apps-Script-Web-App)
//   2) Meta CAPI Lead (server-side, dedupliziert mit client-side Pixel via event_id)
//   3) Kit (sobald KIT_API_KEY gesetzt ist: Subscriber + Tag "Abnehmrevolution Workshop")
//   4) Benachrichtigungs-Mail via Resend (RESEND_API_KEY + NOTIFY_EMAIL env vars)
// Alles best-effort; der Funnel leitet ohnehin weiter (Nutzer wird nie blockiert).
const crypto = require("crypto");
const KIT_API = "https://api.kit.com/v4";
const KIT_TAG_ID = 20703609; // "Abnehmrevolution Workshop Juli 2026" (neue Anmeldeliste — alte = 20481004, NICHT mehr anschreiben)
const PIXEL_ID = "691498019877496";
const sha256 = (s) => s ? crypto.createHash("sha256").update(String(s).toLowerCase().trim()).digest("hex") : undefined;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch (e) { body = Object.fromEntries(new URLSearchParams(body)); }
  }
  body = body || {};
  const email = String(body.email || body.email_address || "").trim();
  const name = String(body.vorname || body.name || body.first_name || "").trim();
  if (!email || email.indexOf("@") === -1) return res.status(400).json({ ok: false, error: "email_required" });

  const utm = {
    utm_source: String(body.utm_source || ""),
    utm_medium: String(body.utm_medium || ""),
    utm_campaign: String(body.utm_campaign || ""),
    utm_content: String(body.utm_content || ""),
    utm_term: String(body.utm_term || ""),
  };
  const abTest = String(body.ab_test || "").slice(0, 40);
  const abVariant = String(body.ab_variant || "").slice(0, 10);

  // Klick-IDs als Paid-Signal: Ad-Klick, dessen UTMs unterwegs verloren gingen
  // (z.B. Instagram/Facebook In-App-Browser) → trotzdem korrekt als Paid zählen.
  const fbclid = String(body.fbclid || "").slice(0, 255);
  const gclid = String(body.gclid || "").slice(0, 255);
  const ttclid = String(body.ttclid || "").slice(0, 255);
  if (!utm.utm_source) {
    if (fbclid) { utm.utm_source = "facebook"; utm.utm_medium = "paid"; }
    else if (gclid) { utm.utm_source = "google"; utm.utm_medium = "paid"; }
    else if (ttclid) { utm.utm_source = "tiktok"; utm.utm_medium = "paid"; }
  }

  const result = { sheet: null, capi_lead: null, kit: null };

  // 1) Google Sheet (Apps-Script-Web-App)
  const sheetUrl = process.env.GSHEET_WEBHOOK_URL;
  if (sheetUrl) {
    try {
      const r = await fetch(sheetUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ name: name, email: email }, utm)),
      });
      result.sheet = r.ok ? "ok" : ("http_" + r.status);
    } catch (e) { result.sheet = "error"; }
  } else { result.sheet = "not_configured"; }

  // 2) Meta CAPI Lead (server-side, dedupliziert via event_id mit client-side Pixel)
  const capiToken = process.env.META_CAPI_TOKEN;
  if (capiToken) {
    const eventId = String(body.event_id || ("lead_" + Date.now()));
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.headers["x-real-ip"] || "";
    const ua = req.headers["user-agent"] || "";
    const userData = { em: [sha256(email)] };
    if (name) userData.fn = [sha256(name)];
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;
    // fbp/fbc als Match-Keys: aus Body (vom Frontend) oder same-origin Cookies;
    // ohne _fbc-Cookie den fbclid aus der Ad-URL zum fbc-Format aufbauen.
    const cookies = String(req.headers.cookie || "");
    const ck = (n) => { const m = cookies.match(new RegExp("(?:^|;\\s*)" + n + "=([^;]+)")); return m ? decodeURIComponent(m[1]) : ""; };
    const fbp = String(body.fbp || "") || ck("_fbp");
    let fbc = String(body.fbc || "") || ck("_fbc");
    if (!fbc && fbclid) fbc = "fb.1." + Date.now() + "." + fbclid;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    try {
      const r = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${capiToken}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000),
          event_id: eventId, event_source_url: "https://start.vanessareinthaller.de/abnehmrevolution",
          action_source: "website", user_data: userData }] }),
      });
      result.capi_lead = r.ok ? "ok" : ("http_" + r.status);
    } catch (e) { result.capi_lead = "error"; }
  } else { result.capi_lead = "not_configured"; }

  // 3) Kit — Subscriber anlegen + Tag + Bestätigungs-Sequence (Juli 2026: Sequence 2809843)
  const KIT_SEQUENCE_ID = 2809843;
  const key = process.env.KIT_API_KEY;
  if (key) {
    const headers = { "Content-Type": "application/json", "Accept": "application/json", "X-Kit-Api-Key": key };
    try {
      // Kit v4 erwartet die Custom-Field-Werte unter "fields" (NICHT "custom_fields" — sonst still ignoriert!)
      const kitFields = { last_funnel: "abnehmrevolution" };
      if (utm.utm_source) { kitFields.utm_source = utm.utm_source; kitFields.lead_source = utm.utm_source; }
      if (utm.utm_medium) kitFields.utm_medium = utm.utm_medium;
      if (utm.utm_campaign) kitFields.utm_campaign = utm.utm_campaign;
      if (utm.utm_content) kitFields.utm_content = utm.utm_content;
      if (utm.utm_term) kitFields.utm_term = utm.utm_term;
      if (abTest) kitFields.ab_test = abTest;
      if (abVariant) kitFields.ab_variant = abVariant;
      await fetch(`${KIT_API}/subscribers`, {
        method: "POST", headers,
        body: JSON.stringify({
          email_address: email,
          first_name: name || undefined,
          state: "active",
          fields: kitFields,
        }),
      });
      await fetch(`${KIT_API}/tags/${KIT_TAG_ID}/subscribers`, {
        method: "POST", headers, body: JSON.stringify({ email_address: email }),
      });
      const s = await fetch(`${KIT_API}/sequences/${KIT_SEQUENCE_ID}/subscribers`, {
        method: "POST", headers, body: JSON.stringify({ email_address: email }),
      });
      result.kit = s.ok ? "ok" : ("http_" + s.status);
    } catch (e) { result.kit = "error"; }
  } else { result.kit = "not_configured"; }

  // 4) Benachrichtigungs-Mail via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_EMAIL || "chrisamy@web.de";
  if (resendKey) {
    const utmLine = [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean).join(" / ") || "—";
    const ts = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "short", timeStyle: "short" });
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": "Bearer " + resendKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Abnehmrevolution <noreply@vanessareinthaller.de>",
          to: [notifyTo],
          subject: "🎉 Neue Anmeldung: " + (name || email),
          html: [
            "<div style='font-family:system-ui,sans-serif;max-width:520px;color:#1B2020'>",
            "<h2 style='margin:0 0 16px;font-size:20px'>Neue Workshop-Anmeldung</h2>",
            "<table style='border-collapse:collapse;width:100%'>",
            "<tr><td style='padding:8px 12px;background:#f5f5f5;font-weight:700;width:130px'>Name</td><td style='padding:8px 12px'>", (name || "—"), "</td></tr>",
            "<tr><td style='padding:8px 12px;font-weight:700'>E-Mail</td><td style='padding:8px 12px'><a href='mailto:", email, "'>", email, "</a></td></tr>",
            "<tr><td style='padding:8px 12px;background:#f5f5f5;font-weight:700'>Quelle</td><td style='padding:8px 12px'>", utmLine, "</td></tr>",
            "<tr><td style='padding:8px 12px;font-weight:700'>Uhrzeit</td><td style='padding:8px 12px'>", ts, "</td></tr>",
            "</table>",
            "<p style='margin:20px 0 0;font-size:13px;color:#888'>Kit: ", (result.kit || "—"), " · Sheet: ", (result.sheet || "—"), "</p>",
            "</div>",
          ].join(""),
        }),
      });
      result.notify = r.ok ? "ok" : ("http_" + r.status);
    } catch (e) { result.notify = "error"; }
  } else { result.notify = "not_configured"; }

  return res.status(200).json({ ok: true, result });
};
