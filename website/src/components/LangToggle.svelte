<script lang="ts">
  type Locale = "en" | "fr";
  interface Props {
    ariaLabel?: string;
    locale?: Locale;
  }
  let { ariaLabel = "Language", locale = "en" }: Props = $props();
</script>

<div class="lang-toggle" role="group" aria-label={ariaLabel}>
  <a
    href="/"
    class="lang-toggle__opt"
    class:is-active={locale === "en"}
    aria-current={locale === "en" ? "true" : undefined}
  >EN</a>
  <span class="lang-toggle__sep" aria-hidden="true">/</span>
  <a
    href="/fr/"
    class="lang-toggle__opt"
    class:is-active={locale === "fr"}
    aria-current={locale === "fr" ? "true" : undefined}
  >FR</a>
</div>

<style>
  .lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-h2-mono-family);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text);
  }
  .lang-toggle__opt {
    color: inherit;
    opacity: 0.6;
    cursor: pointer;
    background: transparent;
    padding: 4px 2px;
    transition: opacity 0.18s ease;
    text-decoration: none;
  }
  .lang-toggle__opt.is-active { opacity: 1; }
  .lang-toggle__sep { opacity: 0.6; }
</style>
