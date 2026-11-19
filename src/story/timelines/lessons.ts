import { chapterTimeline } from "./chapterTimeline";
import { all, revealHeading, showBetween } from "./reveal";

/** Chapter 06. Quiet: one statement at a time holds the screen, then gives way to the next. */
export function lessonsTimeline(section: HTMLElement): void {
  const statements = all(section, "[data-statement]");
  const start = 0.14;
  const span = (0.98 - start) / statements.length;

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  tl.to(section.querySelector("[data-heading]"), { autoAlpha: 0, y: -40, duration: 0.03 }, 0.11);
  statements.forEach((statement, i) => {
    const from = start + i * span;
    showBetween(tl, statement, from, from + span, 0.03);
    tl.fromTo(statement.lastElementChild, { opacity: 0 }, { opacity: 1, duration: 0.03 }, from + 0.03);
  });
}
