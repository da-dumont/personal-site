import { gsap } from "gsap";
import { chapterTimeline } from "./chapterTimeline";
import { pick } from "./reveal";

const part = (root: Element, name: string) => pick(root, "intro", name);

/**
 * Chapter 01. On load: the name and statement rise out of their lines.
 * On scroll (the section is a tall sticky stage): the portrait emerges from the dark, the type settles back,
 * the supporting copy arrives, then everything recedes as chapter 02 takes over.
 */
export function introductionTimeline(section: HTMLElement, { phone }: { phone: boolean }): void {
  const copy = part(section, "copy");
  const portrait = part(section, "portrait");
  const supporting = part(section, "supporting");
  const cue = part(section, "cue");

  gsap
    .timeline({ delay: 0.35, defaults: { ease: "expo.out" } })
    .from(part(section, "name"), { opacity: 0, y: 14, duration: 1.2 })
    .from(section.querySelectorAll("[data-intro-line] > span"), { yPercent: 115, duration: 1.4, stagger: 0.12 }, "-=0.9")
    .from(part(section, "cue-inner"), { opacity: 0, duration: 1 }, "-=0.6");

  chapterTimeline(section)
    .fromTo(cue, { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0)
    .fromTo(
      portrait,
      { clipPath: "inset(100% 0% 0% 0%)", yPercent: 8, scale: 1.06, filter: "brightness(0.25)" },
      { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, scale: 1, filter: "brightness(1)", duration: 0.45, ease: "power2.out" },
      0.02,
    )
    .fromTo(copy, { y: 0, scale: 1 }, { y: phone ? 0 : "-3vh", scale: phone ? 1 : 0.94, duration: 0.45 }, 0.02)
    .fromTo(supporting, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.34)
    .to(copy, { opacity: 0, y: -70, duration: 0.18 }, 0.82)
    .to(supporting, { opacity: 0, y: -40, duration: 0.15 }, 0.84)
    .to(portrait, { scale: 0.84, yPercent: -4, opacity: 0, duration: 0.18 }, 0.82);

  // The bar's wordmark takes over once the name on screen has gone.
  const wordmark = document.querySelector("[data-wordmark]");
  if (wordmark) {
    gsap.fromTo(
      wordmark,
      { opacity: 0 },
      { opacity: 1, ease: "none", scrollTrigger: { trigger: section, start: "75% bottom", end: "85% bottom", scrub: true } },
    );
  }
}
