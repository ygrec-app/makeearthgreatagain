# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo shape

The repo is a small two-package workspace:

- **Root** (`/`) — owns `design.md` (the design system source of truth) and the `@google/design.md` lint/export tooling.
- **`website/`** — the Astro 6 + Svelte 5 site. All product code lives here. **Run `npm` commands from inside `website/`**, not the root, unless they're prefixed `design:` (those run from root).
- **`design.pen`** — encrypted Pencil design file. Read/write only via `mcp__pencil__*` tools, never with `Read`/`Edit`. Frame IDs in this file are first-class identifiers; the user often refers to nodes by ID.
- **`images/`** — static assets shared between site and pen file. Notably `category-{slug}.jpg` (extracted frames from each category video) used as fills in pen design headers.

## Commands

From `website/`:

```bash
npm run dev            # localhost:4321 (auto-runs build-tokens via predev)
npm run build          # production build (auto-runs build-tokens via prebuild)
npm run build-tokens   # regenerate src/styles/tokens.css from ../design.md
npm run test:e2e       # Playwright E2E tests
npx playwright test tests/e2e/site.spec.ts -g "test name"   # single test
```

From the root:

```bash
npm run design:lint              # lint design.md against the Google spec
npm run design:export:tailwind   # export tokens as Tailwind theme JSON
npm run design:export:dtcg       # export tokens as DTCG JSON
```

## Architecture

### Single source of truth flow

```
design.md (YAML frontmatter + prose)
   │  scripts/build-tokens.mjs (auto-runs on dev/build)
   ▼
website/src/styles/tokens.css (generated, do not hand-edit)
   │  consumed by Astro/Svelte components via var(--*)
   ▼
website/dist/
```

`tokens.css` carries `:root` defaults plus two mode blocks: `[data-mode="light"]` and `[data-mode="drenched"]`. The drenched mode flips `surface↔primary`, `text↔ink`, and the card portal palette. **The mode swap isn't expressible in design.md tokens** — it lives in `## Drenched Mode` prose in design.md and is implemented by hand in `tokens.css`. If you regenerate tokens, the build script must preserve those mode blocks (check the script before assuming it does).

### Astro + Svelte islands

Pages are Astro (SSG); interactive components are Svelte 5 islands (`runes` mode, `$state`/`$props`). The pattern is:
- `src/pages/index.astro` and `src/pages/fr/index.astro` are full-page entry points; locale routing is path-based.
- Each page wires top-level Astro components (`Hero`, `Mission`, `MegaCaps`, `ProjectsIndex`, `Footer`) and passes localized strings down as props.
- Interactive bits (`Hero`, `ProjectCard`, `ProjectOverlay`, `Cursor`, `LangToggle`, `ModeToggle`, `NotifyForm`, `ScrollIndicator`) are Svelte and hydrate `client:load` or `client:idle`.

### Smooth scroll + motion

Layered in `src/layouts/Base.astro`:
- **Lenis** is constructed once at document level with `smoothWheel: true` and exposed on `window.__lenis` so any island can read velocity or call `scrollTo`.
- **GSAP `ScrollTrigger`** is updated by `lenis.on("scroll", ScrollTrigger.update)` and driven via `gsap.ticker.add((t) => lenis.raf(t * 1000))` — Lenis owns the scroll loop, GSAP follows.
- All scroll-driven animation lives in `src/lib/motion.ts`, called once on page load. Hero pin/wordmark, Mission split-text reveal, Projects parallax, Footer wordmark backflip, and category video orchestration are all here.
- `prefers-reduced-motion` early-returns `initMotion()` — videos stay paused, no scroll animations register.

### Category videos (motion.ts)

Each `.category-bg-video` is gated by a stack of mechanisms:
1. **IntersectionObserver** flips an in-viewport flag — only the visible video plays.
2. **Lenis velocity** drives play/pause: video plays only while the user is actively scrolling (above a small threshold), pauses on idle.
3. **Boomerang playback**: native `play()` forward; on `ended`, a `requestVideoFrameCallback`-gated rAF walks `currentTime` backward at 1/24s per frame; on reaching 0, switches back to forward.
4. **`--scroll-velocity` CSS variable** (smoothed Lenis velocity, 0–1) drives `filter: blur() saturate()` on the videos for a velocity tint, masking play/pause transitions.
5. A subtle **GSAP parallax** (`yPercent ±6`, `scrub: true`) rides the scroll progress; Lenis is the only smoothing source — stacking numeric scrub on top produced jitter.
6. Mobile is gated off (`isDesktop = matchMedia("(min-width: 769px)")`).

Videos are encoded **all-intra H.264** (every frame is a keyframe) so backward seek is cheap. Re-encode with `ffmpeg -c:v libx264 -preset slow -crf 26 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p -movflags +faststart -an`. Source clips are 720p, 24fps, ~5s — that frame rate is hardcoded in `motion.ts` (`const FRAME = 1 / 24`).

### Content + i18n

Project copy is **not** in component files — it's in `src/lib/localization.ts` (a typed dictionary keyed by locale). Components receive strings via the `t(locale, key)` helper (`src/lib/i18n.ts`) or via Astro `getCollection` for the project content collection.

Categories and projects load from `src/content/` via Astro Content Collections. `src/lib/projects.ts` joins them and picks the locale-suffixed field (`title_en`, `title_fr`, etc.). The five category slugs are typed: `"unite" | "protect" | "restore" | "feed" | "shift"`.

### Modes (light / drenched)

The site has two visual modes that flip the entire palette via `body[data-mode]`. `ModeToggle.svelte` writes to `localStorage["mega:mode"]`; first-visit default seeds from `prefers-color-scheme`. Initial mode is set in `Base.astro` *before* hydration to avoid a flash. When adding a new component that uses brand colors, write against `var(--text)`, `var(--card-bg)`, etc., not raw `var(--primary)` — the mode-aware vars do the right thing in both modes.

### Project card portal effect

`ProjectCard.svelte` renders the same content twice (`.card-content` + `.card-clip`). The clip layer uses `clip-path: circle(min(190px, 25cqw) at 50% 50%)` over a centered `.card-circle`. The `card-clip-text` color inverts inside the circle to create the "portal" reveal. This requires the project card to set `container-type: inline-size` so the `25cqw` resolves against the card's own width — plain `25%` resolves against `sqrt(w²+h²)/√2` and drifts on tall cards, breaking the alignment.

## Conventions

- **Don't hand-edit `tokens.css`** — regenerate from `design.md`. Exception: the `[data-mode="drenched"]` block (see flow above).
- **Don't add a third hue.** The brand is monochromatic blue; if you need contrast, push opacity or weight. This is enforced by prose in `design.md` and asserted in `## Do's and Don'ts`.
- **Don't introduce border-radius on rectangular surfaces.** Square corners are load-bearing for the brand. The 40px notch on `.project-card` is the only chamfer in the system.
- **Pen file edits go through `mcp__pencil__batch_design`.** Frame IDs are stable; reuse them rather than recreating nodes. The `context` field on each node is where prompts/rationale live (e.g., the Seedance video prompts are stored on the category row headers).
- **HMR over restart.** Astro+Vite handles edits live; killing the dev server breaks the user's workflow. Only kill it when a structural change (renaming the directory, swapping `astro.config.mjs`) requires it.
- **UI verification.** After visual/animation/scroll changes, drive the dev server with Playwright or Chrome DevTools MCP before claiming done — don't rely on type checking or unit tests for feature correctness.
