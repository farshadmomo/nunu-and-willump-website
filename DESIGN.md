# DESIGN

Locked design system for the Nunu & Willump site. Holo-iridescent ice glass. All color in OKLCH. Never `#000` / `#fff`; neutrals are tinted toward blue.

## Color strategy

**Committed → Drenched.** Tinted near-black ice carries the surface; iridescent oil-slick is the identity color and is allowed to dominate hero moments (snowball fill, title, prism sweeps). Lore/ability surfaces drop back to Restrained so text stays legible.

### Tokens (defined in `globals.css`)

| Token | OKLCH | Use |
|---|---|---|
| `--ink` | `oklch(0.15 0.03 255)` | base background (blue-tinted near-black) |
| `--ink-2` | `oklch(0.20 0.035 250)` | raised surfaces, panel base |
| `--ink-3` | `oklch(0.27 0.04 248)` | hairlines, inactive |
| `--frost` | `oklch(0.96 0.01 230)` | primary text |
| `--frost-dim` | `oklch(0.80 0.02 235)` | secondary text (≥4.5:1 on ink) |
| `--ice-cyan` | `oklch(0.85 0.13 200)` | iridescent stop / focus |
| `--ice-teal` | `oklch(0.80 0.12 175)` | iridescent stop |
| `--ice-violet` | `oklch(0.70 0.16 300)` | iridescent stop |
| `--ice-magenta` | `oklch(0.72 0.18 340)` | iridescent stop |

Iridescent gradient = cyan → teal → violet → magenta, animated. **Only** on decorative/hero wordmarks (banned on meaningful body copy). Real headings use solid `--frost` with weight/scale for hierarchy.

## Theme

Dark. Scene sentence: *a fan leaning back at night, lights low, watching a snow-globe story of a boy and his yeti unfold as they scroll.* That forces dark, cold, luminous.

## Typography

Chubby + rounded: plump, friendly letterforms suiting "a boy and his yeti" and the snowball motif, kept premium by tight hierarchy. None of Inter / Geist / Space Grotesk.

- **Display — Fredoka** (500/600/700): hero wordmark, section titles. Chubby, rounded, snowball-soft.
- **Body — Nunito** (400/500/600/700): lore, descriptions. Rounded humanist; base weight 500 for a plump baseline. Cap measure 65–75ch, line-height 1.6.
- **Mono — Martian Mono** (400/500): ability keys (P/Q/W/E/R), difficulty/role chips, loader %, HUD labels. Tabular figures, kept mono for ice-HUD contrast against the rounded display/body.

Hierarchy via scale + weight, ≥1.25 step ratio. No flat scales.

## Effects / utilities

- `.holo-glass`: `backdrop-blur(14px)`, fill `color-mix(--ink-2 / 55%)`, 1px iridescent border (border-image gradient), inset top highlight, soft outer shadow. The theme's primary surface; purposeful, not decorative.
- `.chromatic`: layered text via R/B offset shadows for chromatic-aberration on hero title only.
- prism sweep: diagonal animated light band keyframe across hero title / loader.
- `.cracked-ice`: faint SVG fracture overlay on large glass panels.
- snow: drifting particle layer, low opacity, reduced-motion aware.
- scrollbar: thin, ice-tinted.

## Motion

GSAP + ScrollTrigger drive the scroll story; Lenis for smooth inertia; Motion for navbar micro-interactions. Ease-out exponential (expo/quint) for entrances; no bounce/elastic. Animate transform/opacity only. Exit ~60–70% of enter duration. Stagger lists 30–50ms. Every scroll effect has a reduced-motion static fallback.

## Bans honored

No side-stripe accent borders. No gradient-text on meaningful copy. Glass is the theme so it is allowed, but never as lazy default behind everything. No hero-metric template. No identical card grids (ability frames alternate sides + sizes). No em dashes in copy.

## Layout

8pt spacing rhythm, varied (not uniform padding). Section vertical rhythm tiers 24/48/96/160. Container max ~1280px for text; hero/snowball/skins go full-bleed. Mobile-first breakpoints 375 / 768 / 1024 / 1440.
