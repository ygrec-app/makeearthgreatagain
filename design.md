---
version: 0.1.0
name: MEGA
description: Brutalist-leaning portfolio for MEGA — a single vivid blue, big type, sharp corners, and full-bleed 3D scenes per project.
colors:
  primary: "#4048F3"
  primary-soft: "#D8E4FF"
  surface: "#FFFFFF"
  ink: "#FFFFFF"
typography:
  display:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 12rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.005em
    textTransform: uppercase
  h1:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 5rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.02em
    textTransform: uppercase
  h2-mono:
    fontFamily: JetBrains Mono, SF Mono, ui-monospace, Menlo, monospace
    fontSize: 4rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.05em
    textTransform: uppercase
  project-title:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 4rem
    fontWeight: 600
    lineHeight: 1.1
  mission:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 3.5rem
    fontWeight: 400
    lineHeight: 1.4
  body-lg:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 1.4rem
    fontWeight: 500
    lineHeight: 1.4
  body-md:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 0.9rem
    fontWeight: 500
    letterSpacing: 0.05em
    textTransform: uppercase
  caption:
    fontFamily: Helvetica, Arial, sans-serif
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 80px
  section: 250px
rounded:
  none: 0px
  pill: 999px
  full: 9999px
components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  hero-heading:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.display}"
  section-title:
    textColor: "{colors.primary}"
    typography: "{typography.h1}"
  project-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.body-sm}"
    padding: "{spacing.sm}"
  category-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.h2-mono}"
  category-overlay:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  cursor:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 40px
---

## Overview

MEGA is a portfolio of ambitious, world-changing projects (wildfire defense, vertical farming, urban traffic, etc.), each with its own interactive 3D "megaverse" scene. The brand is **brutalist precision**: a single saturated blue carries the entire identity, type runs huge and uppercase, corners are sharp, and motion is restrained but intentional. The 3D scenes are the spectacle; the chrome around them is deliberately quiet so the work leads.

**Voice:** confident, slightly sci-fi, declarative. No gradients, no soft shadows, no rounded buttons. Every page should feel like a dossier.

## Colors

A monochromatic blue identity. **Primary `#4048F3`** is doing nearly all the work — it sets text, accents, buttons, borders, and the dominant card fill. The system is intentionally one-note.

- `primary` — text, buttons, accents, card fills. Use on `surface`.
- `primary-soft` (`#D8E4FF`) — the only secondary tone. Decorative circle inside project cards, and the tinted overlay on category headers.
- `surface` (`#FFFFFF`) — page background in light mode (becomes `primary` in drenched).
- `ink` (`#FFFFFF`) — text *on* primary. Both `ink` and `surface` resolve to white in light mode but they are **semantically distinct** — they diverge in drenched mode (see **Drenched Mode**), so don't deduplicate them.

**Derived alpha values** (not formal tokens — the spec only allows hex):
- `primary` at **60%** for ghost-button borders, link underlines, secondary text.
- `primary` at **30%** for scroll-indicator chrome and disabled states.
- `primary` darkened ~6% (`#363DCE`) for button hover.
- Black at **60%** for the modal scrim, paired with `8px` backdrop blur.

**Do not introduce a third hue.** If a state needs more contrast, push opacity, not color.

## Typography

Two families:
- **Helvetica** (system stack) for everything narrative, navigational, and decorative.
- **JetBrains Mono** for category headers (`h2-mono`) — the only place monospace appears. It signals "system / project label" and visually separates the project taxonomy from the editorial copy.

Sizes are rem-based and intentionally large at the top of the scale — `display` is `12rem` and the hero "MEGA" wordmark is meant to dominate the viewport. Italic is reserved for **mission-statement highlights** — it's a brand cue, not a default for emphasis.

Tracking: `0.02em–0.05em` on uppercase elements. Body copy stays at default.

## Layout

- Page padding: `5%–10%` horizontal, generous vertical (`section` = 250px between major blocks).
- Mission statement caps at `1600px` width; everything else is fluid.
- Project cards are full-viewport-height (`100vh`) on desktop, `500px` on mobile.
- Category rows are split 50/50: a sticky category header column on the left (with the looping background video), the project card column on the right. Mobile collapses to stacked.

## Elevation & Depth

There are no shadows. Depth comes from:
1. **Backdrop blur** (8px) on modal scrim — the *only* blur in the system.
2. **Z-stacked solid color** — primary cards over white surface over light-blue header overlays.
3. **Clip-path notches** on project cards (40px chamfer on the top-right corner) — a digital/cut-paper signal in lieu of shadow.

If you reach for a shadow, you're solving the wrong problem.

## Shapes

- **All buttons, cards, and inputs use `radius: 0`.** This is load-bearing for the brand.
- **Circles** (`rounded.full`) are reserved for: the section-title bullet, the custom cursor, the decorative reveal inside project cards, and language-toggle dots.
- **Notch** (40px chamfer, top-right) on `project-card` only. Don't apply to other surfaces.

## Components

### `project-card`
The signature object. Solid `primary` fill, white text, sharp 40px top-right notch, full viewport height on desktop. A `primary-soft` portal circle (`min(380px, 50%)` of card width) sits centered behind the content; content inside a `circle(min(190px, 25cqw) at center)` clip-path inverts colors to primary-on-soft, creating a portal effect into the project. No border-radius, no border.

### `button-primary` / `caps-button`
Solid primary, white text, square corners, uppercase, `0.05em` tracking. Hover darkens primary ~6% (`#363DCE`) and lifts 1px. The mail/notify variant uses an inline white SVG icon and a spring transform on hover (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

### `button-ghost` (`toggle-description`)
Transparent fill, `1px` border at primary-60% alpha, white text on primary backgrounds. Hover inverts to white fill / primary text. The arrow inside translates 1200% on parent card hover — a deliberately playful escape animation.

### `category-header`
Sticky 50%-column panel with a `primary-soft` tinted overlay (50% opacity) over a looping background video. Video playback is gated by Lenis scroll velocity (boomerangs forward/reverse), with an SVG film-grain overlay unifying the set. Mono `h2-mono` title in white, an SVG category symbol at top-left, tagline in white at the bottom.

### `cursor` (custom)
40px primary circle replacing the system cursor on interactive areas. Scales `0.6 → 1` on activation with a cubic-bezier ease.

### `lang-toggle`
Fixed top-right, only `is-visible` after the hero locks. Active language at full opacity, inactive at `0.6`.

## Drenched Mode

The site has a second mode called **Drenched** (toggled via `data-mode="drenched"` on `<body>`), in which the entire palette inverts. The token spec doesn't model multi-mode systems, so the swap lives here as the source of truth.

| Role | Light mode (default) | Drenched mode |
|---|---|---|
| `surface` (page bg) | `#FFFFFF` | `{colors.primary}` |
| `text` (body) | `{colors.primary}` | `{colors.ink}` |
| `card-bg` | `{colors.primary}` | `{colors.primary-soft}` |
| `card-text` | `{colors.ink}` | `{colors.primary}` |
| `card-circle` | `{colors.primary-soft}` | `{colors.primary}` |
| `card-clip-text` | `{colors.primary}` | `{colors.ink}` |

The two modes mirror each other — Drenched is the entire page bathed in primary blue with cards becoming the light element, light mode is the inverse. No third color is introduced in either mode; opacity and weight carry every state, exactly as in the **Colors** section.

User preference persists in `localStorage['mega:mode']` and seeds from `prefers-color-scheme` on first visit.

## Motion

Not formally tokenized (the spec doesn't model time/easing), but enforced by convention:

| Token | Value | Use |
|---|---|---|
| `fast` | `200ms` | hover state, color transitions |
| `base` | `300ms` | most UI transitions |
| `slow` | `500ms` | overlay open/close, layout shifts |
| `reveal` | `700ms` | category-description expand |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | default exit easing |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | playful one-shots (notify icon) |

Keep motion under `slow` unless it's a deliberate `reveal`. Never animate more than two properties at once.

## Do's and Don'ts

**Do**
- Use `primary` for nearly everything. Trust monochrome.
- Set `radius: 0` by default on any new surface.
- Make typography big. If it feels too big, it's probably right.
- Reserve italic for mission-statement highlights.
- Keep motion under 500ms unless it's a deliberate `reveal` (700ms).

**Don't**
- Add a third color. If you need contrast, change opacity or weight.
- Introduce shadows, gradients, or border-radius on rectangular surfaces.
- Mix monospace into anything that isn't a category label.
- Use semi-transparent primary on top of `primary-soft` — they vibrate.
- Ship a button that isn't uppercase + tracked.
