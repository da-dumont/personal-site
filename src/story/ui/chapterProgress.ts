import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../content";

const pad = (n: number) => String(n).padStart(2, "0");

/** Keeps the "01 / 10 — Introduction" indicator on the chapter in view, and closes the index after a jump. */
export function trackChapterProgress(): void {
  const number = document.querySelector<HTMLElement>("[data-progress-number]");
  const label = document.querySelector<HTMLElement>("[data-progress-label]");
  const index = document.querySelector<HTMLElement>("[data-chapter-index]");
  if (!number || !label) return;

  CHAPTERS.forEach((chapter, i) => {
    const section = document.getElementById(chapter.id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        number.textContent = pad(i + 1);
        label.textContent = chapter.label;
        index?.querySelectorAll("a").forEach((link) => {
          if (link.hash === `#${chapter.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
    });
  });

  index?.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) index.hidePopover();
  });
}
