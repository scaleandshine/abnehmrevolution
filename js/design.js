// design.js v2 — wendet Design- & Text-Overrides aus dem internen Editor an (alle Funnel-Seiten).
// Config-Quelle: /api/design (Kit-Snippet als Store) + localStorage-Cache gegen Flackern.
// Schema v2: { v:2, pages:{ <page>:{ sections:{<key>:{d:{},m:{}}}, texts:{<txtKey>:{h,oh}} } }, ab:{ headline_v1:'A'|'B'|null } }
// Editor-Vorschau (iframe): postMessage 'ar-design-preview' / 'ar-edit-mode', meldet 'ar-design-ready' / 'ar-text-changed'.
(function () {
  var API = "/abnehmrevolution/api/design";
  var LS = "ar_design_cfg_v1";
  var MOBILE_BP = 760;
  var AB_TEST = "cta_v1";
  var pageKey, secEls = [], flexroot = null, pristine = {}; // pristine[txtKey] = hash

  function slug(s) {
    return String(s || "").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function hash(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16);
  }
  function detectPage() {
    var p = location.pathname.replace(/^\/abnehmrevolution/, "").replace(/^\/+|\/+$/g, "").replace(/\.html$/, "");
    return p === "" || p === "index" ? "landing" : p;
  }
  function hasDirectText(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.replace(/\s+/g, "") !== "") return true;
    }
    return false;
  }

  // ---- Setup: Sektionen keyen, Text-Kandidaten taggen (VOR jedem Override = pristine) ----
  function setup() {
    pageKey = detectPage();
    var els = document.querySelectorAll("section[data-screen-label]");
    secEls = [];
    var parents = [];
    for (var i = 0; i < els.length; i++) {
      var label = els[i].getAttribute("data-screen-label");
      var key = slug(label);
      els[i].setAttribute("data-sec", key);
      secEls.push({ key: key, label: label, index: i, el: els[i] });
      if (parents.indexOf(els[i].parentElement) === -1) parents.push(els[i].parentElement);
      // Text-Kandidaten dieser Sektion deterministisch durchnummerieren
      var cands = els[i].querySelectorAll("*");
      var idx = 0;
      for (var c = 0; c < cands.length; c++) {
        if (!hasDirectText(cands[c])) continue;
        if (cands[c].closest("[data-countdown]")) { idx++; continue; } // Countdown-Ziffern nicht editierbar
        var tk = key + ":" + idx;
        cands[c].setAttribute("data-txt", tk);
        pristine[tk] = hash(cands[c].innerHTML);
        idx++;
      }
    }
    // Reihenfolge nur möglich, wenn alle Sektionen denselben Parent teilen
    flexroot = (parents.length === 1 && parents[0]) ? parents[0] : null;
    if (flexroot) {
      flexroot.classList.add("ar-flexroot");
      // Nicht-Sektions-Kinder behalten ihre Position (explizite order)
      for (var k = 0; k < flexroot.children.length; k++) {
        var ch = flexroot.children[k];
        if (!ch.hasAttribute("data-sec")) ch.style.order = String(k * 10);
      }
      secEls.forEach(function (s) {
        s.domOrder = Array.prototype.indexOf.call(flexroot.children, s.el) * 10;
      });
    }
  }

  // ---- CSS aus Config bauen ----
  function cssFor(cfg) {
    var pg = ((cfg || {}).pages || {})[pageKey] || {};
    var byKey = pg.sections || {};
    var base = [], mobile = [];
    if (flexroot) base.push(".ar-flexroot{display:flex;flex-direction:column;}");
    secEls.forEach(function (s) {
      var c = byKey[s.key] || {};
      var d = c.d || {}, m = c.m || {};
      var sel = 'section[data-sec="' + s.key + '"]';
      if (flexroot) {
        var od = (typeof d.o === "number") ? d.o : s.domOrder;
        base.push(sel + "{order:" + od + ";}");
        if (typeof m.o === "number") mobile.push(sel + "{order:" + m.o + ";}");
      }
      if (d.hide) base.push(sel + "{display:none;}");
      if (m.hide === true) mobile.push(sel + "{display:none;}");
      if (m.hide === false && d.hide) mobile.push(sel + "{display:block;}");
      var pd = [];
      if (typeof d.pt === "number") pd.push("padding-top:" + d.pt + "px !important");
      if (typeof d.pb === "number") pd.push("padding-bottom:" + d.pb + "px !important");
      if (pd.length) base.push(sel + "{" + pd.join(";") + ";}");
      var pm = [];
      if (typeof m.pt === "number") pm.push("padding-top:" + m.pt + "px !important");
      if (typeof m.pb === "number") pm.push("padding-bottom:" + m.pb + "px !important");
      if (pm.length) mobile.push(sel + "{" + pm.join(";") + ";}");
      if (typeof d.z === "number" && d.z !== 100) base.push(sel + "{zoom:" + (d.z / 100) + ";}");
      if (typeof m.z === "number") mobile.push(sel + "{zoom:" + (m.z / 100) + ";}");
      if (typeof d.w === "number") base.push(sel + ">*{max-width:" + d.w + "px !important;margin-left:auto !important;margin-right:auto !important;}");
      if (typeof m.w === "number") mobile.push(sel + ">*{max-width:" + m.w + "px !important;margin-left:auto !important;margin-right:auto !important;}");
    });
    var css = base.join("\n");
    if (mobile.length) css += "\n@media (max-width:" + MOBILE_BP + "px){\n" + mobile.join("\n") + "\n}";
    return css;
  }

  // ---- Text-Overrides anwenden (nur wenn Original unverändert = Hash passt) ----
  function applyTexts(cfg) {
    var pg = ((cfg || {}).pages || {})[pageKey] || {};
    var texts = pg.texts || {};
    Object.keys(texts).forEach(function (tk) {
      var o = texts[tk] || {};
      var el = document.querySelector('[data-txt="' + tk + '"]');
      if (!el) return;
      if (o.oh && pristine[tk] && o.oh !== pristine[tk]) return; // Quelle hat sich geändert → Override verwerfen
      if (typeof o.h === "string" && el.innerHTML !== o.h) el.innerHTML = o.h;
    });
  }

  // ---- A/B fixieren (Landing) ----
  function applyAb(cfg) {
    var f = ((cfg || {}).ab || {})[AB_TEST];
    if (f !== "A" && f !== "B") return;
    if (document.documentElement.getAttribute("data-ab") !== f) {
      document.documentElement.setAttribute("data-ab", f);
    }
    // Test gilt als beendet → nicht mehr in die Test-Auswertung tracken
    if (window.__AB__ && window.__AB__.variant !== f) window.__AB__ = { test: "", variant: "" };
  }

  function migrate(cfg) {
    if (cfg && cfg.sections && !cfg.pages) return { v: 2, pages: { landing: { sections: cfg.sections, texts: {} } }, ab: {} };
    return cfg || {};
  }

  function apply(cfg) {
    cfg = migrate(cfg);
    var el = document.getElementById("ar-design-style");
    if (!el) { el = document.createElement("style"); el.id = "ar-design-style"; document.head.appendChild(el); }
    try {
      el.textContent = cssFor(cfg);
      applyTexts(cfg);
      applyAb(cfg);
    } catch (e) { /* nie die Seite brechen */ }
  }

  // ---- Edit-Modus (nur im Editor-iframe) ----
  var editOn = false;
  function setEdit(on) {
    editOn = !!on;
    var st = document.getElementById("ar-edit-style");
    if (on && !st) {
      st = document.createElement("style"); st.id = "ar-edit-style";
      st.textContent = "[data-txt]{cursor:text;} [data-txt]:hover{outline:2px dashed rgba(202,93,37,0.7);outline-offset:2px;} [data-txt][contenteditable]{outline:2px solid #CA5D25 !important;outline-offset:2px;background:rgba(202,93,37,0.06);}";
      document.head.appendChild(st);
    }
    if (!on) {
      if (st) st.remove();
      document.querySelectorAll("[data-txt][contenteditable]").forEach(function (el) { el.removeAttribute("contenteditable"); });
    }
  }
  function initEditHandlers() {
    document.addEventListener("click", function (e) {
      if (!editOn) return;
      e.preventDefault(); e.stopPropagation();
      var t = e.target && e.target.closest ? e.target.closest("[data-txt]") : null;
      document.querySelectorAll("[data-txt][contenteditable]").forEach(function (el) { if (el !== t) el.removeAttribute("contenteditable"); });
      if (t) { t.setAttribute("contenteditable", "true"); t.focus(); }
    }, true);
    var deb = null;
    function report(el) {
      var tk = el.getAttribute("data-txt");
      try {
        window.parent.postMessage({ type: "ar-text-changed", page: pageKey, key: tk, html: el.innerHTML, oh: pristine[tk] || "", preview: el.textContent.slice(0, 60) }, "*");
      } catch (e) {}
    }
    document.addEventListener("input", function (e) {
      if (!editOn) return;
      var el = e.target && e.target.closest ? e.target.closest("[data-txt]") : null;
      if (!el) return;
      clearTimeout(deb); deb = setTimeout(function () { report(el); }, 250);
    }, true);
  }

  function boot() {
    setup();
    if (!secEls.length) return;
    try { var c = JSON.parse(localStorage.getItem(LS) || "null"); apply(c || {}); } catch (e) { apply({}); }
    fetch(API, { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var cfg = migrate((d && d.config) || {});
        apply(cfg);
        try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch (e) {}
      })
      .catch(function () {});
    if (window.self !== window.top) {
      initEditHandlers();
      window.addEventListener("message", function (ev) {
        var d = ev.data || {};
        if (d.type === "ar-design-preview") apply(d.config || {});
        if (d.type === "ar-edit-mode") setEdit(d.on);
      });
      try {
        window.parent.postMessage({
          type: "ar-design-ready", page: pageKey,
          sections: secEls.map(function (s) { return { key: s.key, label: s.label, index: s.index }; }),
          canOrder: !!flexroot,
          hasAb: pageKey === "landing",
        }, "*");
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
