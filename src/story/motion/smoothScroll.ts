import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Smooth scrolling on GSAP's clock, so ScrollTrigger scrubs and Lenis never drift apart. Anchor links glide too. */
export function startSmoothScroll(): Lenis {
  const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
