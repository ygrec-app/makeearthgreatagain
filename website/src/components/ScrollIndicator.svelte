<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  interface Props {
    label?: string;
    target?: string;
  }
  let { label = "SCROLL", target = "#mission" }: Props = $props();
  let el: HTMLButtonElement | undefined;

  onMount(() => {
    if (!el) return;
    let dismissed = false;
    function onScroll() {
      if (dismissed) return;
      if (window.scrollY > 4) {
        dismissed = true;
        gsap.to(el!, {
          opacity: 0,
          y: 12,
          duration: 0.4,
          ease: "power2.out",
          pointerEvents: "none",
        });
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  function jump() {
    const lenis = (window as any).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(target, {
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<button
  type="button"
  class="scroll-indicator"
  bind:this={el}
  onclick={jump}
  aria-label={label}
>
  <span class="scroll-indicator__arrow" aria-hidden="true">&darr;</span>
  <span class="scroll-indicator__label">{label}</span>
</button>

<style>
  .scroll-indicator {
    position: fixed;
    left: 50%;
    bottom: var(--space-lg);
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--text);
    font-family: var(--font-h2-mono-family);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    z-index: 40;
    background: none;
    border: 0;
    padding: 8px 16px;
    cursor: pointer;
  }
  .scroll-indicator:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 4px;
  }
  .scroll-indicator__arrow {
    font-size: 1.1rem;
    line-height: 1;
    animation: bob 1.6s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(4px); }
  }
</style>
