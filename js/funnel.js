/* =============================================================
   Mama.Spagat — Funnel shared runtime
   Vanilla JS, no dependencies. Data-attribute driven so each
   page only needs markup.
   ============================================================= */
// UTM-Capture: URL-Parameter beim Seitenaufruf in localStorage sichern
// + Klick-IDs (fbclid/gclid/ttclid) als Paid-Signal, falls UTMs fehlen (z.B. In-App-Browser)
(function () {
  try {
    var p = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = p.get(k);
      if (v) localStorage.setItem('ms_' + k, v);
    });
    ['fbclid', 'gclid', 'ttclid'].forEach(function (k) {
      var v = p.get(k);
      if (v) localStorage.setItem('ms_' + k, v);
    });
  } catch (e) {}
})();

(function () {
  "use strict";

  /* ---------- Countdown ----------
     <div data-countdown data-days-out="8" data-theme="dark|light"
          data-size="sm|lg" data-variant="minimal|boxed"></div>
     Target = today + daysOut at 19:30 local. Stops at 0. */
  function initCountdowns() {
    document.querySelectorAll("[data-countdown]").forEach(function (el) {
      var out = parseInt(el.getAttribute("data-days-out"), 10);
      if (isNaN(out)) out = 8;
      var theme = el.getAttribute("data-theme") || "dark";
      var size = el.getAttribute("data-size") || "lg";
      var variant = el.getAttribute("data-variant") || "minimal";

      el.classList.add("cd", "cd--" + theme, "cd--" + size);
      if (variant === "boxed") el.classList.add("cd--boxed");

      var cells = [["days", "Tage"], ["hours", "Std"], ["minutes", "Min"], ["seconds", "Sek"]];
      var refs = {};
      cells.forEach(function (c, i) {
        var cell = document.createElement("div");
        cell.className = "cd__cell";
        var num = document.createElement("span");
        num.className = "cd__num";
        num.textContent = "00";
        var lbl = document.createElement("span");
        lbl.className = "cd__lbl";
        lbl.textContent = c[1];
        cell.appendChild(num);
        cell.appendChild(lbl);
        el.appendChild(cell);
        refs[c[0]] = num;
        if (i < cells.length - 1) {
          var sep = document.createElement("span");
          sep.className = "cd__sep";
          sep.textContent = ":";
          el.appendChild(sep);
        }
      });

      var targetAttr = el.getAttribute("data-target");
      var target;
      if (targetAttr) {
        target = new Date(targetAttr).getTime(); // festes Zieldatum (ISO), z.B. 2026-06-28T21:00:00+02:00
      } else {
        var t = new Date();
        t.setDate(t.getDate() + out);
        t.setHours(19, 30, 0, 0);
        target = t.getTime();
      }
      var timer;
      var pad = function (n) { return String(n).padStart(2, "0"); };
      function tick() {
        var diff = Math.max(0, target - Date.now());
        var d = Math.floor(diff / 86400000); diff -= d * 86400000;
        var h = Math.floor(diff / 3600000); diff -= h * 3600000;
        var m = Math.floor(diff / 60000); diff -= m * 60000;
        var s = Math.floor(diff / 1000);
        refs.days.textContent = pad(d);
        refs.hours.textContent = pad(h);
        refs.minutes.textContent = pad(m);
        refs.seconds.textContent = pad(s);
        if (target - Date.now() <= 0 && timer) clearInterval(timer);
      }
      tick();
      timer = setInterval(tick, 1000);
    });
  }

  /* ---------- Signup popup ----------
     Triggers: [data-open-popup]. Popup root: #signup-popup (.popup-overlay).
     Close: [data-close-popup], overlay click, Esc.
     Form submit -> redirect to form's data-redirect (default dankesseite.html). */
  function initPopup() {
    var popup = document.getElementById("signup-popup");
    if (!popup) return;
    var firstInput = popup.querySelector("input");

    function open() {
      popup.classList.add("is-open");
      document.body.classList.add("no-scroll");
      popup.setAttribute("aria-hidden", "false");
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
    }
    function close() {
      popup.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      popup.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-open-popup]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });
    popup.querySelectorAll("[data-close-popup]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); close(); });
    });
    popup.addEventListener("click", function (e) {
      if (e.target === popup) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && popup.classList.contains("is-open")) close();
    });

    var form = popup.querySelector("form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Guard: prevent double-submit (double-click / enter+click race)
        if (form._submitting) return;
        form._submitting = true;
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.style.opacity = "0.65"; }

        var redirect = form.getAttribute("data-redirect") || "/abnehmrevolution/danke";
        // Solange die Aufzeichnung läuft (bis So 28.6.2026 21:00 CEST): Neu-Anmeldungen direkt zur Aufzeichnung.
        try { if (Date.now() < new Date("2026-06-28T21:00:00+02:00").getTime()) redirect = "/abnehmrevolution/aufzeichnung"; } catch (e3) {}
        var ls = function (k) { try { return localStorage.getItem(k) || ""; } catch (e2) { return ""; } };
        var lead = {
          vorname: (form.querySelector('input[name="vorname"]') || {}).value || "",
          email: (form.querySelector('input[name="email"]') || {}).value || "",
          event_id: window._ms_lead_eid || ("lead_" + Date.now()),
          utm_source: ls("ms_utm_source"), utm_medium: ls("ms_utm_medium"),
          utm_campaign: ls("ms_utm_campaign"), utm_content: ls("ms_utm_content"), utm_term: ls("ms_utm_term"),
          fbclid: ls("ms_fbclid"), gclid: ls("ms_gclid"), ttclid: ls("ms_ttclid"),
          ab_test: (window.__AB__ || {}).test || "", ab_variant: (window.__AB__ || {}).variant || ""
        };
        try { if (lead.vorname) localStorage.setItem("ar_vorname", lead.vorname.trim()); } catch (e3) {}
        var done = false;
        var go = function () { if (!done) { done = true; window.location.href = redirect; } };
        // Lead an Kit (Serverless /api/lead) übergeben, dann weiterleiten.
        try {
          fetch("/abnehmrevolution/api/lead/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lead),
            keepalive: true
          }).then(go, go);
        } catch (e2) { go(); }
        setTimeout(go, 2500); // Nutzer nie länger als 2,5s blockieren
      });
    }
  }

  /* ---------- FAQ accordion (exactly one open) ---------- */
  function initFaq() {
    var items = document.querySelectorAll("[data-faq-item]");
    // JS-gesteuerte max-height (zuverlässig, überschreibt base.css max-height:0)
    function setOpen(item, open) {
      item.classList.toggle("open", open);
      var a = item.querySelector(".faq-a");
      if (a) a.style.maxHeight = open ? (a.scrollHeight + "px") : "0px";
      var icon = item.querySelector(".faq-icon");
      if (icon) icon.textContent = open ? "–" : "+";
    }
    items.forEach(function (item) {
      var q = item.querySelector("[data-faq-q]");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var willOpen = !item.classList.contains("open");
        items.forEach(function (other) { setOpen(other, false); });
        if (willOpen) setOpen(item, true);
      });
    });
    // open the first one by default
    if (items.length) setOpen(items[0], true);
  }

  /* ---------- Video facade (click to load YouTube) ----------
     <div class="video-facade" data-video-facade data-embed="https://www.youtube.com/embed/ID">
       <img src="..."><div class="play-btn"></div>
     </div> */
  function initVideoFacades() {
    document.querySelectorAll("[data-video-facade]").forEach(function (el) {
      el.addEventListener("click", function () {
        var src = el.getAttribute("data-embed");
        if (!src) return;
        var sep = src.indexOf("?") === -1 ? "?" : "&";
        var iframe = document.createElement("iframe");
        iframe.src = src + sep + "autoplay=1&rel=0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        el.innerHTML = "";
        el.appendChild(iframe);
        el.style.cursor = "default";
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    initCountdowns();
    initPopup();
    initFaq();
    initVideoFacades();
  });
})();
