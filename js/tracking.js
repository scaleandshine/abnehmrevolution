/* =============================================================
   Mama.Spagat — "Die Abnehmrevolution" — Tracking layer
   Reuses the shared Mama-Spagat stack:
     - PostHog EU (project 174473) — public key is a browser-side token
     - Meta Pixel 691498019877496
   All events carry super-property funnel:"abnehmrevolution" so they
   stay distinguishable from the other funnels in the same PostHog.

   Phase 1 = client-side only (PageView / Lead / InitiateCheckout).
   Server-side CAPI + Tentary purchase bridge = Phase 2.
   ============================================================= */
(function () {
  "use strict";

  var CFG = {
    POSTHOG_KEY: "phc_rjxg7eY6YVADiyY4yBWWGn6dAGxnR9kjKfovzpxBcpCk", // public browser token
    POSTHOG_HOST: "https://eu.i.posthog.com",
    PIXEL_ID: "691498019877496",
    FUNNEL: "abnehmrevolution",
  };

  // ---- UTM + internal-traffic capture ----
  function captureSuperProps() {
    var qs = new URLSearchParams(location.search);
    var utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      var v = qs.get(k);
      if (v) { utm[k] = v; localStorage.setItem("ms_" + k, v); }
      else { var s = localStorage.getItem("ms_" + k); if (s) utm[k] = s; }
    });
    if (qs.get("internal") === "1") localStorage.setItem("ms_internal", "true");
    var props = Object.assign({ funnel: CFG.FUNNEL }, utm);
    props.internal_user = localStorage.getItem("ms_internal") === "true" ? "true" : "false";
    return props;
  }
  var SUPER = captureSuperProps();

  // ---- Init (PostHog + Meta Pixel). Läuft ERST nach Einwilligung (DSGVO). ----
  var STARTED = false;
  function startTracking() {
    if (STARTED) return;
    STARTED = true;

    // PostHog snippet, init mit manuellem Pageview nach Super-Props
    (function (h, o) {
      h.posthog = h.posthog || [];
      if (h.posthog.__loaded) return;
      (function () {
        var s = o.createElement("script");
        s.type = "text/javascript"; s.async = true;
        s.src = CFG.POSTHOG_HOST + "/static/array.js";
        var f = o.getElementsByTagName("script")[0]; f.parentNode.insertBefore(s, f);
      })();
      h.posthog = h.posthog || [];
      var stub = "init capture identify register register_once people.set people.set_once reset group alias".split(" ");
      stub.forEach(function (m) {
        var parts = m.split(".");
        h.posthog[parts[0]] = h.posthog[parts[0]] || function () {
          (h.posthog._q = h.posthog._q || []).push([m].concat([].slice.call(arguments)));
        };
      });
    })(window, document);

    try {
      window.posthog.init(CFG.POSTHOG_KEY, {
        api_host: CFG.POSTHOG_HOST,
        capture_pageview: false,
        person_profiles: "identified_only",
        loaded: function (ph) {
          ph.register(SUPER);
          ph.capture("$pageview");
          // Page-specific ViewContent (fires once per page when consent/tracking starts)
          (function () {
            var path = location.pathname;
            var map = {
              "/danke": { ph: "page_view_danke", px: "ViewContent", p: { content_name: "danke_glow_upsell", content_category: "upsell" } },
              "/bestaetigung": { ph: "page_view_bestaetigung", px: "ViewContent", p: { content_name: "bestaetigung", content_category: "confirmation" } },
              "/aufzeichnung": { ph: "page_view_aufzeichnung", px: "ViewContent", p: { content_name: "aufzeichnung_vip", content_category: "replay" } },
            };
            Object.keys(map).forEach(function (k) {
              if (path.indexOf(k) !== -1) {
                var e = map[k];
                track(e.ph, e.px, Object.assign({ funnel: CFG.FUNNEL }, e.p));
              }
            });
          })();
        },
      });
    } catch (e) {}

    // Meta Pixel
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    try {
      window.fbq("init", CFG.PIXEL_ID);
      window.fbq("track", "PageView");
    } catch (e) {}
  }
  // consent.js ruft das auf; bei bereits erteilter Einwilligung sofort starten.
  window.msStartTracking = startTracking;
  if (localStorage.getItem("ms_consent") === "granted") startTracking();

  // ---- Unified track helper ----
  // posthogEvent: snake_case; pixelEvent: Meta standard event name (or null)
  // eventID: optional string for Meta CAPI deduplication ({eventID} 4th fbq arg)
  function track(posthogEvent, pixelEvent, props, eventID) {
    props = props || {};
    try { if (window.posthog && window.posthog.capture) window.posthog.capture(posthogEvent, props); } catch (e) {}
    try {
      if (pixelEvent && window.fbq) {
        if (eventID) window.fbq("track", pixelEvent, props, { eventID: eventID });
        else window.fbq("track", pixelEvent, props);
      }
    } catch (e) {}
  }
  window.msTrack = track;

  // ---- Auto-wire funnel events ----
  function product(href) {
    if (!href) return undefined;
    if (href.indexOf("glow-starterpaket") !== -1) return "glow_starterpaket";
    if (href.indexOf("vip-erfolgspaket") !== -1) return "vip_erfolgspaket";
    return undefined;
  }

  function wire() {
    // Opt-in form (landing popup) — fire BEFORE funnel.js redirects (capture phase)
    var form = document.querySelector("#signup-popup form");
    if (form) {
      form.addEventListener("submit", function () {
        var emailEl = form.querySelector('input[name="email"]');
        var emailVal = emailEl ? emailEl.value.trim() : "";
        // Generate event_id for CAPI deduplication — funnel.js reads window._ms_lead_eid
        var eid = "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
        window._ms_lead_eid = eid;
        track("optin_submitted", "Lead", { funnel: CFG.FUNNEL }, eid);
        // Identify in PostHog so person profile gets created + cross-session continuity
        if (emailVal) {
          try { if (window.posthog && window.posthog.identify) window.posthog.identify(emailVal, { email: emailVal, funnel: CFG.FUNNEL }); } catch (e) {}
        }
      }, true);
    }
    // Any "anmelden" trigger opening the popup
    document.querySelectorAll("[data-open-popup]").forEach(function (b) {
      b.addEventListener("click", function () { track("optin_intent", null, {}); });
    });
    // Checkout CTAs (Tentary) — ALL <a> with tentary href regardless of CSS class
    document.querySelectorAll('a[href*="tentary.com"]').forEach(function (a) {
      a.addEventListener("click", function () {
        var p = product(a.getAttribute("href"));
        track("checkout_click", "InitiateCheckout", { product: p, funnel: CFG.FUNNEL });
      });
    });
    // Downsell links
    document.querySelectorAll('a.downsell-link').forEach(function (a) {
      a.addEventListener("click", function () { track("downsell_click", null, {}); });
    });
    // Video facades -> ViewContent on first play
    document.querySelectorAll("[data-video-facade]").forEach(function (el) {
      el.addEventListener("click", function () {
        track("video_play", "ViewContent", { content_name: "vsl_" + (document.title || "").slice(0, 40) });
      }, { once: true });
    });
    // Scroll-depth milestones: 25 / 50 / 75 / 90 %
    (function () {
      var fired = {};
      function check() {
        var doc = document.documentElement;
        var pct = Math.round((doc.scrollTop + window.innerHeight) / doc.scrollHeight * 100);
        [25, 50, 75, 90].forEach(function (m) {
          if (pct >= m && !fired[m]) { fired[m] = true; track("scroll_depth", null, { depth: m, page: location.pathname, funnel: CFG.FUNNEL }); }
        });
      }
      window.addEventListener("scroll", check, { passive: true });
    })();
  }

  if (document.readyState !== "loading") wire();
  else document.addEventListener("DOMContentLoaded", wire);
})();
