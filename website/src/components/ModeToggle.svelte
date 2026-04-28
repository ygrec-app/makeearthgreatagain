<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    ariaLabel?: string;
    lightLabel?: string;
    drenchedLabel?: string;
  }
  let {
    ariaLabel = "Color mode",
    lightLabel = "LIGHT",
    drenchedLabel = "DRENCHED",
  }: Props = $props();

  type Mode = "light" | "drenched";
  let mode = $state<Mode>("light");

  onMount(() => {
    const stored = localStorage.getItem("mega:mode");
    const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Mode = stored === "drenched" || stored === "light"
      ? (stored as Mode)
      : prefersDark ? "drenched" : "light";
    mode = initial;
    document.body.dataset.mode = initial;
  });

  function setMode(next: Mode) {
    if (next === mode) return;
    mode = next;
    document.body.dataset.mode = next;
    localStorage.setItem("mega:mode", next);
  }
</script>

<div class="mode-toggle" role="group" aria-label={ariaLabel}>
  <button
    type="button"
    class="mode-toggle__opt"
    class:is-active={mode === "light"}
    aria-pressed={mode === "light"}
    onclick={() => setMode("light")}
  >{lightLabel}</button>
  <span class="mode-toggle__sep" aria-hidden="true">/</span>
  <button
    type="button"
    class="mode-toggle__opt"
    class:is-active={mode === "drenched"}
    aria-pressed={mode === "drenched"}
    onclick={() => setMode("drenched")}
  >{drenchedLabel}</button>
</div>

<style>
  .mode-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-h2-mono-family);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text);
  }
  .mode-toggle__opt {
    color: inherit;
    opacity: 0.6;
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 4px 2px;
    transition: opacity 0.18s ease;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
  }
  .mode-toggle__opt.is-active { opacity: 1; }
  .mode-toggle__sep { opacity: 0.6; }
</style>