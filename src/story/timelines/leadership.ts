import { nodeMorph } from "../interactive/morph";
import { chapterTimeline } from "./chapterTimeline";
import { all, fadeAway, fadeUp, pick, revealHeading, showBetween, staggered } from "./reveal";

/**
 * Chapter 03. A scattered set of people draws together into teams, and the teams connect.
 * Each principle changes the network: Accountability gives every node a ring of ownership,
 * Clarity brightens the connections, Urgency sets signals flowing along them.
 */
export function leadershipTimeline(section: HTMLElement): void {
  const network = pick<SVGSVGElement>(section, "leadership", "network");
  const heading = section.querySelector("[data-heading]");
  const principles = all(section, "[data-principle]");
  const reflection = pick(section, "leadership", "reflection");
  const morph = nodeMorph(network);
  const gather = { t: 0 };

  const tl = chapterTimeline(section);
  revealHeading(tl, section, 0.02);
  tl.fromTo(network, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
    .fromTo(gather, { t: 0 }, { t: 1, duration: 0.18, ease: "power2.inOut", onUpdate: () => morph(gather.t) }, 0.08)
    .to(heading, { autoAlpha: 0, y: -40, duration: 0.05 }, 0.2);
  staggered(tl, all(network, ".network__cross line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.1 }, { at: 0.18, each: 0.01 });

  showBetween(tl, principles[0], 0.24, 0.42);
  // Grow the radius rather than scaling: the rings move with their nodes, so a fixed transform origin would drift.
  staggered(tl, all(network, ".network__rings circle"), { opacity: 0, attr: { r: 2 } }, { opacity: 1, attr: { r: 13 }, duration: 0.08 }, { at: 0.26, each: 0.003 });

  showBetween(tl, principles[1], 0.44, 0.62);
  tl.fromTo(network, { "--edge-alpha": 0.22 }, { "--edge-alpha": 0.7, duration: 0.08 }, 0.46);

  showBetween(tl, principles[2], 0.64, 0.82);
  tl.fromTo(all(network, ".network__flow line"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.66);

  fadeUp(tl, reflection, 0.84, 0.06);
  tl.to(network, { opacity: 0.35, duration: 0.06 }, 0.84);
  fadeAway(tl, [reflection, network], 0.94, 0.05);
  morph(0);
}
