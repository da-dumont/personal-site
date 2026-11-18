import { gsap } from "gsap";

/**
 * A timeline scrubbed by a chapter's scroll track: 0 when the chapter's stage takes the screen,
 * 1 when it lets go. Positions inside it read as fractions of the chapter.
 */
export function chapterTimeline(section: HTMLElement): gsap.core.Timeline {
  return gsap.timeline({
    defaults: { ease: "none" },
    // invalidateOnRefresh: tweens with function values (like a horizontal track's width) re-measure on resize.
    scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
  });
}
