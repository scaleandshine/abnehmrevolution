#!/usr/bin/env node
/* =============================================================
   Conversion-Wächter — "Die Abnehmrevolution"
   Pflicht-Komponente (siehe Memory: Funnel-Wächter).
   Zieht täglich PostHog-Funnel-Daten (gefiltert auf funnel="abnehmrevolution"),
   hält 7-Tage-Rolling-Baseline + Stdabweichung pro Step und alarmiert bei:
     - Rate >2σ vom Baseline (beide Richtungen)
     - Einbruch einer utm_source >50%
     - Funnel-Step plötzlich 0 (Tracking-Bruch)
   Schreibt .alerts/conversion.json.

   ENV:
     POSTHOG_PERSONAL_API_KEY   (Pflicht, Query-Read-Scope)
     POSTHOG_PROJECT_ID         (default 174473)
     POSTHOG_HOST               (default https://eu.i.posthog.com)
   Lauf: `node scripts/conversion-watcher.mjs`  (täglich per Cron/Routine)

   Hinweis: Der echte 'purchase'-Step kommt erst mit Phase 2
   (Tentary→CAPI/PostHog-Bridge). Bis dahin ist 'checkout_click' der
   tiefste verlässliche Step; der Watcher überspringt fehlende Steps sauber.
   ============================================================= */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT = process.env.POSTHOG_PROJECT_ID || "174473";
const HOST = (process.env.POSTHOG_HOST || "https://eu.i.posthog.com").replace(/\/$/, "");
const FUNNEL = "abnehmrevolution";

// Steps in funnel order. event name in PostHog -> label.
const STEPS = [
  ["$pageview", "Visits"],
  ["optin_submitted", "Optins"],
  ["checkout_click", "Checkout-Klicks"],
  ["purchase", "Käufe"], // Phase 2 — wird aktuell ggf. 0 sein
];

async function hogql(query) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  if (!res.ok) throw new Error(`PostHog ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return json.results || [];
}

const INTERNAL = `coalesce(properties.internal_user, 'false') != 'true'`;
const FUNNELF = `properties.funnel = '${FUNNEL}'`;

// daily count per event for last 8 days (today + 7 baseline)
async function dailyCounts(event) {
  const rows = await hogql(`
    SELECT toDate(timestamp) AS d, count() AS c
    FROM events
    WHERE event = '${event}' AND ${FUNNELF} AND ${INTERNAL}
      AND timestamp >= now() - INTERVAL 8 DAY
    GROUP BY d ORDER BY d ASC`);
  const map = {};
  for (const [d, c] of rows) map[d] = Number(c);
  return map;
}

function mean(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }
function stddev(a) { const m = mean(a); return a.length ? Math.sqrt(mean(a.map((x) => (x - m) ** 2))) : 0; }

function lastNDates(n, offset = 0) {
  const out = [];
  for (let i = offset + n; i > offset; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function run() {
  if (!KEY) {
    console.error("✗ POSTHOG_PERSONAL_API_KEY fehlt — Conversion-Wächter übersprungen. (Phase-1: Key als Env setzen.)");
    process.exit(0);
  }
  const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  const baselineDates = lastNDates(7, 1); // 7 Tage vor gestern
  const alerts = [];
  const snapshot = {};

  for (const [event, label] of STEPS) {
    let counts;
    try { counts = await dailyCounts(event); }
    catch (e) { alerts.push({ level: "error", step: label, message: `PostHog-Query fehlgeschlagen (${label}): ${e.message}` }); continue; }

    const yVal = counts[yesterday] || 0;
    const base = baselineDates.map((d) => counts[d] || 0);
    const m = mean(base), sd = stddev(base);
    snapshot[label] = { yesterday: yVal, baselineMean: Math.round(m * 10) / 10, baselineStd: Math.round(sd * 10) / 10 };

    // Tracking-Bruch: oberer Funnel hatte Baseline, gestern 0
    if (m >= 3 && yVal === 0) {
      alerts.push({ level: "critical", step: label,
        message: `${label}: gestern 0, Baseline Ø ${m.toFixed(1)}/Tag → Verdacht Tracking-Bruch.` });
      continue;
    }
    // >2σ Abweichung (beide Richtungen), nur wenn Baseline aussagekräftig
    if (m >= 5 && sd > 0 && Math.abs(yVal - m) > 2 * sd) {
      const dir = yVal < m ? "−" : "+";
      const pct = m ? Math.round(((yVal - m) / m) * 100) : 0;
      alerts.push({ level: yVal < m ? "warn" : "info", step: label,
        message: `${label}: gestern ${yVal}, Baseline Ø ${m.toFixed(1)} (${dir}${Math.abs(pct)}%, >2σ). ${yVal < m ? "Einbruch prüfen." : "Positiver Spike — was lief richtig?"}` });
    }
  }

  // UTM-Source-Einbruch (Visits gestern vs Baseline-Schnitt pro source)
  try {
    const rows = await hogql(`
      SELECT properties.utm_source AS src,
             countIf(toDate(timestamp) = '${yesterday}') AS y,
             countIf(toDate(timestamp) >= '${baselineDates[0]}' AND toDate(timestamp) <= '${baselineDates[baselineDates.length-1]}') AS base
      FROM events
      WHERE event = '$pageview' AND ${FUNNELF} AND ${INTERNAL}
        AND timestamp >= now() - INTERVAL 8 DAY AND isNotNull(properties.utm_source)
      GROUP BY src HAVING base >= 35 ORDER BY base DESC LIMIT 20`);
    for (const [src, y, base] of rows) {
      const baseAvg = Number(base) / 7;
      if (baseAvg >= 5 && Number(y) < baseAvg * 0.5) {
        alerts.push({ level: "warn", step: "utm_source",
          message: `utm_source="${src}": gestern ${y} Visits, Baseline Ø ${baseAvg.toFixed(1)}/Tag (−${Math.round((1 - Number(y)/baseAvg) * 100)}%). Ad-Source eingebrochen?` });
      }
    }
  } catch (e) {
    alerts.push({ level: "error", step: "utm_source", message: `UTM-Query fehlgeschlagen: ${e.message}` });
  }

  const out = { generatedAt: new Date().toISOString(), funnel: FUNNEL, day: yesterday, snapshot, alerts };
  mkdirSync(join(ROOT, ".alerts"), { recursive: true });
  writeFileSync(join(ROOT, ".alerts/conversion.json"), JSON.stringify(out, null, 2));

  console.log(`Conversion-Wächter (${yesterday}) — Funnel "${FUNNEL}"`);
  for (const [label, s] of Object.entries(snapshot)) console.log(`  ${label}: gestern ${s.yesterday} | Ø ${s.baselineMean} ±${s.baselineStd}`);
  if (!alerts.length) console.log("✓ Keine Auffälligkeiten.");
  else { console.log(`⚠ ${alerts.length} Alert(s):`); for (const a of alerts) console.log(`  [${a.level}] ${a.message}`); }
}

run().catch((e) => { console.error("Watcher-Fehler:", e); process.exit(1); });
