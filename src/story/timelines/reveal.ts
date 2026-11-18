import { gsap } from "gsap";

type Targets = gsap.TweenTarget;

/**
 * One tween per element, each starting `each` later. In a scrubbed timeline GSAP's own `stagger` only
 * applies the starting state to the first element up front, so the rest would show before their turn.
 */
export function staggered(
  tl: gsap.core.Timeline,
  targets: ArrayLike<Element>,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  timing: { at: number; each: number },
): void {
  Array.from(targets).forEach((target, i) => tl.fromTo(target, from, to, timing.at + i * timing.each));
}

/** The chapter's label fades in and its headline lines rise out of their masks, starting at `at`. */
export function revealHeading(tl: gsap.core.Timeline, root: Element, at: number): void {
  const heading = root.querySelector("[data-heading]");
  if (!heading) return;
  tl.fromTo(heading.querySelector(".heading__label"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.06 }, at);
  staggered(tl, heading.querySelectorAll(".line > span"), { yPercent: 115 }, { yPercent: 0, duration: 0.1, ease: "power3.out" }, { at, each: 0.025 });
}

/** Rise into place and fade in. */
export function fadeUp(tl: gsap.core.Timeline, targets: Targets, at: number, duration = 0.08, distance = 28): void {
  tl.fromTo(targets, { opacity: 0, y: distance }, { opacity: 1, y: 0, duration, ease: "power2.out" }, at);
}

/** Drift up and fade out, clearing the stage for what comes next. */
export function fadeAway(tl: gsap.core.Timeline, targets: Targets, at: number, duration = 0.08): void {
  tl.to(targets, { opacity: 0, y: "-=40", duration }, at);
}

/** Visible between `from` and `to`, invisible (and unfocusable) outside: for things that take turns on one stage. */
export function showBetween(tl: gsap.core.Timeline, targets: Targets, from: number, to: number, fade = 0.04): void {
  tl.fromTo(targets, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: fade, ease: "power2.out" }, from).to(
    targets,
    { autoAlpha: 0, y: -30, duration: fade },
    to - fade,
  );
}

export const pick = <T extends Element = HTMLElement>(root: Element, attribute: string, name: string): T =>
  root.querySelector<T>(`[data-${attribute}="${name}"]`)!;

export const all = <T extends Element = HTMLElement>(root: Element, selector: string): T[] =>
  gsap.utils.toArray<T>(root.querySelectorAll(selector));
