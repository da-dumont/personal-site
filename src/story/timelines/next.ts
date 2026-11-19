import { chapterTimeline } from "./chapterTimeline";
import { all, fadeAway, fadeUp, pick, revealHeading, staggered } from "./reveal";

/** Chapter 08. What I'm exploring arrives item by item; then the writing takes the stage. */
export function nextTimeline(section: HTMLElement): void {
  const exploring = pick(section, "next", "exploring");
  const writing = pick(section, "next", "writing");

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  fadeUp(tl, pick(section, "next", "turn"), 0.1);
  staggered(tl, all(section, "[data-next-item]"), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.05 }, { at: 0.16, each: 0.035 });
  tl.to(exploring, { autoAlpha: 0, y: -40, duration: 0.05 }, 0.48)
    .fromTo(writing, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.52);
  staggered(tl, all(writing, ".writing__list li"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.05 }, { at: 0.54, each: 0.03 });
  fadeAway(tl, writing, 0.93, 0.06);
}
