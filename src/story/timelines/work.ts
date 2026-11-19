import { chapterTimeline } from "./chapterTimeline";
import { fadeAway, pick, revealHeading } from "./reveal";

/** Chapter 05. Scrolling down carries the career sideways, newest first. */
export function workTimeline(section: HTMLElement): void {
  const track = pick(section, "work", "track");
  const viewport = track.parentElement!;

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  tl.fromTo(track, { x: () => viewport.clientWidth * 0.25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.08 }, 0.04).to(
    track,
    // Arrive by 0.8 so the earliest chapter of the career holds still before the scene moves on.
    { x: () => -(track.scrollWidth - viewport.clientWidth), duration: 0.68 },
    0.12,
  );
  fadeAway(tl, [section.querySelector("[data-heading]"), track], 0.95, 0.05);
}
