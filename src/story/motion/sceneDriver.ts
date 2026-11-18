import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ParticleField } from "../scene/ParticleField";
import { SCENE_KEYS, stateAt, type SceneState } from "../scene/states";

/** Absolute scroll position of each scene key, from its chapter section's scroll range. */
function resolveKeyPositions(): number[] {
  return SCENE_KEYS.map(({ chapter, at }) => {
    const section = document.getElementById(chapter);
    if (!section) throw new Error(`Scene key refers to missing chapter #${chapter}`);
    const start = section.getBoundingClientRect().top + window.scrollY;
    const length = Math.max(section.offsetHeight - window.innerHeight, 1);
    return start + at * length;
  });
}

/** The CSS atmosphere follows the same state, so lighting stays coherent with or without WebGL. */
function applyAtmosphere(state: SceneState): void {
  const style = document.documentElement.style;
  const [r, g, b] = state.glow.color.map((c) => Math.round(c * 255));
  style.setProperty("--glow-x", `${state.glow.x}%`);
  style.setProperty("--glow-y", `${state.glow.y}%`);
  style.setProperty("--glow-rgb", `${r} ${g} ${b}`);
  style.setProperty("--glow-strength", state.glow.strength.toFixed(3));
}

/**
 * Drives the background from scroll position. With `animate`, it also runs ambient motion every frame;
 * without it (reduced motion), it draws a single still frame and redraws only on resize.
 */
export function driveScene(field: ParticleField | null, { animate }: { animate: boolean }): void {
  let positions = resolveKeyPositions();
  let lastScroll = Number.NaN;

  const update = (force = false) => {
    const scroll = animate ? window.scrollY : 0;
    if (!force && scroll === lastScroll) return;
    lastScroll = scroll;
    const state = stateAt(scroll, positions);
    field?.apply(state);
    applyAtmosphere(state);
  };

  ScrollTrigger.addEventListener("refresh", () => {
    positions = resolveKeyPositions();
    field?.resize();
    update(true);
    if (!animate) field?.frame(0);
  });
  update(true);

  if (!animate) {
    if (field) field.reveal = 1;
    field?.frame(0);
    return;
  }

  gsap.ticker.add((_time, deltaMs) => {
    update();
    field?.frame(Math.min(deltaMs, 100) / 1000);
  });
  if (field) bringFieldToLife(field);
}

/** The ribbon emerges from the dark, then follows the pointer on devices that have one. */
function bringFieldToLife(field: ParticleField): void {
  const reveal = { value: 0 };
  gsap.to(reveal, { value: 1, duration: 3.2, delay: 0.2, ease: "power2.inOut", onUpdate: () => (field.reveal = reveal.value) });

  if (!matchMedia("(pointer: fine)").matches) return;
  window.addEventListener("pointermove", (event) =>
    field.pointer({ x: (event.clientX / innerWidth) * 2 - 1, y: 1 - (event.clientY / innerHeight) * 2 }),
  );
  document.documentElement.addEventListener("pointerleave", () => field.pointer(null));
}
