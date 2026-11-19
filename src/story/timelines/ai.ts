import type { IntelligenceLoop } from "../interactive/loop";
import { chapterTimeline } from "./chapterTimeline";
import { fadeAway, fadeUp, pick, revealHeading } from "./reveal";

/**
 * Chapter 04, in three movements on one stage: the shift in how we build; the intelligence loop,
 * with scroll carrying a signal once around it; then Catalyst, what exists now and where it's going.
 */
export function aiTimeline(section: HTMLElement, loop: IntelligenceLoop): void {
  const intro = pick(section, "ai", "intro");
  const figure = pick(section, "ai", "loop");
  const catalyst = pick(section, "ai", "catalyst");
  const around = { t: 0 };

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  fadeUp(tl, pick(section, "ai", "turn"), 0.1);
  fadeUp(tl, pick(section, "ai", "shift"), 0.17);
  tl.to(intro, { autoAlpha: 0, y: -40, duration: 0.05 }, 0.3)
    .fromTo(figure, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.06 }, 0.32)
    .fromTo(around, { t: 0 }, { t: 1, duration: 0.38, onUpdate: () => loop.progress(around.t) }, 0.36)
    .to(figure, { autoAlpha: 0, y: -40, duration: 0.05 }, 0.76)
    .fromTo(catalyst, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.78);
  // "Now" lands first; "where it's going" follows, so the two never read as one claim.
  fadeUp(tl, catalyst.children[0], 0.78, 0.06);
  fadeUp(tl, catalyst.children[1], 0.85, 0.06);
  fadeAway(tl, catalyst, 0.94, 0.05);
}
