<script lang="ts">
  import { gsap } from "gsap";
  import {
    overlayProject,
    closeOverlay,
    type OverlayProject,
  } from "../lib/overlayStore";

  interface Props {
    closeLabel?: string;
    enterMegaverseLabel?: string;
  }
  let {
    closeLabel = "Close",
    enterMegaverseLabel = "Enter Megaverse",
  }: Props = $props();

  let current = $state<OverlayProject | null>(null);
  let scrimEl = $state<HTMLElement | null>(null);
  let panelEl = $state<HTMLElement | null>(null);
  let isClosing = false;
  let entered = false;

  const reduce =
    typeof window !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  $effect(() => {
    const unsub = overlayProject.subscribe(async (v) => {
      if (v) {
        current = v;
        isClosing = false;
      } else if (current && !isClosing) {
        isClosing = true;
        await animateOut();
        current = null;
        entered = false;
        isClosing = false;
      }
    });
    return () => unsub();
  });

  $effect(() => {
    if (current && scrimEl && panelEl && !entered) {
      entered = true;
      animateIn();
    }
  });

  $effect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    const lenis = (window as any).__lenis;
    lenis?.stop?.();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start?.();
      document.body.style.overflow = "";
    };
  });

  function animateIn() {
    if (!scrimEl || !panelEl) return;
    if (reduce) {
      gsap.set(scrimEl, { opacity: 1 });
      gsap.set(panelEl, { opacity: 1, scale: 1, y: 0 });
      return;
    }
    gsap.set(scrimEl, { opacity: 0 });
    gsap.set(panelEl, { opacity: 0, scale: 0.94, y: 24 });
    const tl = gsap.timeline();
    tl.to(scrimEl, { opacity: 1, duration: 0.3, ease: "power2.out" });
    tl.to(
      panelEl,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        ease: "back.out(1.4)",
      },
      "<0.05",
    );
  }

  function animateOut(): Promise<void> {
    return new Promise((resolve) => {
      if (!scrimEl || !panelEl) {
        resolve();
        return;
      }
      if (reduce) {
        gsap.set(scrimEl, { opacity: 0 });
        gsap.set(panelEl, { opacity: 0 });
        resolve();
        return;
      }
      const tl = gsap.timeline({ onComplete: () => resolve() });
      tl.to(panelEl, {
        opacity: 0,
        scale: 0.96,
        y: 12,
        duration: 0.22,
        ease: "power2.in",
      });
      tl.to(
        scrimEl,
        { opacity: 0, duration: 0.18, ease: "power2.in" },
        "<0.04",
      );
    });
  }

  function onScrim(e: MouseEvent) {
    if (e.target === e.currentTarget) closeOverlay();
  }
</script>

{#if current}
  <div
    bind:this={scrimEl}
    class="project-overlay-scrim"
    role="dialog"
    aria-modal="true"
    aria-label={current.title}
    onclick={onScrim}
    onkeydown={(e) => e.key === "Escape" && closeOverlay()}
  >
    <div
      bind:this={panelEl}
      class="project-overlay-panel"
      data-project-slug={current.slug}
    >
      <button
        type="button"
        class="project-overlay-close"
        aria-label={closeLabel}
        onclick={closeOverlay}>✕</button
      >
      <h2 class="project-overlay-title">{current.title}</h2>
      <div class="project-overlay-meta">{current.categoryName}</div>
      <div class="project-overlay-body">{@html current.body}</div>
      <button type="button" class="project-overlay-cta" disabled aria-disabled="true">
        {enterMegaverseLabel} <span aria-hidden="true">→</span>
        <span class="project-overlay-cta-badge">SOON</span>
      </button>
    </div>
  </div>
{/if}
