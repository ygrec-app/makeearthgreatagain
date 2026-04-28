<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let dot: HTMLDivElement | undefined;
  let scale = $state(0.6);

  onMount(() => {
    if (!dot) return;
    if (matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.25, ease: "power3.out" });
    const sTo = gsap.quickTo(dot, "scale", { duration: 0.18, ease: "power3.out" });

    function onMove(e: PointerEvent) {
      xTo(e.clientX);
      yTo(e.clientY);
    }

    function onOver(e: PointerEvent) {
      const target = (e.target as Element | null)?.closest('[data-cursor="grow"]');
      sTo(target ? 1 : 0.6);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  });
</script>

<div class="cursor" bind:this={dot} aria-hidden="true"></div>

<style>
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
    border-radius: 9999px;
    background: var(--text);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-100px, -100px) scale(0.6);
    will-change: transform;
  }
  @media (hover: none) {
    .cursor { display: none; }
  }
</style>
