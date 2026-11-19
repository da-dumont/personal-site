import { chapterTimeline } from "./chapterTimeline";
import { all, fadeAway, fadeUp, pick, revealHeading, staggered } from "./reveal";

/** Chapter 07. The light warms, the words arrive slowly, and the small real details follow. */
export function familyTimeline(section: HTMLElement): void {
  const lines = all(section, "[data-family-line]");
  const details = all(section, "[data-family-detail]");

  const tl = chapterTimeline(section);
  tl.fromTo(pick(section, "family", "warmth"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0);
  revealHeading(tl, section, 0.06);
  lines.forEach((line, i) => fadeUp(tl, line, 0.22 + i * 0.12, 0.1));
  staggered(tl, details, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.06 }, { at: 0.48, each: 0.04 });
  fadeAway(tl, [section.querySelector("[data-heading]"), ...lines, ...details], 0.93, 0.06);
}
