/* =============================================================
   Mama.Spagat — Promo renderer
   Liest config/promos.json und füllt alle [data-promo="..."]-Elemente
   mit dem Wording der aktiven Promo. Ist keine Promo aktiv (oder
   abgelaufen), wird automatisch auf 'evergreen' zurückgefallen —
   so ist nie ein abgelaufenes Datum sichtbar.
   ============================================================= */
(function () {
  "use strict";

  // config/promos.json liegt relativ zur Seite; intern/ liegt eine Ebene tiefer.
  var base = location.pathname.indexOf("/intern/") !== -1 ? "../" : "";

  function todayISO() {
    var d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function pickActive(data) {
    var t = todayISO();
    var active = (data.promos || []).filter(function (p) {
      return (!p.start || p.start <= t) && (!p.end || t <= p.end);
    });
    // jüngstes start gewinnt, falls mehrere
    active.sort(function (a, b) { return (a.start || "") < (b.start || "") ? 1 : -1; });
    return active[0] || data.evergreen || null;
  }

  function apply(promo) {
    if (!promo || !promo.wording) return;
    Object.keys(promo.wording).forEach(function (key) {
      document.querySelectorAll('[data-promo="' + key + '"]').forEach(function (el) {
        // Config ist vertrauenswürdig (eigene Datei) → innerHTML erlaubt einfaches Markup (<strong>)
        el.innerHTML = promo.wording[key];
      });
    });
    document.documentElement.setAttribute("data-promo-active", promo.id || "");
  }

  fetch("/abnehmrevolution/config/promos.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (data) { apply(pickActive(data)); })
    .catch(function () { /* Seite behält ihr hartcodiertes Default-Wording */ });
})();
