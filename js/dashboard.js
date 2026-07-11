/* ROI-Rechner · High-Ticket Workshop (2-Tage-Format)
 * Ported verbatim from the DCLogic renderVals() of Funnel-Dashboard.dc.html.
 * Live recompute on every input change. German number formatting.
 */
(function () {
  'use strict';

  // ---- Benchmarks (Ø-Werte aus der Rechner-Vorlage) ----
  // dir: 1 = höher ist besser (grün), -1 = niedriger ist besser (grün),
  //      0 = neutral (immer grau)
  var BENCH = {
    produktPreis:      { value: 4000,  dir: 1 },
    erfolgspaketPreis: { value: 19.95, dir: 1 },
    adSpend:           { value: 2000,  dir: 0 },
    leadPreis:         { value: 15,    dir: -1 },
    leadsOrg:          { value: 100,   dir: 1 },
    erfolgspaket:      { value: 10,    dir: 1 },  // Erfolgspaket-Quote in %
    showUp1:           { value: 25,    dir: 1 },
    showUp2:           { value: 20,    dir: 1 },
    terminQuote:       { value: 10,    dir: 1 },
    abschluss:         { value: 80,    dir: 1 },
    cashflowQuote:     { value: 30,    dir: 1 }
  };

  // ---- German formatters (match source exactly) ----
  function de(n) { return Math.round(n).toLocaleString('de-DE'); }
  function pct(x) {
    return (Math.round(x * 10) / 10).toLocaleString('de-DE', {
      minimumFractionDigits: 1, maximumFractionDigits: 1
    }) + ' %';
  }
  function eur(n) { return Math.round(n).toLocaleString('de-DE') + ' €'; }
  function roasX(n) {
    return (Math.round(n * 100) / 100).toLocaleString('de-DE', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }) + '×';
  }

  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }

  // Deviation badge vs. benchmark
  function mkDev(actual, b, dir) {
    var d = b ? (actual - b) / b * 100 : 0;
    var text = (d >= 0 ? '+' : '−') + Math.abs(Math.round(d)) + ' %';
    var color = '#9a9087';
    if (dir === 1) color = actual >= b ? '#2E7D54' : '#C0392B';
    else if (dir === -1) color = actual <= b ? '#2E7D54' : '#C0392B';
    return { text: text, color: color };
  }

  function readField(field, fallback) {
    var el = document.querySelector('[data-field="' + field + '"]');
    if (!el) return fallback;
    return num(el.value, fallback);
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function setColor(id, color) {
    var el = document.getElementById(id);
    if (el) el.style.color = color;
  }

  function recompute() {
    // ---- Eingaben ----
    var rProdukt    = readField('produktPreis', 4000);
    var rErfPreis   = readField('erfolgspaketPreis', 19.95);
    var rAdSpend    = readField('adSpend', 2000);
    var rLeadPreis  = readField('leadPreis', 15);
    var rLeadsOrg   = Math.round(readField('leadsOrg', 100));
    var rErfVerkauft = Math.round(readField('erfolgspaketVerkauft', 30));
    var rSU1        = readField('showUp1', 25) / 100;
    var rSU2        = readField('showUp2', 20) / 100;
    var rTerminQ    = readField('terminQuote', 10) / 100;
    var rAbschluss  = readField('abschluss', 80) / 100;
    var rCashQ      = readField('cashflowQuote', 30) / 100;

    // ---- Rechenkette (exakt wie DCLogic) ----
    var rLeadsPaid = rLeadPreis ? rAdSpend / rLeadPreis : 0;
    var rLeadsGes  = rLeadsPaid + rLeadsOrg;
    var rErfSales  = rErfVerkauft;
    var rErfQuotePct = rLeadsGes ? rErfVerkauft / rLeadsGes * 100 : 0;
    var rUmsatzErf = rErfSales * rErfPreis;
    var rShowT1    = rLeadsGes * rSU1;
    var rShowT2    = rLeadsGes * rSU2;
    var rTermine   = rShowT2 * rTerminQ;
    var rSales     = rTermine * rAbschluss;
    var rUmsatzProdukt = rSales * rProdukt;
    var rAuftrag   = rUmsatzProdukt + rUmsatzErf;
    var rSalesPct  = rShowT2 ? rSales / rShowT2 * 100 : 0;
    var rCashflow  = rAuftrag * rCashQ;
    var rGewinn    = rAuftrag - rAdSpend;
    var rRoas      = rAdSpend ? rAuftrag / rAdSpend : 0;

    // ---- Abweichungs-Badges ----
    var devMap = {
      produktPreis:      mkDev(rProdukt, BENCH.produktPreis.value, BENCH.produktPreis.dir),
      erfolgspaketPreis: mkDev(rErfPreis, BENCH.erfolgspaketPreis.value, BENCH.erfolgspaketPreis.dir),
      adSpend:           mkDev(rAdSpend, BENCH.adSpend.value, BENCH.adSpend.dir),
      leadPreis:         mkDev(rLeadPreis, BENCH.leadPreis.value, BENCH.leadPreis.dir),
      leadsOrg:          mkDev(rLeadsOrg, BENCH.leadsOrg.value, BENCH.leadsOrg.dir),
      erfolgspaket:      mkDev(rErfQuotePct, BENCH.erfolgspaket.value, BENCH.erfolgspaket.dir),
      showUp1:           mkDev(rSU1 * 100, BENCH.showUp1.value, BENCH.showUp1.dir),
      showUp2:           mkDev(rSU2 * 100, BENCH.showUp2.value, BENCH.showUp2.dir),
      terminQuote:       mkDev(rTerminQ * 100, BENCH.terminQuote.value, BENCH.terminQuote.dir),
      abschluss:         mkDev(rAbschluss * 100, BENCH.abschluss.value, BENCH.abschluss.dir),
      cashflowQuote:     mkDev(rCashQ * 100, BENCH.cashflowQuote.value, BENCH.cashflowQuote.dir)
    };
    Object.keys(devMap).forEach(function (k) {
      setText('dev-' + k, devMap[k].text);
      setColor('dev-' + k, devMap[k].color);
    });

    // ---- Inline-Werte an Eingaben ----
    setText('roi-erfQuote', pct(rErfQuotePct));

    // ---- Slider-Werteanzeigen ----
    setText('val-showUp1', Math.round(readField('showUp1', 25)) + ' %');
    setText('val-showUp2', Math.round(readField('showUp2', 20)) + ' %');
    setText('val-terminQuote', Math.round(readField('terminQuote', 10)) + ' %');
    setText('val-abschluss', Math.round(readField('abschluss', 80)) + ' %');
    setText('val-cashflowQuote', Math.round(readField('cashflowQuote', 30)) + ' %');

    // ---- Ergebnis-Kacheln ----
    setText('roi-auftrag', eur(rAuftrag));
    setText('roi-gewinn', eur(rGewinn));
    setText('roi-roas', roasX(rRoas));
    setText('roi-cashflow', eur(rCashflow));

    // ---- Rechenkette ----
    setText('roi-leadsPaid', de(rLeadsPaid));
    setText('roi-leadsGes', de(rLeadsGes));
    setText('roi-leadsOrg', de(rLeadsOrg));
    setText('roi-erfSales', de(rErfSales));
    setText('roi-umsatzErf', eur(rUmsatzErf));
    setText('roi-showT1', de(rShowT1));
    setText('roi-showT2', de(rShowT2));
    setText('roi-termine', de(rTermine));
    setText('roi-sales', de(rSales));
    setText('roi-salesPct', pct(rSalesPct));
    setText('roi-umsatzProdukt', eur(rUmsatzProdukt));
    setText('roi-roasChain', roasX(rRoas));
  }

  function init() {
    var fields = document.querySelectorAll('.roi-rechner [data-field]');
    fields.forEach(function (el) {
      el.addEventListener('input', recompute);
      el.addEventListener('change', recompute);
    });
    recompute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
