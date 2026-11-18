import { nodeMorph } from "../interactive/morph";
import { chapterTimeline } from "./chapterTimeline";
import { all, fadeAway, pick, revealHeading, showBetween, staggered } from "./reveal";

/**
 * Chapter 03. Three beats take turns while the diagram follows them:
 * scattered and tangled (understand) → snapped into layers (make it understandable)
 * → lit, labeled bands you can explore (something that works).
 */
export function buildingTimeline(section: HTMLElement): void {
  const system = pick(section, "building", "system");
  const svg = pick<SVGSVGElement>(section, "building", "svg");
  const layers = pick(section, "building", "layers");
  const notes = pick(section, "building", "notes");
  const beats = all(section, "[data-beat]");
  const bands = all<SVGRectElement>(section, ".band");
  const morph = nodeMorph(svg);
  const order = { t: 0 };

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  tl.fromTo(system, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.1 }, 0.06);
  showBetween(tl, beats[0], 0.12, 0.32);
  showBetween(tl, beats[1], 0.34, 0.54);
  tl.fromTo(order, { t: 0 }, { t: 1, duration: 0.16, ease: "power2.inOut", onUpdate: () => morph(order.t) }, 0.36);
  // The last beat stays up while the layers are explorable.
  tl.fromTo(beats[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.56)
    .fromTo([layers, notes], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.62);
  staggered(tl, bands, { opacity: 0 }, { opacity: 1, duration: 0.08 }, { at: 0.56, each: 0.012 });
  fadeAway(tl, [section.querySelector("[data-heading]"), beats[2], system], 0.92);
  morph(0);
}
