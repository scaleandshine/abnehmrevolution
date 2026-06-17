# Mama.Spagat Design System

Brand of **Vanessa Reinthaller** — German wellness & nutrition coach operating as "Mama.Spagat" (literally "Mom on a tightrope / doing the splits"). The brand speaks to busy mothers, especially women 35+, about sustainable weight loss, protein-rich nutrition, sugar-free snacking, and vitality.

## Products & Surfaces

The attached materials (saved HTML + assets from Oxygen-Builder WordPress sites on `mrr.vanessareinthaller.de` and `hello.vanessareinthaller.de`) reveal this product family:

- **Das Kochbuch – Lecker Abnehmen** — 70-recipe diet cookbook (ebook)
- **Die Protein Falle** — free opt-in ebook: "Warum du einfach nicht abnimmst"
- **7 Tage, die alles verändern** — 7-day challenge program for women 35+
- **Zuckerfrei lecker Naschen** — sugar-free snacks & sweets recipe book
- **Inner Shine Protein** — branded "Premium Protein Komplex" powder, 12 flavours (Vanille, Schoko, Dubai, Pistazie, Orange-Maracuja, Pfirsich, Weisser Karamell, Kirsch-Creme, Kokos, Erdbeerjoghurt, Milchreis, Süßes Popcorn …)
- **Vital & Shine** — lifestyle/coaching program
- **Mama.Spagat Links** — a link-in-bio landing page (mamaspagat.tentary.com)

## Sources

Local mounted codebase folders (saved `Webpage, complete` exports from Chrome):
- `7 Tage, die alles verändern – für Frauen 35+_files/`
- `Das Kochbuch - Lecker Abnehmen_files/`
- `Die Protein Falle - Warum du einfach nicht abnimmst_files/`
- `Mama.Spagat - Alle Links auf einen Blick_files/`
- `Zuckerfrei lecker Naschen - Snacks & Süßes ohne Reue_files/`

Assets were extracted into `_raw/` and the key visuals/logos/covers into `assets/`.

---

## Index

- `README.md` — this file (brand overview, content/visual guidelines, iconography)
- `colors_and_type.css` — design tokens (colors, type scale, spacing, radii, shadows)
- `fonts/` — web font files (Playfair Display, Figtree — via Google Fonts imports)
- `assets/` — logos, product covers, lifestyle imagery, icons
- `preview/` — design system preview cards
- `ui_kits/`
  - `ui_kits/sales_page/` — long-form product/sales landing page kit (Kochbuch, Protein-Falle)
  - `ui_kits/link_in_bio/` — link-in-bio page kit (Mama.Spagat Links)
- `SKILL.md` — Agent Skill definition (portable)

### UI kits
- `ui_kits/sales_page/index.html` — long-form product sales page (Kochbuch / Protein Falle pattern)
- `ui_kits/link_in_bio/index.html` — Tentary-style link-in-bio page

---

## CONTENT FUNDAMENTALS

**Language:** German (du-form, informal/warm).

**Voice:** A caring best-friend mentor who has *been there*. Empathetic, direct, encouraging. Speaks mother-to-mother, woman-to-woman. The brand is rooted in Vanessa's own story ("… und wie ich es geschafft habe innerhalb von 80 Tagen 16 kg abzunehmen").

**Pronouns:** "du / dir / dich" always (never "Sie"). "Ich" when Vanessa speaks as the author. "Wir" sparingly, for community moments.

**Casing:**
- Display headlines often use UPPERCASE for impact ("LECKER ABNEHMEN", "DIE PROTEIN FALLE", "INNER SHINE PROTEIN")
- Script/handwritten accent word frequently layered over the main uppercase title ("Das Kochbuch", "Zuckerfrei", "Vital &")
- Body copy in normal German sentence case (nouns capitalized per German rules)
- Small-caps / tracked uppercase for subtitles and badges ("SNACKS & SÜSSES OHNE REUE", "50 REZEPTE", "PREMIUM PROTEIN KOMPLEX")

**Tone examples (real copy from the materials):**
- "Nachhaltig abnehmen ohne Hungern oder Geschmacksverzicht"
- "… mit super leckeren und schnellen Rezepten für deinen natürlich schlanken Körper"
- "Ideal für Menschen, die auf Süßes nicht verzichten wollen, aber den Zucker gerne weglassen möchten"
- "Warum du einfach *nicht* abnimmst" (with the "nicht" underlined for emphasis)
- "Jetzt kostenlos downloaden"

**Copy patterns:**
- Problem → promise → free-gift (lead magnet pattern)
- Numbers as authority anchors ("70 Rezepte", "50 Rezepte", "7 Tage", "16 kg in 80 Tagen", "Top 10 proteinreiche Lebensmittel")
- Parenthetical clarifications: "(pro Portion)", "(für Frauen 35+)"
- Emphasis via underline, not italics
- "Ohne …" pattern ("ohne Hungern", "ohne Reue", "ohne Verzicht")

**Emoji:** Used sparingly and specifically as decorative bullets in long-form ebook content — the product pages show the classic Twemoji set (🎄🐰👍✔️⤵️) inline in bulleted promise lists. Never used in headlines. Think "ebook-friendly check/arrow" not "Gen-Z spam".

---

## VISUAL FOUNDATIONS

**Colors.** *(Confirmed palette, rev. 2026-06.)* Warm, grounded, editorial. Orange leads; sage is the calm counterpoint.
- `--ms-terracotta` `#CA5D25` — the signature burnt-orange for CTAs, badge discs, accent blocks, script text
- `--ms-orange` `#FD6500` — vivid high-energy orange for highlights, hover, attention moments
- `--ms-terracotta-deep` `#A8431B` — pressed / deeper orange in print covers (derived)
- `--ms-sage` `#476160` — sage-teal editorial accent + full-bleed surface
- `--ms-sage-deep` `#3A504F` — deep sage for pressed sage / dark editorial blocks
- `--ms-ink` `#0C1114` — near-black for display type
- `--ms-charcoal` `#1B2020` — body text
- `--ms-muted` `#7A6F63` — secondary text, captions (derived)
- `--ms-cream` `#EFE7DD` — page background, subtitle capsule
- `--ms-blush` `#F7E0D1` — soft warm tint, capsules, low-contrast fills
- `--ms-white` `#FAF7F6` — near-white card surface
- Surface trio (full-bleed section backgrounds): **terracotta `#CA5D25`**, **sage `#476160`**, **cream `#EFE7DD`**

**Typography.** *(Confirmed by Vanessa, 2026-04)*
- **Display serif — TAN AEGEAN**: the elegant condensed serif used on all ebook covers ("LECKER ABNEHMEN", "DIE PROTEIN FALLE", "INNER SHINE PROTEIN"). Heavy use of UPPERCASE, tight leading, signature tall ligatures. Commercial font from TAN — drop license files into `fonts/TAN-AEGEAN/`. **Fallback**: Cormorant Garamond (Google Fonts — closest free match).
- **Sans body — Montserrat**: the full body/UI/caption family. Weights 300–900. Used for paragraphs, buttons, eyebrows, captions, navigation.
- **Script — the "Mama" signature**: a fixed handwritten logo mark, NOT a typeface for running text. It only ever appears as part of the logo (`assets/logo-script*.png`). Do not set body or accent words in a script font.
- **Type rules:** Display is TAN AEGEAN + mostly UPPERCASE; body is Montserrat; script is reserved as accent.

**Spacing.** Generous vertical rhythm. Sections typically 80–120px padding top/bottom on desktop; 48–64px on mobile. 8-pt base unit.

**Backgrounds.**
- Solid `--ms-cream` / `--ms-white` page backgrounds (never pure white)
- Full-bleed lifestyle photography hero sections (kitchen, coffee, wellness, mountains, beach — always warm/natural light)
- Torn-paper / rough-edge overlays across the product covers (the "ripped orange strip" motif on the 7-Tage Challenge)
- Occasional soft watercolor-wash background (Zuckerfrei cover)
- No gradients on UI; no mesh; no AI-ish abstract shapes

**Animation.** Minimal. Fades + slow scale on hero. No bounces, no spring. 250–400ms, `ease-out`. Marketing pages feel like static print, not SaaS.

**Hover states.** CTA buttons darken ~8–12% (terracotta → terracotta-deep). Text links get an underline. Cards lift subtly (translateY(-2px) + shadow).

**Press states.** Slight scale-down (0.98) on primary buttons; color deepens one step.

**Borders.** Hairline (1px) in `--ms-cream` or `--ms-muted @ 20%` on dividers. Badge circles have no border — they're solid terracotta discs.

**Shadows.**
- Soft ambient: `0 2px 8px rgba(31, 26, 21, 0.06)` — cards at rest
- Lifted: `0 12px 32px rgba(31, 26, 21, 0.10)` — hero product images, floating covers
- Print-photo drop shadow: `0 24px 48px rgba(31, 26, 21, 0.18)` — ebook mock-ups

**Capsules vs. gradients.** Badges, subtitle pills, and "freebie" tags are solid-color **capsules** (fully rounded pills or circles — see the orange "70 REZEPTE" disc and the cream "SNACKS & SÜSSES OHNE REUE" pill). No protection gradients, no glass, no blur.

**Layout rules.**
- Sales pages are single-column, mobile-first, centered, max-width ~720–960px for text
- Ebook covers are always shown as **hero objects** — tilted, floating, with heavy shadow
- Fixed elements: sticky purchase CTA bar on long sales pages
- Asymmetric split (~40/60 or 50/50) between portrait + text on about sections

**Transparency & blur.** Almost none in UI. The only transparency is the cream translucent block sitting behind body copy on the ebook covers (so the photo shows through softly) — recreate with `rgba(250, 245, 238, 0.88)` + `backdrop-filter: blur(2px)`.

**Imagery vibe.** Warm, golden-hour, natural. Food photography is moody (dark wood, shallow DOF, slightly under-exposed). Portraits are sun-lit, candid, Alpine/coastal backdrops — never studio. No black & white. No heavy grain. A touch of warmth push.

**Corner radii.**
- `--radius-sm`: 6px (form inputs, small badges)
- `--radius-md`: 14px (cards, buttons)
- `--radius-lg`: 28px (image cards, hero panels)
- `--radius-pill`: 999px (subtitle capsules, CTA pills, badge circles)

**Cards.** Bone/warm-white fill, no border, ambient shadow, `--radius-lg` corners, generous inner padding (28–40px).

---

## ICONOGRAPHY

**Approach.** Minimal and utility-first. The brand itself is not icon-heavy — it leans on **photography** and **typography** to carry meaning. When icons appear they are one of:

1. **Twemoji (Twitter/Tentary set)**: the Tentary link-in-bio page (`mamaspagat.tentary.com`) and the Kochbuch sales page render emoji via Twemoji PNG assets. We found these in the Kochbuch bundle: `1f384.png` (🎄), `1f430.png` (🐰), `1f44d.png` (👍), `2714-fe0f.png` (✔️), `2935-fe0f.png` (⤵️). Copied into `assets/emoji/`. Used as bullet-style decorators inside ebook body copy and on the link-in-bio item rows.

2. **Lucide** (CDN fallback) — for any UI chrome not present in the source (chevrons, play, download, share). Lucide's 1.5px round-stroke line style is the closest match for the brand's quiet aesthetic. **Flagged substitution**: the original sites don't ship a dedicated icon font; we use Lucide for UI icons when building mocks.

3. **Hand-placed SVG glyphs** for the download/arrow treatments you see on the Protein-Falle opt-in ("⤵ JETZT KOSTENLOS DOWNLOADEN" with a hand-drawn sage-green arrow). These are decorative illustrations baked into hero photos, not a reusable icon set.

**Rules for new designs:**
- Prefer a **photograph** or a **number** over an icon whenever possible
- If you need a UI icon, use Lucide at stroke 1.75, `currentColor`
- If you need a bullet decorator in long-form copy, use a Twemoji PNG from `assets/emoji/`
- **Never** invent SVG illustrations — use real photography (placeholder or real asset) instead
## LOGO & BRAND ELEMENTS *(official Brand Kit)*

- **Signature wordmark** — handwritten "Mama" over letterspaced "SPAGAT".
  - `assets/logo-script.png` — dark teal, for light surfaces (cream / white / blush)
  - `assets/logo-script-light.png` — cream, for dark surfaces (ink / sage / terracotta)
- **Verified badge** — `assets/verified-badge.png`. The blue check is a deliberate brand element signalling authenticity & trust; pair it with the "mama.spagat ✓" handle lockup in headers/footers.
- **Avatar** — `assets/vanessa-avatar.png` (branded round badge on terracotta) for small circular avatars.
- **Fonts** — display **TAN AEGEAN** (installed, `fonts/TAN-AEGEAN/`), body **Montserrat**.

## VANESSA — APPROVED PHOTOGRAPHY (use exclusively)

Only these images may be used to depict Vanessa. Do not use stock, AI, or placeholder portraits for her.
- `assets/vanessa-avatar.png` — branded round badge (terracotta bg, cream ring). Logo avatar + all **small circular avatars** (header, chips, bio, chat).
- `assets/vanessa-portrait.png` — sunset selfie. Large editorial portraits (intimate story moments).
- `assets/vanessa-essen.jpg` — Mediterranean kitchen portrait with food. Primary **hero / about / video** editorial.
- `assets/protein/lifestyle-vanessa.png` — Vanessa preparing Inner Shine Protein (in-kitchen product shot).

## PRODUCT IMAGERY

- **Covers**: `assets/lecker-abnehmen-square.png` & `-cover.png` (Kochbuch), `assets/21-tage-cover.png`, `assets/protein-falle-cover.png`, `assets/alltagsguide-cover.png`.
- **Inner Shine Protein** (12 flavours + lifestyle/pack shots): `assets/protein/` — e.g. `vanille`, `schoko`, `dubai`, `pistazie`, `orange-maracuja`, `saftiger-pfirsich`, `weisser-karamell`, `kirsch-creme`, `kokos`, `erdbeerjoghurt`, `milchreis`, plus `2er-pack-shaker`, `neutral`, `lifestyle-shaker`, `mit-joghurt`. All are square (1:1) lifestyle compositions — use `object-fit: cover`.

---

## FONTS — STATUS

- ✅ **Montserrat** — loaded from Google Fonts (free, complete)
- ⚠️ **TAN AEGEAN** — commercial font, not bundled. Upload `.woff2` / `.otf` to `fonts/TAN-AEGEAN/` to activate. Falls back to Cormorant Garamond otherwise.
- ✅ **Pinyon Script** (optional accent) — Google Fonts.
