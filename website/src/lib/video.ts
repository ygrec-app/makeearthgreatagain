import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initCategoryVideos(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>("[data-category-video]");
  videos.forEach((video) => {
    video.removeAttribute("autoplay");
    video.muted = true;
    video.playsInline = true;
    video.pause();

    const trigger = video.closest(".category-row") ?? video;

    ScrollTrigger.create({
      trigger,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => void video.play().catch(() => {}),
      onEnterBack: () => void video.play().catch(() => {}),
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });
  });
}
