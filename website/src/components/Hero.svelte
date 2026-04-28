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
