import { gsap } from "gsap";
import { chapterTimeline } from "./chapterTimeline";
import { pick } from "./reveal";

const part = (root: Element, name: string) => pick(root, "person", name);

/**
 * Chapter 02. The headline rises, then lifts away to become the scene's title while the camera dollies
 * through words placed at different depths. The message lands, and the scene clears for chapter 03.
 */
export function personTimeline(section: HTMLElement): void {
  const headline = part(section, "headline");
  const stage = part(section, "stage");
  const message = part(section, "message");
  const facts = part(section, "facts");
  const words = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-person-word]"));

  const tl = chapterTimeline(section)
    .fromTo(headline.querySelector(".line > span"), { yPercent: 115 }, { yPercent: 0, duration: 0.14, ease: "power3.out" }, 0.02)
    .to(headline, { y: "-30vh", scale: 0.55, opacity: 0.85, duration: 0.2, ease: "power2.inOut" }, 0.24)
    .fromTo(stage, { "--dolly": -420 }, { "--dolly": 180, duration: 0.56 }, 0.1);

  // Words arrive one by one, then clear before the message so it lands in a quiet scene.
  words.forEach((word, i) => {
    tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.18 + i * 0.06).to(word, { opacity: 0, duration: 0.1 }, 0.56);
  });

  tl.fromTo(message, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.62)
    .fromTo(facts, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.72)
    .to([headline, message, facts], { opacity: 0, y: "-=50", duration: 0.08 }, 0.92);
}
