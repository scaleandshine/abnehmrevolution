# Build conventions — Abnehmrevolution funnel (READ FULLY before porting)

You are porting ONE `.dc.html` design reference into a **standalone, production static HTML page**.
The `.dc.html` format is NOT production code: the `<x-dc>…</x-dc>` block is plain HTML with inline
styles (derive markup directly from it); `{{ placeholders }}` get their values from the
`class Component extends DCLogic` script at the end of the file (read `renderVals()` / `state` /
`props` defaults and substitute the concrete default value). `support.js` is runtime only — ignore it.

## Project layout
```
abnehmrevolution-funnel/
  index.html            ← Landing (Abnehmrevolution)
  dankesseite.html      ← Danke 1 / Upsell
  dankesseite-2.html    ← Danke 2
  aufzeichnung.html     ← Replay
  intern/dashboard.html ← internal dashboard (paths go up one level: ../css ../js ../assets)
  css/tokens.css        ← design tokens (CSS vars, fonts) — already done
  css/base.css          ← shared components — already done
  js/funnel.js          ← shared runtime — already done
  assets/…              ← all images + assets/fonts/
```

## Every page `<head>` must include (root pages):
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
```
and before `</body>`: `<script src="js/funnel.js" defer></script>`
(For `intern/dashboard.html` use `../css/tokens.css`, `../css/base.css`, `../js/funnel.js`, `../assets/…`.)

Put page-specific layout CSS in a single `<style>` block in `<head>`. Reuse the design tokens
(`var(--ms-…)`) for ALL colors/spacing/radii/shadows — never hardcode hexes that already exist as tokens.

## Shared components — use the data-attribute APIs from js/funnel.js (do NOT reimplement):
- **Countdown:** `<div data-countdown data-days-out="N" data-theme="dark|light" data-size="sm|lg" data-variant="minimal|boxed"></div>` (JS fills it, ticks every 1s, target = today + N days @ 19:30, stops at 0).
- **Video facade:** `<div class="video-facade" data-video-facade data-embed="https://www.youtube.com/embed/VIDEOID"><img src="POSTER" alt=""><div class="play-btn"></div></div>` (click loads the iframe with autoplay).
- **FAQ accordion:** wrap each item in `<div class="faq-item" data-faq-item>` containing `<button class="faq-q" data-faq-q>… <span class="faq-icon">+</span></button>` and `<div class="faq-a"><div class="faq-a__inner">…</div></div>` (one open at a time, first open by default).
- **Primary CTA:** class `cta` (terracotta, pulsing). Variants `cta--lg`, `cta--block`. Always terracotta — never recolor.
- **Downsell link:** class `downsell-link`.
- Helpers already in base.css: `.avail-dot`, `.blink-dot`, `.guarantee-disc` (with `.g-num`/`.g-lbl`), `.progress-track`/`.progress-fill`, `.toast`, `.ms-footer`, `.ms-wrap`, `.ms-wrap-narrow`, `.popup-overlay`/`.popup-card`.

## Routing / CTAs (MUST match exactly)
- **Landing → Danke 1:** every "Jetzt kostenlos anmelden" button gets `data-open-popup`. The popup `<form>` carries `data-redirect="dankesseite.html"`.
- **Danke 1 Kauf-Button:** `<a class="cta" href="https://mamaspagat.tentary.com/p/glow-starterpaket/checkout">…</a>`
- **Danke 1 "Nein danke" downsell:** `<a class="downsell-link" href="dankesseite-2.html">…</a>`
- **Aufzeichnung VIP-Button:** `<a class="cta" href="https://mamaspagat.tentary.com/p/vip-erfolgspaket/checkout">…</a>`
- **Aufzeichnung "Nein danke":** `<a class="downsell-link" href="dankesseite-2.html">…</a>`

## Signup popup markup (Landing page only — append before `</body>`):
```html
<div class="popup-overlay" id="signup-popup" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Zum Workshop anmelden">
  <div class="popup-card">
    <button class="popup-close" data-close-popup aria-label="Schließen">×</button>
    <h3 class="ms-h2" style="margin:0 0 6px;">Sichere dir deinen Platz</h3>
    <p class="ms-body-sm" style="margin:0;color:var(--ms-muted);">Kostenlos & unverbindlich. Nur noch 2 Schritte.</p>
    <form data-redirect="dankesseite.html">
      <div class="popup-field"><label for="pf-name">Vorname</label><input id="pf-name" name="vorname" type="text" required autocomplete="given-name"></div>
      <div class="popup-field"><label for="pf-email">E-Mail-Adresse</label><input id="pf-email" name="email" type="email" required autocomplete="email"></div>
      <button type="submit" class="cta cta--block" style="margin-top:22px;">Jetzt kostenlos anmelden <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </form>
    <p class="ms-caption" style="margin:14px 0 0;text-align:center;">Mit der Anmeldung stimmst du unserer <a href="#" style="color:var(--ms-muted)">Datenschutzerklärung</a> zu.</p>
  </div>
</div>
```

## Fidelity rules
- **Reproduce ALL copy verbatim** (German, incl. umlauts, exact numbers, prices, dates, names). Do not paraphrase, shorten, or invent. Copy every section in the source's order.
- Reproduce every section listed in the source's `<x-dc>` block. Substitute every `{{ }}` with its concrete default.
- Use real `<img src="assets/FILENAME">` for every referenced asset (check exact filenames; they exist in assets/). Add meaningful `alt`.
- **Responsive:** the source used a `viewMode` prop instead of media queries — replace with REAL CSS media queries. Breakpoints: 980px, 760px, 560px, 414px. Multi-column grids collapse to single column on mobile; hero text scales down; nav stacks. Use `clamp()` for big display sizes.
- Animations: keep them subtle (already-defined keyframes in base.css cover pulse/blink/slide-down/fill). No bounces.
- Self-contained: page must render correctly opened directly and when served. No build step, no frameworks.
