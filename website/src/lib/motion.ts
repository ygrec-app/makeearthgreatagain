import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion(): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document.documentElement.classList.add("motion-ready");
    return;
  }

  const heroSection = document.querySelector<HTMLElement>(".hero");
  const heroWordmark = document.querySelector<HTMLElement>(".hero__wordmark");
  const heroSvg = heroWordmark?.querySelector<SVGSVGElement>("svg.mega-wordmark");
  const heroGrid = document.querySelector<SVGSVGElement>(".hero__grid");
  const heroToggles = document.querySelector<HTMLElement>(".hero__top-right");
  const scrollIndicator = document.querySelector<HTMLElement>(".scroll-indicator");

  // Toggles + scroll indicator: short load-time entrance (orthogonal to the
  // scroll-driven wordmark sequence below)
  if (heroToggles || scrollIndicator) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (heroToggles) tl.from(heroToggles, { autoAlpha: 0, y: -16, duration: 0.55 });
    if (scrollIndicator) tl.from(scrollIndicator, { autoAlpha: 0, y: 12, duration: 0.5 }, "<0.2");
  }

  // Wordmark: scroll-driven, pinned timeline. Letters fly in from the right to
  // form MEGA, then microcopy scales down from "screen-filling" to its natural
  // position inside each letter.
  if (heroSection && heroSvg) {
    const paths = heroSvg.querySelectorAll<SVGPathElement>("path");
    if (paths.length >= 8) {
      // SVG path order: [E, G, M, A, Make, Earth, Great, Again]
      const letterE = paths[0];
      const letterG = paths[1];
      const letterM = paths[2];
      const letterA = paths[3];
      const lettersInReadingOrder = [letterM, letterE, letterG, letterA];
      const microcopy = [paths[4], paths[5], paths[6], paths[7]];

      // Outline placeholder MEGA behind the animated letters — reads as a
      // "where it lands" guideline, not as faded text. Animated letters fill
      // over it once they arrive, naturally hiding the outline.
      // Each letter is filled with the hero's actual background color (so the
      // fill is invisible against the page) and stroked. Adjacent letters
      // overlap, so each letter's opaque fill covers the previous letter's
      // stroke at the junction — visible outline reads as one clean MEGA
      // silhouette, not 4 outlines crossing each other.
      const heroBg = getComputedStyle(heroSection).backgroundColor;
      // Wrap ghosts in a group with opacity so overlapping strokes don't stack
      // alpha (which produces a darker stripe in junction overlaps). The group
      // renders to an offscreen buffer at full opacity then composites at 0.32.
      const ghostGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      ghostGroup.setAttribute("opacity", "0.32");
      ghostGroup.style.pointerEvents = "none";
      const firstLetter = lettersInReadingOrder[0];
      firstLetter.parentNode?.insertBefore(ghostGroup, firstLetter);

      const ghosts: SVGPathElement[] = [];
      lettersInReadingOrder.forEach((letter) => {
        const ghost = letter.cloneNode(true) as SVGPathElement;
        ghost.setAttribute("fill", heroBg);
        ghost.setAttribute("fill-opacity", "1");
        ghost.setAttribute("stroke", "var(--text)");
        ghost.setAttribute("stroke-width", "3.5");
        ghost.setAttribute("stroke-linejoin", "round");
        ghost.setAttribute("stroke-linecap", "round");
        ghost.setAttribute("stroke-opacity", "1");
        ghost.style.paintOrder = "stroke fill";
        ghost.style.vectorEffect = "non-scaling-stroke";
        ghost.removeAttribute("transform");
        ghostGroup.appendChild(ghost);
        ghosts.push(ghost);
      });

      gsap.set(lettersInReadingOrder, { x: 800, autoAlpha: 0 });
      gsap.set(microcopy, {
        scale: 20,
        opacity: 0,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Begin with a small, subtle vignette of grid in the center; expand the
      // radial mask outward and scale up so the perspective room resolves into
      // view as MEGA assembles.
      if (heroGrid) {
        gsap.set(heroGrid, {
          transformOrigin: "50% 50%",
          scale: 0.85,
          autoAlpha: 0.18,
          "--grid-mask": "32%",
        });
        tl.to(
          heroGrid,
          {
            scale: 1,
            autoAlpha: 1,
            "--grid-mask": "100%",
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );
      }

      tl.to(lettersInReadingOrder, {
        x: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.25,
        ease: "power3.out",
      });

      // Fade each placeholder out in sync with its corresponding letter landing
      tl.to(
        ghosts,
        {
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.25,
          ease: "power2.out",
        },
        0,
      );

      // Microcopy: pop in opaque-and-huge the moment MEGA is done, then shrink
      tl.to(
        microcopy,
        {
          opacity: 1,
          duration: 0.12,
          stagger: 0.05,
          ease: "none",
        },
        ">0.1",
      );
      tl.to(
        microcopy,
        {
          scale: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power2.out",
        },
        "<",
      );
    }
  }

  document.documentElement.classList.add("motion-ready");

  const missionCopy = document.querySelector<HTMLElement>(".mission__copy");
  if (missionCopy) {
    const split = new SplitText(missionCopy, {
      type: "words",
      wordsClass: "mission__word",
    });
    gsap.set(split.words, { opacity: 0.08, y: 24, filter: "blur(8px)" });
    gsap.to(split.words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "none",
      stagger: { each: 0.04, from: "start" },
      scrollTrigger: {
        trigger: ".mission",
        start: "top 85%",
        end: "top 35%",
        scrub: 0.4,
      },
    });
  }

  const isDesktop = matchMedia("(min-width: 769px)").matches;

  gsap.utils.toArray<HTMLElement>(".category-row").forEach((row) => {
    if (isDesktop) {
      row.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: 75 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top top",
              scrub: 0.4,
            },
          },
        );
      });
    }

    const symbol = row.querySelector<HTMLElement>(".category-symbol");
    const title = row.querySelector<HTMLElement>(".category-title");
    if (symbol && title) {
      gsap.from([symbol, title], {
        autoAlpha: 0,
        y: 32,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 85%" },
      });
    }

    if (isDesktop) {
      const video = row.querySelector<HTMLVideoElement>(".category-bg-video");
      if (video) {
        // Boomerang playback: native play() forward; on `ended`, reverse with
        // a rAF-driven currentTime walk back to 0, then resume forward. The
        // clips are all-intra so backward seeking is cheap.
        video.loop = false;
        const FRAME = 1 / 24;
        video.dataset.dir = "fwd";
        const rvfc = (
          video as HTMLVideoElement & {
            requestVideoFrameCallback?: (cb: () => void) => number;
          }
        ).requestVideoFrameCallback?.bind(video);
        const stepBack = () => {
          if (video.dataset.dir !== "rev") return;
          if (video.dataset.scrolling !== "1") return;
          const next = video.currentTime - FRAME;
          if (next <= 0) {
            video.currentTime = 0;
            video.dataset.dir = "fwd";
            if (video.dataset.scrolling === "1") video.play().catch(() => {});
            return;
          }
          video.currentTime = next;
          if (rvfc) rvfc(stepBack);
          else requestAnimationFrame(stepBack);
        };
        video.addEventListener("ended", () => {
          video.dataset.dir = "rev";
          stepBack();
        });
        // Resume hook for the velocity controller, called when scroll picks
        // back up while we're already in reverse mode.
        (video as HTMLVideoElement & { __resumeReverse?: () => void }).__resumeReverse = stepBack;

        gsap.fromTo(
          video,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }
  });

  // Lenis velocity drives two things on the category videos:
  //   1) play/pause — videos only play while the user is scrolling, freeze
  //      when the page is idle. Per-video gated by viewport visibility so
  //      only the on-screen clip animates.
  //   2) --scroll-velocity CSS var — soft motion-blur + desaturation that
  //      breathes with the scroll, masking the play/pause transitions.
  const lenis = (window as unknown as { __lenis?: { velocity?: number } }).__lenis;
  const categoryVideos: HTMLVideoElement[] = isDesktop
    ? gsap.utils.toArray<HTMLVideoElement>(".category-bg-video")
    : [];
  const visible = new WeakSet<HTMLVideoElement>();
  if (categoryVideos.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) visible.add(v);
          else { visible.delete(v); v.pause(); }
        }
      },
      { rootMargin: "20% 0px" },
    );
    categoryVideos.forEach((v) => io.observe(v));
  }

  if (lenis) {
    let smoothed = 0;
    const VMAX = 60;
    const PLAY_THRESHOLD = 0.5; // px/frame — anything above counts as scrolling
    gsap.ticker.add(() => {
      const v = Math.abs(lenis.velocity ?? 0);
      const raw = Math.min(v, VMAX) / VMAX;
      smoothed += (raw - smoothed) * 0.18;
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        smoothed.toFixed(3),
      );
      const scrolling = v > PLAY_THRESHOLD;
      for (const vid of categoryVideos) {
        const wasScrolling = vid.dataset.scrolling === "1";
        const shouldPlay = scrolling && visible.has(vid);
        vid.dataset.scrolling = shouldPlay ? "1" : "0";
        if (shouldPlay) {
          if (vid.dataset.dir === "rev") {
            // Kick the reverse walker back into life if it stopped on idle.
            if (!wasScrolling) {
              const resume = (vid as HTMLVideoElement & { __resumeReverse?: () => void }).__resumeReverse;
              resume?.();
            }
          } else if (vid.paused) {
            vid.play().catch(() => {});
          }
        } else if (vid.dataset.dir !== "rev" && !vid.paused) {
          vid.pause();
        }
      }
    });
  }

  // Footer wordmark — backflip the "!" when the footer enters the viewport
  const footerWordmark = document.querySelector<SVGSVGElement>(
    ".vertical-mega-wordmark svg",
  );
  if (footerWordmark) {
    const allPaths = footerWordmark.querySelectorAll("path");
    const circle = footerWordmark.querySelector("circle");
    if (allPaths.length >= 2 && circle) {
      const stem = allPaths[allPaths.length - 1];
      const flipGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      flipGroup.style.transformBox = "fill-box";
      flipGroup.style.transformOrigin = "center center";
      stem.parentNode?.insertBefore(flipGroup, stem);
      flipGroup.appendChild(stem);
      flipGroup.appendChild(circle);
      // 3D context: perspective on the wrapper, preserve-3d on the SVG so the
      // group's CSS rotateX renders with depth instead of being flattened.
      const wrapper = footerWordmark.parentElement;
      if (wrapper) wrapper.style.perspective = "1200px";
      footerWordmark.style.transformStyle = "preserve-3d";
      flipGroup.style.transformStyle = "preserve-3d";
      flipGroup.style.transformBox = "fill-box";
      flipGroup.style.transformOrigin = "50% 50%";

      // GSAP can't drive 3D transforms on SVG <g> via its transform attribute
      // (which is 2D-only). Drive a raw progress tween instead and apply CSS
      // rotateX manually — this works because we set transform-box+origin above.
      const state = { progress: 0 };
      gsap.to(state, {
        progress: 1,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          const angle = state.progress * -360;
          flipGroup.style.transform = `rotateX(${angle}deg)`;
        },
        scrollTrigger: {
          trigger: "#footer-branding",
          start: "top 80%",
          once: true,
        },
      });
    }
  }

  ScrollTrigger.refresh();
}
