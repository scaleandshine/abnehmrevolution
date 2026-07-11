/* =============================================================
   Mama.Spagat — Cookie/Tracking-Consent (DSGVO/TTDSG)
   Privacy-preserving Default: KEIN Marketing-/Statistik-Tracking
   bis zur ausdrücklichen Einwilligung. "Nur notwendige" lehnt ab.
   Bei "Alle akzeptieren" → window.msStartTracking() (Pixel + PostHog).
   Auswahl in localStorage 'ms_consent' = granted|denied.
   ============================================================= */
(function () {
  "use strict";
  var KEY = "ms_consent";
  var existing = localStorage.getItem(KEY);

  // Bereits entschieden? Dann kein Banner. (tracking.js startet selbst bei 'granted'.)
  if (existing === "granted" || existing === "denied") return;

  var css =
    ".ms-consent{position:fixed;left:0;right:0;bottom:0;z-index:1100;display:flex;justify-content:center;padding:16px;}" +
    ".ms-consent__card{width:100%;max-width:780px;background:var(--ms-white,#FAF7F6);border:1px solid var(--ms-border-strong,rgba(12,17,20,.18));border-radius:16px;box-shadow:0 12px 32px rgba(31,26,21,.18);padding:20px 22px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;font-family:var(--ms-font-body,system-ui,sans-serif);}" +
    ".ms-consent__txt{flex:1;min-width:240px;font-size:13.5px;line-height:1.6;color:var(--ms-charcoal,#1B2020);}" +
    ".ms-consent__txt a{color:var(--ms-terracotta,#CA5D25);}" +
    ".ms-consent__btns{display:flex;gap:10px;flex-wrap:wrap;}" +
    ".ms-consent__btn{border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:14px;padding:13px 22px;border-radius:12px;letter-spacing:.02em;}" +
    ".ms-consent__btn--accept{background:var(--ms-terracotta,#CA5D25);color:var(--ms-white,#FAF7F6);}" +
    ".ms-consent__btn--accept:hover{background:var(--ms-terracotta-deep,#A8431B);}" +
    ".ms-consent__btn--decline{background:transparent;color:var(--ms-charcoal,#1B2020);border:1.5px solid var(--ms-border-strong,rgba(12,17,20,.25));}" +
    ".ms-consent__btn--decline:hover{background:rgba(12,17,20,.05);}" +
    "@media(max-width:560px){.ms-consent__btns{width:100%}.ms-consent__btn{flex:1}}";

  function decide(value) {
    localStorage.setItem(KEY, value);
    if (value === "granted" && typeof window.msStartTracking === "function") {
      window.msStartTracking();
    }
    var el = document.getElementById("ms-consent");
    if (el) el.parentNode.removeChild(el);
  }

  function render() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.className = "ms-consent";
    wrap.id = "ms-consent";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Cookie-Einwilligung");
    wrap.innerHTML =
      '<div class="ms-consent__card">' +
        '<div class="ms-consent__txt">Wir verwenden Cookies &amp; Tracking-Technologien (Meta Pixel, PostHog), um diese Seite zu verbessern und unsere Werbung zu messen. Mit „Alle akzeptieren“ stimmst du dem zu. Mehr in der <a href="https://shop.vanessareinthaller.de/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</div>' +
        '<div class="ms-consent__btns">' +
          '<button class="ms-consent__btn ms-consent__btn--decline" type="button" id="ms-consent-decline">Nur notwendige</button>' +
          '<button class="ms-consent__btn ms-consent__btn--accept" type="button" id="ms-consent-accept">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    document.getElementById("ms-consent-accept").addEventListener("click", function () { decide("granted"); });
    document.getElementById("ms-consent-decline").addEventListener("click", function () { decide("denied"); });
  }

  // Erlaubt späteres Öffnen (z.B. Footer-Link "Cookie-Einstellungen")
  window.msOpenConsent = function () { localStorage.removeItem(KEY); if (!document.getElementById("ms-consent")) render(); };

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
