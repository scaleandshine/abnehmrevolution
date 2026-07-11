// /api/purchase — Kauf-Webhook (von Zapier: Tentary New Sale)
//   1) Meta CAPI Purchase (server-side)
//   2) Google Sheet update via Apps-Script-Web-App
//   3) Kit Tag "buy-glow-starterpaket" (#20501833) → zählt im Dashboard
// Zapier zeigt auf /abnehmrevolution/api/purchase/ (trailing slash wegen project-you proxy)
const crypto = require("crypto");
const KIT_API = "https://api.kit.com/v4";
const KIT_GLOW_TAG_ID = 20501833;
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
  const email = String(body.email || "").trim();
  const product = String(body.product || "Glow Starterpaket").trim();
  const amount = parseFloat(body.amount || 0);
  if (!email || email.indexOf("@") === -1) return res.status(400).json({ ok: false, error: "email_required" });

  const result = { capi_purchase: null, sheet: null };

  // 1) Meta CAPI Purchase
  const capiToken = process.env.META_CAPI_TOKEN;
  if (capiToken) {
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "";
    const ua = req.headers["user-agent"] || "";
    const userData = { em: [sha256(email)] };
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;
    const eventId = "purchase_" + sha256(email).slice(0, 12) + "_" + Math.floor(Date.now() / 1000);
    try {
      const r = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${capiToken}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ event_name: "Purchase", event_time: Math.floor(Date.now() / 1000),
          event_id: eventId, event_source_url: "https://start.vanessareinthaller.de/abnehmrevolution/danke",
          action_source: "website", user_data: userData,
          custom_data: { currency: "EUR", value: amount, content_name: product } }] }),
      });
      result.capi_purchase = r.ok ? "ok" : ("http_" + r.status);
    } catch (e) { result.capi_purchase = "error"; }
  } else { result.capi_purchase = "not_configured"; }

  // 2) Google Sheet (Apps-Script-Web-App)
  const sheetUrl = process.env.GSHEET_WEBHOOK_URL;
  if (sheetUrl) {
    try {
      const r = await fetch(sheetUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "purchase", email, product, amount: String(amount) }),
      });
      result.sheet = r.ok ? "ok" : ("http_" + r.status);
    } catch (e) { result.sheet = "error"; }
  } else { result.sheet = "not_configured"; }

  // 3) Kit: Tag Käufer mit buy-glow-starterpaket
  const kitKey = process.env.KIT_API_KEY;
  if (kitKey) {
    try {
      const headers = { "Content-Type": "application/json", "Accept": "application/json", "X-Kit-Api-Key": kitKey };
      await fetch(`${KIT_API}/tags/${KIT_GLOW_TAG_ID}/subscribers`, {
        method: "POST", headers, body: JSON.stringify({ email_address: email }),
      });
      result.kit_tag = "ok";
    } catch (e) { result.kit_tag = "error"; }
  } else { result.kit_tag = "not_configured"; }

  return res.status(200).json({ ok: true, result });
};
