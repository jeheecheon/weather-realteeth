---
version: alpha
name: weather-realteeth
---

# 1. weather-realteeth Design System.

Design specification for a Korean weather web app: current temperature, daily high/low, hourly forecast, district search (시 / 군 / 구 / 동), and favorited locations (card grid, max 6). Single light theme. Palette, type, and component approach adapted from the REALTEETH product (app.realteeth.ai) and re-pointed at a weather domain.

## 1.1. Purpose.

Define design tokens, primitive UI components, and authoring rules. Feature-level compositions (favorite cards, search results, the hourly-forecast strip, the detail page, navigation chrome) live with their owning feature, not in this document. Reference product: REALTEETH (token source). Reference domain: standard weather apps (current + hourly + daily, location search, favorites).

## 1.2. PRD Scope.

Aspects of the PRD (`docs/PRD.md`) that constrain this design system.

| Requirement  | Spec                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Locations    | Korean administrative districts (시 / 군 / 구 / 동) from `docs/korea_districts.json`; searched and favorited |
| Weather data | Current temp, daily low, daily high, hourly temps — temperature is the primary rendered value (§ 3.2.4.)     |
| Favorites    | Card UI, max 6 places, editable alias, click-through to a detail page                                        |
| Language     | Korean only; Latin numerals for all temperatures and times. Type scale tuned for Hangul directly (§ 3.2.2.)  |
| Theme        | Light only — no dark mode, no day/night theme swap (§ 4.1.)                                                  |

## 1.3. Glossary.

| Term           | Definition                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------- |
| Roboto         | Open-source Latin sans-serif; primary UI typeface (§ 3.2.1.)                                        |
| Noto Sans KR   | Open-source Korean sans-serif; Hangul companion to Roboto (§ 3.2.1.)                                |
| Hangul         | Korean writing system; syllabic blocks                                                              |
| Jamo (자모)    | Component letter of a Hangul syllable                                                               |
| Myungjo (명조) | Korean serif typeface; reads as old-print / funerary — forbidden (§ 3.2.1.)                         |
| FOIT           | Flash of Invisible Text during font load                                                            |
| FOUT           | Flash of Unstyled Text during font load                                                             |
| WCAG AA        | Accessibility standard: 4.5:1 contrast for body text, 3:1 for large text and UI components          |
| SSR            | Server-Side Rendering: HTML produced server-side before the browser receives it                     |
| Tailwind v4    | Utility-first CSS framework configured CSS-first via `@theme`; declarations auto-generate utilities |
| shadcn         | Component registry providing primitive UI scaffolds installed via CLI                               |
| lucide         | Open-source SVG icon set; default icon source, including weather glyphs (§ 5.7.)                    |
| Sky Teal       | Project name for the `primary` accent; #00a4c5 (§ 3.1.1.)                                           |
| Slate          | Project name for the cool, blue-tinted neutral ramp used for surfaces and text (§ 3.1.2.)           |

# 2. Design Lineage.

The system lifts REALTEETH's token architecture (a clinical teal accent over a cool slate neutral ramp) and re-points it at weather, where "sky teal + atmospheric slate" reads as a native palette rather than a borrowed one.

## 2.1. Adopted from REALTEETH.

| Pattern                                            | Reason                                                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Single teal accent (#00a4c5) as the only brand hue | Sky/atmosphere register; one accent keeps a data-dense weather UI calm                                    |
| Cool slate neutral ramp (blue-tinted grays)        | Reads as sky/haze, not warm paper; sits naturally under a teal accent                                     |
| Roboto + Noto Sans KR type pairing                 | Matches the source product; clean Latin numerals for temperatures, solid Hangul for Korean district names |
| 6–8px control radius, pill for chips               | Source product's geometry; sober, utilitarian, not consumer-marketplace                                   |
| Hairline-as-elevation, flat by default             | Source product ships mostly flat with 1px borders; shadows reserved for designated roles (§ 3.5.)         |
| Mono numerics for tabular values                   | Temperatures, times, and counts anchor to a tabular mono register (§ 3.2.4.)                              |

## 2.2. Adapted / Rejected for weather.

| Decision                            | Reason                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Dark mode dropped                   | Source app is light-only; weather app ships a single light theme (§ 4.1.)                                    |
| Day/night theme swap rejected       | No canvas/accent shift by time-of-day; one static light theme regardless of the rendered forecast time       |
| Temperature color scale rejected    | No cold→hot gradient ramp; temperature is read from tabular mono numerals, never encoded as hue (§ 3.2.4.)   |
| Per-condition color coding rejected | Clear / cloud / rain / snow distinguished by neutral icon only, never by a dedicated hue (§ 5.7.)            |
| Category-tint system removed        | Source had a multi-hue tag palette for a different domain; weather needs no categorical tag hues             |
| Single accent enforced              | No second accent is introduced for temperature, condition, or alerts — severe-weather states reuse semantics |

# 3. Tokens.

## 3.1. Color.

Color tokens live in the `@theme` block of `src/app/styles/globals.css`. Each `--color-{token}` auto-generates Tailwind utilities `bg-{token}`, `text-{token}`, `border-{token}`, `ring-{token}`, etc. There is a single light theme — tokens are not rebound for dark (§ 4.1.).

### 3.1.1. Primary — Sky Teal.

The only brand accent. Reserved for primary CTAs, links, focus rings, and the active-navigation marker; never for selection toggles or stateful indicators (use `ink` — § 6.).

| Token              | Hex     | Use                                                                         |
| ------------------ | ------- | --------------------------------------------------------------------------- |
| `primary`          | #00a4c5 | Sky Teal. Primary CTAs, links, focus rings (REALTEETH Blue-900)             |
| `primary-hover`    | #0097b5 | `:hover` on `primary` CTA / link (≈ 8% darken)                              |
| `primary-pressed`  | #008aa5 | `:active` (held-down) on `primary` CTA / link (≈ 16% darken)                |
| `primary-disabled` | #c6e6ed | Disabled CTA (REALTEETH Blue-300)                                           |
| `primary-soft`     | #eaf5f6 | Subtle tinted fill — selected hour cell, active location chip bg (Blue-100) |
| `on-primary`       | #ffffff | Text/icon on Sky Teal                                                       |

`on-primary` is #ffffff to match the source product's CTA. White on `primary` is ≈ 2.95:1 — below WCAG AA, and below even the 3:1 large-text / UI floor; it is accepted to preserve the source brand teal (§ 7.). Use it only for button-sized labels on a solid `primary` fill; never for small or secondary text on `primary`, and never as a load-bearing contrast pair.

Hover/pressed darken (not lighten) `primary`: pointer-down must read as "press". Two-step darken matches Material density (≈ 8% then 16%).

### 3.1.2. Neutral — Slate.

A cool, blue-tinted neutral ramp (REALTEETH Navy). Carries every surface and every text color. Replaces any warm-gray neutral.

| Token             | Hex     | Use                                                                                           |
| ----------------- | ------- | --------------------------------------------------------------------------------------------- |
| `canvas`          | #ffffff | Component floor — cards, inputs, page content surfaces (§ 3.1.4.)                             |
| `page`            | #f4f8fb | App shell / page backdrop behind content (REALTEETH Navy-100)                                 |
| `surface-soft`    | #f4f8fb | Default raised fill for chip-style controls and static raised regions                         |
| `surface-strong`  | #edf2f6 | `:hover` escalation for `surface-soft`-rest controls; disabled-input fill                     |
| `surface-pressed` | #e3eaef | `:active` (held-down) escalation; ladder ceiling                                              |
| `hairline`        | #dfe6eb | Default 1px border (REALTEETH Navy-200 — the source product's border color)                   |
| `hairline-soft`   | #eef2f5 | Long-scroll dividers                                                                          |
| `hairline-strong` | #c7d1d8 | Input outlines (REALTEETH Navy-300)                                                           |
| `ink`             | #202c33 | Headlines, primary text, active selection markers — e.g. `chip-selected` (REALTEETH Navy-900) |
| `body`            | #4c606a | Long-form reading text (REALTEETH Navy-800)                                                   |
| `meta`            | #778d98 | Secondary text, timestamps, captions (REALTEETH Navy-600)                                     |
| `meta-soft`       | #92a5af | Disabled-text, placeholders, lowest-emphasis labels (REALTEETH Navy-500)                      |
| `on-ink`          | #ffffff | Text on `ink` fill (e.g. `chip-selected`)                                                     |
| `scrim`           | #000000 | Modal overlay base; opacity applied at usage site — `bg-scrim/50` (§ 3.5.)                    |

The token name is `meta`, not `muted`, to avoid colliding with shadcn's `--color-muted` (a _subtle surface_, not a text color). shadcn-style `bg-muted` maps to the `surface-soft` alias.

`ink` = #202c33 (a deep slate, not pure black) so Hangul stroke density does not read heavier than surrounding Latin.

### 3.1.3. Semantic.

Brand-derived status tokens. Each has a `-soft` fill companion for badges/banners. Text variants are tuned toward WCAG AA on `canvas`; `-soft` fills carry their status text or icon.

| Token                   | Hex     | Role                                                              |
| ----------------------- | ------- | ----------------------------------------------------------------- |
| `semantic-success`      | #2f9e44 | Success text / icon (favorite added, valid input)                 |
| `semantic-success-soft` | #e7f2e4 | Success fill (REALTEETH Green-200)                                |
| `semantic-warning`      | #ccac00 | Warning accent / icon / border (REALTEETH Yellow-950)             |
| `semantic-warning-soft` | #fff7cc | Warning banner fill (REALTEETH Yellow-100)                        |
| `semantic-warning-text` | #8a7300 | Warning text on `canvas` at body size (AA-tuned dark gold)        |
| `semantic-error`        | #c24a4a | Error text / icon (REALTEETH Red-950)                             |
| `semantic-error-soft`   | #fcdede | Error fill (REALTEETH Red-100)                                    |
| `semantic-error-strong` | #f25c5c | Error emphasis — destructive hover, alert dot (REALTEETH Red-900) |

`semantic-warning` (#ccac00) is for icons, borders, and large/bold labels; for body-size (< 14px) warning text on `canvas`, use `semantic-warning-text` (#8a7300) to clear AA. `aria-invalid="true"` is the canonical error trigger (§ 5.2.2.).

No status hue is promoted to a second brand accent — severe-weather and alert states reuse `semantic-warning` / `semantic-error` only (§ 6.2.).

### 3.1.4. Surface Ladder Semantics.

The surface ladder is closed at four tiers. Each tier maps to one role; mixing roles across tiers is forbidden.

| Tier              | Hex     | Role                                                                                                | Example                                                                               |
| ----------------- | ------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `canvas`          | #ffffff | Component floor. Resting fill for components that sit directly on the page.                         | sidebar panel & hourly-card body, `text-input` rest, `button-secondary` rest          |
| `surface-soft`    | #f4f8fb | Default raised surface. Resting fill for chip-style controls and static raised regions.             | `icon-button-circle` rest, `search-input` rest, favorite cell rest                    |
| `surface-strong`  | #edf2f6 | `:hover` escalation for chip-style controls. Static fixed-emphasis fill with no further escalation. | `icon-button-circle` hover, `search-input` hover, favorite cell hover, skeleton block |
| `surface-pressed` | #e3eaef | `:active` (held-down) escalation. Ladder ceiling.                                                   | `icon-button-circle` active, `button-ghost` active                                    |

| Rule                                                                                                             | Reason                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Interactive component rest fills MUST start at `canvas` or `surface-soft` — never `surface-strong`/`-pressed`.   | A chip starting at `surface-strong` has no `:hover` headroom; one at `surface-pressed` has none at all. |
| `surface-strong` may be a static base ONLY for a non-interactive element nested inside a non-`canvas` container. | Stacked depth is conveyed by tier delta, not by promoting interactive controls to the ceiling.          |
| `surface-pressed` is reserved for `:active`; it MUST NOT be any component's resting fill.                        | The ladder must terminate; promoting any rest above it breaks the interaction model.                    |
| No fifth tier is added. Further escalation uses `ring-1 ring-inset` or `scale-[0.98]`, not surface tone.         | Each new tier reproduces the same endpoint problem one step higher.                                     |

`page` (#f4f8fb) shares the `surface-soft` value: the app shell tints the backdrop so white `canvas` cards read as raised against it without a shadow.

## 3.2. Typography.

### 3.2.1. Font Family.

```
'Roboto Variable', 'Noto Sans KR Variable', system-ui, -apple-system, BlinkMacSystemFont,
'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif
```

Mono (numerics only — temperatures, times, counts):

```
'Roboto Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace
```

| Decision                       | Reason                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Roboto + Noto Sans KR pairing  | Matches the source product; Roboto gives clean tabular-friendly Latin numerals, Noto Sans KR covers Hangul   |
| Mono restricted to numerics    | Hangul in monospace breaks compositional rhythm; mono is for Latin numerals/times only (§ 3.2.4.)            |
| No serif anywhere              | Korean serif (myungjo) reads as old-print / funerary; serif/sans contrast does not register on Hangul blocks |
| `font-display: swap` mandatory | FOUT acceptable; FOIT blocks time-sensitive weather scanning                                                 |

### 3.2.2. Hierarchy.

Each `--text-{token}` (with companion `--line-height`, `--letter-spacing`, `--font-weight`) generates one Tailwind utility (`text-display-xl`, `text-body-md`, …) bundling all four. Korean-only — values below are tuned for Hangul directly; there is no English baseline and no per-locale override layer. Weight ladder is 400 / 500 / 700 only (§ 3.2.5.).

| Token        | Size (px) | Weight | Line-height | Letter-spacing (px) | Use                                              |
| ------------ | --------- | ------ | ----------- | ------------------- | ------------------------------------------------ |
| `display-xl` | 32        | 700    | 1.30        | 0                   | Page `<h1>` (e.g. location name on detail)       |
| `display-lg` | 26        | 700    | 1.35        | 0                   | Section heading                                  |
| `display-md` | 20        | 700    | 1.40        | 0                   | Sub-section / featured heading                   |
| `display-sm` | 18        | 700    | 1.45        | 0                   | Card-style title / default heading               |
| `title-md`   | 16        | 500    | 1.45        | 0                   | Strong inline labels (location, 현재, 최저/최고) |
| `title-sm`   | 14        | 500    | 1.45        | 0                   | Tertiary headings, list-section labels           |
| `body-lg`    | 18        | 400    | 1.65        | 0                   | Long-form reading body (rare)                    |
| `body-md`    | 16        | 400    | 1.60        | 0                   | Default body                                     |
| `body-sm`    | 14        | 400    | 1.55        | 0                   | Secondary copy                                   |
| `caption`    | 13        | 400    | 1.40        | 0                   | Captions, helper text                            |
| `micro`      | 11        | 700    | 1.30        | 0.4                 | Tag / badge text                                 |
| `button-md`  | 15        | 500    | 1.25        | 0                   | Default button label                             |
| `button-sm`  | 14        | 500    | 1.25        | 0                   | Pill / chip label                                |
| `nav-md`     | 16        | 500    | 1.30        | 0                   | Primary navigation label                         |
| `nav-sm`     | 14        | 400    | 1.35        | 0                   | Secondary / sub-nav label                        |

Numeric/temperature tokens are defined separately in § 3.2.3.

### 3.2.3. Numeric Hierarchy (Temperature & Time).

Mono, tabular numerals (`font-variant-numeric: tabular-nums`). Temperature is the primary rendered value, so it gets its own scale. Latin numerals only — never wrap Hangul in these (§ 3.2.5.).

| Token       | Size (px) | Weight | Line-height | Letter-spacing (px) | Use                                     |
| ----------- | --------- | ------ | ----------- | ------------------- | --------------------------------------- |
| `temp-hero` | 64        | 400    | 1.00        | -1                  | Current temperature, detail-page hero   |
| `temp-lg`   | 32        | 500    | 1.05        | -0.5                | Favorite-card current temperature       |
| `temp-md`   | 20        | 500    | 1.10        | 0                   | Hourly-strip / row temperature          |
| `temp-sm`   | 15        | 500    | 1.20        | 0.2                 | Inline high/low pair, secondary metrics |
| `num-mono`  | 12        | 500    | 1.40        | 0.2                 | Timestamps, hour labels, counts         |

### 3.2.4. Numeric Rules.

| Rule                                                | Reason                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| All temperatures use a `temp-*` mono token          | Temperature is read by magnitude from tabular numerals, never inferred from hue    |
| Times, hour labels, and counts use `num-mono`       | Tabular alignment keeps the hourly strip and detail rows visually stable           |
| Never color-encode temperature                      | No cold→hot scale; a hot 33° and cold -5° share the same `ink`/`meta` text color   |
| Degree glyph and unit travel with the numeral token | `33°` is one typographic unit; do not split the unit into a smaller separate style |

### 3.2.5. Rules.

| Rule                                                   | Reason                                                                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Negative letter-spacing on numeric (Latin) tokens only | Hangul jamo collide visually at negative tracking; Hangul-bearing tokens never go negative (`micro` uses slight positive +0.4) |
| Hangul leading is baked into the scale                 | Display/title/body line-heights already account for the Hangul full-block glyph (§ 3.2.2.)                                     |
| Weight ladder = 400 / 500 / 700 only                   | 300 too thin for Hangul small sizes; 800+ becomes black squares; no 600 in use                                                 |
| No Hangul in any `temp-*` / `num-mono`                 | Monospace breaks Hangul rhythm; numeric tokens are Latin-only                                                                  |

## 3.3. Spacing.

Base unit 4px. Tokens: `2xs=4 xs=8 sm=12 md=16 lg=24 xl=32 2xl=48 section=64`. Each generates `p-*`, `m-*`, `gap-*`, `space-*` utilities (e.g. `p-md` = 16px, `gap-lg` = 24px, `mt-xl` = 32px).

Favorite-card grids and the hourly strip use `gap-md` (16px); page sections use `section` (64px) vertical rhythm.

## 3.4. Radius.

Tokens generate `rounded-{token}` utilities. `rounded-none` and `rounded-full` are Tailwind built-ins.

| Token  | px   | Use                                                    |
| ------ | ---- | ------------------------------------------------------ |
| `none` | 0    | Reserved                                               |
| `xs`   | 4    | Tag / badge                                            |
| `sm`   | 6    | Small controls (matches source product)                |
| `md`   | 8    | Buttons, inputs, favorite cells (default — source app) |
| `lg`   | 12   | Containers, sidebar panel                              |
| `xl`   | 16   | Modals, featured surfaces                              |
| `full` | 9999 | Pills, search input, icon button, status pill          |

`md` (8px) is the default control radius (source product's `--radius: .5rem`); the sidebar panel steps up to `lg` (12px) as a container, and the favorite cells nested inside step back down to `md` — 4px-step nesting in each direction.

## 3.5. Elevation.

Shadow tokens `--shadow-raised`, `--shadow-hover`, `--shadow-floating` (utilities `shadow-raised`, `shadow-hover`, `shadow-floating`). Hairline (flat) is the default; explicit shadows are opt-in for the roles below. Single light theme — no dark-mode shadow substitution.

| Level              | Value                                                         | Tailwind                 |
| ------------------ | ------------------------------------------------------------- | ------------------------ |
| 0 (flat)           | 1px `hairline` border                                         | `border border-hairline` |
| 1 (raised, rest)   | `0 1px 2px rgb(0 0 0 / 0.04), 0 2px 6px rgb(0 0 0 / 0.05)`    | `shadow-raised`          |
| 2 (hover)          | `0 2px 6px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.08)`   | `hover:shadow-hover`     |
| 3 (floating, rest) | `0 4px 10px rgb(0 0 0 / 0.06), 0 12px 24px rgb(0 0 0 / 0.10)` | `shadow-floating`        |
| Modal scrim        | `scrim` at 50% opacity                                        | `bg-scrim/50`            |

| Role              | Use                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadow-raised`   | Resting fill for content containers sitting above `page` without overlaying other content — the sidebar panel and the hourly-forecast card. |
| `shadow-hover`    | `:hover` escalation on raised interactive surfaces. Composes over rest shadow.                                                              |
| `shadow-floating` | Resting fill for overlay surfaces — the district search-results dropdown, popovers, menus (§ 5.3.).                                         |

`raised < hover < floating` (monotonic depth): hover must read deeper than a raised card's rest or pointer feedback is lost; floating must read deeper than hover or overlays merge with hovered cards.

# 4. Theming.

## 4.1. Single Light Theme.

There is one theme. No dark mode, no `auto`/OS-following state, no day/night swap. `--color-*` tokens are declared once and never rebound. Consequences:

- No `.dark` class, no `dark:` variant, no theme toggle, no theme cookie.
- The rendered forecast time (day vs night) never changes the canvas, accent, or any token — only the condition icon and copy change (§ 5.7.).
- New color tokens need one value only; verify ≥ WCAG AA against `canvas` (#ffffff).

## 4.2. CSS Mechanism.

Tailwind v4 CSS-first config. Tokens declared in the `@theme` block of `src/app/styles/globals.css` — each `--color-*`, `--text-*`, `--radius-*`, `--spacing-*` auto-generates a matching utility (`bg-canvas`, `text-temp-hero`, `rounded-md`, `p-md`, …). Components compose Tailwind utilities exclusively — no inline hex, no component stylesheets.

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-canvas: #ffffff;
  --color-page: #f4f8fb;
  --color-ink: #202c33;
  --color-primary: #00a4c5;
  --color-hairline: #dfe6eb;

  --text-temp-hero: 64px;
  --text-temp-hero--line-height: 1;
  --text-temp-hero--letter-spacing: -1px;
  --text-temp-hero--font-weight: 400;
}
```

| Property                                      | Reason                                                               |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `@theme` block, not per-component stylesheets | Tailwind v4 builds utilities from this block at compile time         |
| Single token set (no `.dark` rebind)          | One light theme; one utility per token, no theme-variant duplication |
| Single locale (Korean)                        | No `:lang()` override layer; type tokens carry their final values    |

# 5. Components.

Components are compositions of Tailwind utilities — no component stylesheets, no inline hex / px (§ 6.1.). Token references map directly to classes: `primary` → `bg-primary` / `text-primary`, `md` → `rounded-md` / `p-md`, `temp-hero` → `text-temp-hero`, etc. Per CLAUDE.md § 2, primitive controls are sourced from shadcn and then restyled to these tokens.

## 5.1. Buttons.

### 5.1.1. Variant Geometry.

| Variant              | Background (rest) | Text         | Radius | Padding    | Height | Border                |
| -------------------- | ----------------- | ------------ | ------ | ---------- | ------ | --------------------- |
| `button-primary`     | `primary`         | `on-primary` | `md`   | 12×16      | 44     | none                  |
| `button-secondary`   | `canvas`          | `ink`        | `md`   | 12×16      | 44     | 1px `hairline-strong` |
| `button-ghost`       | transparent       | `ink`        | `md`   | 8×16       | auto   | none                  |
| `button-link`        | transparent       | `primary`    | —      | 0          | auto   | none                  |
| `chip`               | `canvas`          | `body`       | `full` | 8×16       | 36     | 1px `hairline`        |
| `chip-selected`      | `ink`             | `on-ink`     | `full` | 8×16       | 36     | none                  |
| `icon-button-circle` | `surface-soft`    | `ink`        | `full` | 8 (square) | 36×36  | none                  |

Selection markers use `ink`, not `primary` (§ 3.1.1.).

### 5.1.2. State Matrix.

Pseudo-class mapping is fixed: `pressed` ↔ `:active`; `hover` ↔ `:hover`; `disabled` ↔ `:disabled`; `focus` ↔ `:focus-visible` (keyboard-only). Every interactive variant defines all five states. Single theme — no `dark:` prefixes.

| Variant              | `:hover`                          | `:active`                       | `:disabled`                                 | `:focus-visible`                                       |
| -------------------- | --------------------------------- | ------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| `button-primary`     | `bg-primary-hover`                | `bg-primary-pressed`            | `bg-primary-disabled`, `cursor-not-allowed` | `ring-2 ring-primary ring-offset-2 ring-offset-canvas` |
| `button-secondary`   | `bg-surface-soft`                 | `bg-surface-strong`             | `opacity-50`, `cursor-not-allowed`          | `ring-2 ring-primary ring-offset-2 ring-offset-canvas` |
| `button-ghost`       | `bg-surface-soft`                 | `bg-surface-strong`             | `opacity-50`, `cursor-not-allowed`          | `ring-2 ring-primary ring-offset-2 ring-offset-canvas` |
| `button-link`        | `text-primary-hover`, `underline` | `text-primary-pressed`          | `opacity-50`, `cursor-not-allowed`          | `ring-2 ring-primary ring-offset-2`                    |
| `chip`               | `bg-surface-soft`, `text-ink`     | `bg-surface-strong`, `text-ink` | `opacity-50`, `cursor-not-allowed`          | `ring-2 ring-primary ring-offset-2 ring-offset-canvas` |
| `chip-selected`      | unchanged (selection is a state)  | `bg-ink/90`                     | n/a                                         | (same)                                                 |
| `icon-button-circle` | `bg-surface-strong`               | `bg-surface-pressed`            | `opacity-50`, `cursor-not-allowed`          | `ring-2 ring-primary` (no offset — circle is the edge) |

| Decision                                                                            | Reason                                                                                                |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `button-primary` distinguishes `:hover` from `:active` (two darken steps)           | Conflating them erases pointer-down feedback. Δ ≈ 8% then 16%.                                        |
| Non-primary `:disabled` uses `opacity-50`; `button-primary` uses `primary-disabled` | Solid-fill primary needs an explicit muted hex; transparent/canvas variants are robust under opacity. |
| `:focus-visible`, not `:focus`                                                      | No focus rings on mouse click — keyboard only.                                                        |
| Focus ring `ring-2 ring-primary` + 2px `canvas` offset                              | 4px total halo, matches WCAG 2.4.7; offset prevents the ring blending into hover fills.               |

### 5.1.3. `icon-button-circle` Detail.

Single-glyph affordance (settings, refresh, remove-favorite, etc.). § 5.1.1. sets geometry, § 5.1.2. sets states.

| Property         | Value                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container        | 36×36 (square, `rounded-full`)                                                                                                                           |
| Icon size        | 18×18 (lucide default; 50% of container)                                                                                                                 |
| Padding          | `xs` (8px) all sides                                                                                                                                     |
| Resting fill     | `surface-soft`                                                                                                                                           |
| `:hover`         | `surface-strong`                                                                                                                                         |
| `:active`        | `surface-pressed`                                                                                                                                        |
| `:disabled`      | `opacity-50`, `cursor-not-allowed`                                                                                                                       |
| `:focus-visible` | `ring-2 ring-primary` (no offset)                                                                                                                        |
| Icon color       | `ink` by default; never `primary` (reserved for CTAs — § 6.1.). Destructive variants (e.g. remove-favorite, § 5.4.) tint to `semantic-error` on `:hover` |

Tap target 36×36 is below the WCAG 2.5.5 44×44 floor; restrict to pointer-dominant control rails. Touch-priority surfaces use 44×44 alternatives.

## 5.2. Inputs.

### 5.2.1. Variant Geometry.

| Variant        | Background (rest) | Radius | Padding | Height | Border (rest)         |
| -------------- | ----------------- | ------ | ------- | ------ | --------------------- |
| `text-input`   | `canvas`          | `md`   | 12×16   | 44     | 1px `hairline-strong` |
| `search-input` | `surface-soft`    | `full` | 12×16   | 44     | 1px `hairline`        |

`search-input` is the primary entry point — the district search (시 / 군 / 구 / 동). Border is `ring-1 ring-inset ring-{token}` so focus's 2px ring expands inward without shifting layout.

### 5.2.2. State Matrix.

`aria-invalid="true"` is the canonical error trigger; never style errors via a class only.

| Variant        | `:hover`                             | `:focus-visible`                | `:disabled`                                                            | `aria-invalid="true"`        |
| -------------- | ------------------------------------ | ------------------------------- | ---------------------------------------------------------------------- | ---------------------------- |
| `text-input`   | `ring-ink` (1px)                     | `ring-2 ring-primary`           | `bg-surface-strong text-meta-soft cursor-not-allowed`, `ring-hairline` | `ring-2 ring-semantic-error` |
| `search-input` | `bg-surface-strong` (no ring change) | `bg-canvas ring-2 ring-primary` | `opacity-50 cursor-not-allowed`                                        | `ring-2 ring-semantic-error` |

| Decision                                                  | Reason                                                                                                          |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `text-input:hover` darkens ring to `ink` (no fill change) | `canvas` fill is at the floor; outline is the available channel, and a fill change would collide with disabled. |
| `search-input:hover` escalates fill to `surface-strong`   | Its rest is `surface-soft`, so it follows the chip ladder (rest → strong). No `:active` — it isn't momentary.   |
| `search-input:focus-visible` fills with `canvas`          | Focus switches to active-input semantics, matching `text-input` focus for cross-input consistency.              |
| Errors use `aria-invalid`, not a class                    | Read by screen readers; class-only error styling fails accessibility. Helper text uses `caption` + error text.  |

## 5.3. Search Results (district autocomplete).

The list of districts matching the query, rendered as a `shadow-floating` overlay anchored to `search-input`. Replaces any generic pagination — weather search is autocomplete, not paged.

| Property                 | Spec                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Container                | `canvas`, `rounded-md`, `shadow-floating`, 1px `hairline`                             |
| Row (rest)               | `canvas`, `body-md` for the district name, `meta` for its parent path (시/도 → 군/구) |
| Row `:hover`             | `bg-surface-soft`                                                                     |
| Row active/aria-selected | `bg-primary-soft`, `text-ink` (keyboard highlight)                                    |
| No match                 | `empty-state` copy: "해당 장소의 정보가 제공되지 않습니다." (§ 5.5.)                  |

Keyboard: ↑/↓ move `aria-selected`; Enter selects. The highlighted row uses `primary-soft` (tint), not `ink` — selection within a transient list is navigation, not a committed toggle.

## 5.4. Favorite Card.

Feature composition; tokens only (full layout lives with the feature). Up to 6 per the PRD. Favorite cards are inset cells nested inside the `canvas` sidebar panel, not raised cards floating on `page` — so they rest at `surface-soft` and read as recessed wells against the white panel (§ 3.1.4.), matching the reference's quiet location rows.

| Property       | Spec                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | `surface-soft`, `rounded-md`, 1px `hairline` (inset cell — no shadow; the enclosing sidebar panel carries the elevation)                                 |
| `:hover`       | `bg-surface-strong` (chip ladder, § 3.1.4.; signals click-through to detail)                                                                             |
| Selected       | `ring-2 ring-primary ring-inset` — the active location. This is the active-navigation marker, the sole `primary` selection exception (§ 3.1.1., § 6.2.). |
| Location alias | `title-md` `ink`; editable (rename) via `text-input` in a modal (§ 5.6.)                                                                                 |
| Current temp   | `temp-lg` `ink`                                                                                                                                          |
| High / low     | `temp-sm`; high `ink`, low `meta`                                                                                                                        |
| Condition icon | lucide weather glyph, neutral `ink`/`meta` (§ 5.7.)                                                                                                      |
| Remove control | `icon-button-circle` with a `semantic-error` icon on `:hover`                                                                                            |

## 5.5. Empty State.

`empty-state` — `surface-soft` card, `body-md` `meta`, `lg` radius, `2xl` padding, 1px `hairline-soft`. Used for: no search match ("해당 장소의 정보가 제공되지 않습니다."), no favorites yet, and any list/panel with no content.

## 5.6. Modal.

`canvas` surface, `xl` radius. Scrim per § 3.5. (`bg-scrim/50`). Mobile full-bleed slide-up. Desktop width via `size`:

| Size | Width | Use                                                     |
| ---- | ----- | ------------------------------------------------------- |
| `sm` | 480px | Default. Rename-favorite, confirmations, short choices. |
| `md` | 560px | Forms with helper copy.                                 |
| `lg` | 640px | Information-dense surfaces with multiple sections.      |

No size beyond `lg`. A surface needing more horizontal space is a page, not a modal.

## 5.7. Weather Display Conventions.

Weather state is conveyed by neutral icon + mono numerals only — no hue encoding (§ 2.2., § 3.2.4.).

| Element             | Spec                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Condition icon      | lucide glyph (`sun`, `cloud`, `cloud-rain`, `cloud-snow`, `cloud-lightning`, `cloud-fog`, `moon`, …) in `ink` |
| Day vs night        | Swap glyph only (`sun` ↔ `moon`, `cloud-sun` ↔ `cloud-moon`); never swap canvas/accent (§ 4.1.)               |
| Current temp        | `temp-hero` (detail) / `temp-lg` (card), `ink`                                                                |
| High / low pair     | `temp-sm`; high `ink`, low `meta`; label with `title-sm` (최고 / 최저)                                        |
| Hourly strip        | Per-hour: `num-mono` hour label (`meta`), neutral condition icon, `temp-md` temperature (`ink`)               |
| Severe-weather note | `semantic-warning` (caution) or `semantic-error` (danger) banner using its `-soft` fill — never a new accent  |

# 6. Rules.

## 6.1. Do.

- Use `primary` for primary-action affordances, links, focus rings, and the active-nav marker only (§ 3.1.1.).
- Render every temperature and time with a `temp-*` / `num-mono` token; tabular numerals only (§ 3.2.3., § 3.2.4.).
- Distinguish weather conditions by neutral icon (`ink`/`meta`) — never by color (§ 5.7.).
- Use 1px `hairline` as default elevation; `shadow-raised` for raised content containers (the sidebar panel, the hourly-forecast card); `shadow-floating` for the search-results overlay and popovers (§ 3.5.).
- Reference colors via Tailwind utilities (`bg-*`, `text-*`, `border-*`) or `var(--color-*)` — never hard-code hex (§ 4.2.).
- Hex literals are permitted ONLY inside CSS filter functions (`drop-shadow()`, `mask-*`, `backdrop-filter`) where the value is a compositor parameter; comment the waiver at its site.
- Verify every new color token ≥ WCAG AA against `canvas` (#ffffff) (§ 4.1.).
- Start every interactive component's resting fill at `canvas` or `surface-soft` (§ 3.1.4.); never higher.
- Define the full state matrix (`:hover`, `:active`, `:disabled`, `:focus-visible`) for every interactive variant (§ 5.1.2., § 5.2.2.).
- Use `:focus-visible` (not `:focus`) for keyboard rings (§ 5.1.2.).
- Trigger error styling via `aria-invalid="true"` (§ 5.2.2.).

## 6.2. Don't.

- No serif anywhere (§ 3.2.1.).
- No negative letter-spacing on Hangul-bearing tokens (§ 3.2.5.).
- No second accent color — not for temperature, not for conditions, not for alerts (§ 2.2., § 6.1.).
- No color-coded temperature; no cold→hot scale or gradient ramp (§ 3.2.4.).
- No per-condition hue; conditions are icon-only (§ 5.7.).
- No dark mode and no day/night theme swap; one static light theme (§ 4.1.).
- No `primary` on filter / selection / toggle chips; use `ink` (e.g. `chip-selected`). The active-navigation marker is the sole exception (§ 3.1.1., § 6.1.).
- No background gradients (§ 3.1.).
- No Hangul in any `temp-*` / `num-mono` token (§ 3.2.5.).
- No `display-*`, `title-*`, or `body-*` on categorical navigation labels; use `nav-*` (§ 3.2.2.).
- No `rounded-xl` (16px) outside modals/featured surfaces (§ 3.4.).
- No shadow on `canvas`-flat resting surfaces — use hairline (§ 3.5.).
- No `surface-strong` or `surface-pressed` as an interactive component's resting fill (§ 3.1.4.).
- No fifth surface tier (§ 3.1.4.).
- No conflated hover/active on chip controls; no `hover:bg-primary-pressed` shorthand (§ 5.1.2.).
- No `:focus` rings on mouse click — use `:focus-visible` (§ 5.1.2.).

# 7. Known Gaps.

| Gap                         | Recommendation                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skeleton / loading states   | `surface-strong` rectangles, 1.5s pulse alternating with `surface-soft`                                                                                 |
| `on-primary` contrast       | White on `primary` (#00a4c5) ≈ 2.95:1, below WCAG AA; accepted for brand fidelity to the source teal. Revisit if `primary` is ever darkened (§ 3.1.1.). |
| Severe-weather alert system | Reuse `semantic-warning` / `semantic-error` with `-soft` fills; do not introduce a new accent (§ 5.7.)                                                  |
| Weather-condition icon set  | lucide covers sun / moon / cloud / rain / snow / lightning / fog / wind; finalize the day/night glyph pairs                                             |
| Geolocation permission UI   | Use `modal` (size `sm`) + `empty-state` fallback when permission is denied                                                                              |
