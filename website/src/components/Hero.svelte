<script lang="ts">
  import ModeToggle from "./ModeToggle.svelte";
  import LangToggle from "./LangToggle.svelte";
  import ScrollIndicator from "./ScrollIndicator.svelte";

  interface Props {
    children?: import("svelte").Snippet;
    scrollLabel?: string;
    languageLabel?: string;
    colorModeLabel?: string;
    lightLabel?: string;
    drenchedLabel?: string;
    locale?: "en" | "fr";
  }
  let {
    children,
    scrollLabel = "SCROLL",
    languageLabel = "Language",
    colorModeLabel = "Color mode",
    lightLabel = "LIGHT",
    drenchedLabel = "DRENCHED",
    locale = "en",
  }: Props = $props();
</script>

<section class="hero" id="hero">
  <svg
    class="hero__grid"
    viewBox="0 0 1440 900"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
    >
      <!-- Top converging lines -->
      <path d="M0 0 L288 180 M180 0 L396 180 M360 0 L504 180 M540 0 L612 180 M720 0 L720 180 M900 0 L828 180 M1080 0 L936 180 M1260 0 L1044 180 M1440 0 L1152 180" />
      <!-- Bottom converging lines -->
      <path d="M0 900 L288 720 M180 900 L396 720 M360 900 L504 720 M540 900 L612 720 M720 900 L720 720 M900 900 L828 720 M1080 900 L936 720 M1260 900 L1044 720 M1440 900 L1152 720" />
      <!-- Left converging lines -->
      <path d="M0 180 L288 288 M0 360 L288 396 M0 540 L288 504 M0 720 L288 612" />
      <!-- Right converging lines -->
      <path d="M1440 180 L1152 288 M1440 360 L1152 396 M1440 540 L1152 504 M1440 720 L1152 612" />
      <!-- Back wall outline -->
      <path d="M288 180 L1152 180 L1152 720 L288 720 Z" />
      <!-- Depth rectangles -->
      <path d="M216 135 L1224 135 L1224 765 L216 765 Z" />
      <path d="M144 90 L1296 90 L1296 810 L144 810 Z" />
      <path d="M72 45 L1368 45 L1368 855 L72 855 Z" />
      <!-- Back wall vertical grid -->
      <path d="M396 180 L396 720 M504 180 L504 720 M612 180 L612 720 M720 180 L720 720 M828 180 L828 720 M936 180 L936 720 M1044 180 L1044 720" />
      <!-- Back wall horizontal grid -->
      <path d="M288 288 L1152 288 M288 396 L1152 396 M288 504 L1152 504 M288 612 L1152 612" />
    </g>
  </svg>

  <div class="hero__top-right">
    <LangToggle ariaLabel={languageLabel} {locale} />
    <ModeToggle ariaLabel={colorModeLabel} {lightLabel} {drenchedLabel} />
  </div>

  <div class="hero__inner">
    <div class="hero__wordmark">
      {#if children}{@render children()}{/if}
    </div>
  </div>

  <ScrollIndicator label={scrollLabel} />
</section>

<style>
  .hero {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--surface);
    color: var(--text);
    overflow: hidden;
  }
  .hero__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
    padding: 0 var(--space-gutter);
    width: 100%;
  }
  .hero__wordmark {
    width: 60vw;
    max-width: 1100px;
    min-width: 320px;
    position: relative;
    z-index: 1;
  }
  .hero__grid {
    --grid-mask: 100%;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: var(--primary);
    opacity: 0.55;
    pointer-events: none;
    z-index: 0;
    -webkit-mask-image:
      radial-gradient(
        ellipse calc(var(--grid-mask) * 1.7) var(--grid-mask) at 50% 50%,
        #000 0%,
        #000 60%,
        transparent 100%
      ),
      linear-gradient(
        to bottom,
        transparent 0%,
        #000 12%,
        #000 78%,
        transparent 100%
      );
    -webkit-mask-composite: source-in;
    mask-image:
      radial-gradient(
        ellipse calc(var(--grid-mask) * 1.7) var(--grid-mask) at 50% 50%,
        #000 0%,
        #000 60%,
        transparent 100%
      ),
      linear-gradient(
        to bottom,
        transparent 0%,
        #000 12%,
        #000 78%,
        transparent 100%
      );
    mask-composite: intersect;
  }
  :global([data-mode="drenched"]) .hero__grid {
    color: #fff;
    opacity: 0.4;
  }
  @media (max-width: 768px) {
    .hero__grid {
      -webkit-mask-image:
        radial-gradient(
          circle var(--grid-mask) at 50% 50%,
          #000 0%,
          #000 60%,
          transparent 100%
        ),
        linear-gradient(
          to bottom,
          transparent 0%,
          #000 14%,
          #000 76%,
          transparent 100%
        );
      mask-image:
        radial-gradient(
          circle var(--grid-mask) at 50% 50%,
          #000 0%,
          #000 60%,
          transparent 100%
        ),
        linear-gradient(
          to bottom,
          transparent 0%,
          #000 14%,
          #000 76%,
          transparent 100%
        );
    }
  }
.hero__top-right {
    position: fixed;
    top: var(--space-lg);
    right: var(--space-lg);
    display: flex;
    gap: var(--space-xxl);
    align-items: center;
    z-index: 50;
  }
</style>
