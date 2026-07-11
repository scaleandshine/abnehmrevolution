#!/usr/bin/env node
/* =============================================================
   Promo-Wächter — "Die Abnehmrevolution"
   Pflicht-Komponente (siehe Memory: Funnel-Wächter).
   - Liest config/promos.json
   - Warnt PROMO_HORIZON_DAYS (default 3) vor 'end' jeder aktiven Promo
   - Flaggt bereits abgelaufene Promos (Seite fällt sonst auf evergreen)
   - Schreibt .alerts/promos.json + Exit-Code 0
   Lauf: `node scripts/promo-watcher.mjs`  (täglich per Cron/Routine)
   ============================================================= */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HORIZON = parseInt(process.env.PROMO_HORIZON_DAYS || "3", 10);

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);

const cfg = JSON.parse(readFileSync(join(ROOT, "config/promos.json"), "utf8"));
const alerts = [];

for (const p of cfg.promos || []) {
  if (!p.end) continue;
  const d = daysBetween(today, p.end);
  if (d < 0) {
    alerts.push({ level: "expired", promo: p.id, end: p.end,
      message: `Promo "${p.id}" ist seit ${-d} Tag(en) abgelaufen (end ${p.end}). Seite zeigt Evergreen-Wording. Neue Runde terminieren?` });
  } else if (d <= HORIZON) {
    alerts.push({ level: "warn", promo: p.id, end: p.end, daysLeft: d,
      message: `Promo "${p.id}" endet in ${d} Tag(en) (${p.end}). Auslaufen lassen / verlängern bis X / ersetzen durch Y?` });
  }
}

const out = { generatedAt: new Date().toISOString(), horizonDays: HORIZON, today: iso(today), alerts };
mkdirSync(join(ROOT, ".alerts"), { recursive: true });
writeFileSync(join(ROOT, ".alerts/promos.json"), JSON.stringify(out, null, 2));

if (!alerts.length) {
  console.log(`✓ Promo-Wächter: keine ablaufenden Promos innerhalb ${HORIZON} Tagen.`);
} else {
  console.log(`⚠ Promo-Wächter — ${alerts.length} Hinweis(e):`);
  for (const a of alerts) console.log(`  [${a.level}] ${a.message}`);
}
