import { chapterTimeline } from "./chapterTimeline";
import { all, fadeUp, pick, staggered } from "./reveal";

/**
 * Chapter 09. Near-black; a line of light crosses the screen and settles into a thin horizon,
 * then the name and the last words. The story ends here, so nothing leaves.
 */
export function closingTimeline(section: HTMLElement): void {
  const line = pick(section, "closing", "line");

  const tl = chapterTimeline(section);
  tl.fromTo(line, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.22, ease: "power2.inOut" }, 0.02)
    .to(line, { opacity: 0.25, y: "-34vh", duration: 0.12, ease: "power2.inOut" }, 0.24);
  fadeUp(tl, pick(section, "closing", "name"), 0.3, 0.06);
  staggered(tl, all(section, ".closing__statement .line > span"), { yPercent: 115 }, { yPercent: 0, duration: 0.1, ease: "power3.out" }, { at: 0.34, each: 0.05 });
  fadeUp(tl, pick(section, "closing", "invitation"), 0.54, 0.06);
  fadeUp(tl, pick(section, "closing", "links"), 0.58, 0.06);
}
