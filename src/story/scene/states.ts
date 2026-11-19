import type { ChapterId } from "../content";

type Vec3 = [number, number, number];

/** Everything the background needs to know at one moment of the story. All fields interpolate. */
export interface SceneState {
  camera: Vec3;
  target: Vec3;
  /** Where the main ribbon sits, and its roll (radians). */
  offset: Vec3;
  roll: number;
  /** 0..1 how visible the ribbon is; quiet chapters dim it. */
  opacity: number;
  amp: number;
  freq: number;
  twist: number;
  width: number;
  speed: number;
  /** Colors as linear-ish RGB 0..1: core, edge, highlight. */
  colorA: Vec3;
  colorB: Vec3;
  colorC: Vec3;
  /** 0..1 amount of warm amber light on the crests. */
  warm: number;
  dust: number;
  /** CSS atmosphere: glow center in % of the viewport, color and strength. */
  glow: { x: number; y: number; color: Vec3; strength: number };
}

/** A state pinned to a point in a chapter's scroll (0 = chapter top reaches viewport top, 1 = its end). */
export interface SceneKey {
  chapter: ChapterId;
  at: number;
  state: SceneState;
}

const hex = (value: string): Vec3 => {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const PALETTE = {
  blue: hex("#3B82F6"),
  cyan: hex("#22D3EE"),
  violet: hex("#9B7CFF"),
  amber: hex("#FF9B54"),
} as const;

const opening: SceneState = {
  camera: [0, 0.2, 9],
  target: [0, 0, 0],
  offset: [0, -1.25, 0],
  roll: -0.1,
  opacity: 1,
  amp: 0.5,
  freq: 0.55,
  twist: 1.1,
  width: 0.85,
  speed: 0.32,
  colorA: PALETTE.blue,
  colorB: PALETTE.violet,
  colorC: PALETTE.cyan,
  warm: 0.12,
  dust: 0.45,
  glow: { x: 28, y: 72, color: PALETTE.blue, strength: 0.55 },
};

const behindPortrait: SceneState = {
  ...opening,
  camera: [0.5, 0.15, 8.4],
  offset: [1.6, -0.55, -1.6],
  roll: -0.3,
  amp: 0.62,
  twist: 1.5,
  width: 1.05,
  warm: 0.22,
  glow: { x: 72, y: 46, color: PALETTE.violet, strength: 0.7 },
};

const pulledBack: SceneState = {
  ...behindPortrait,
  camera: [0, 0.9, 12.5],
  target: [0, 0.2, 0],
  offset: [0, -0.15, -2.4],
  roll: -0.05,
  amp: 0.95,
  freq: 0.48,
  twist: 2.3,
  width: 1.5,
  speed: 0.26,
  colorA: PALETTE.cyan,
  colorB: PALETTE.blue,
  colorC: PALETTE.violet,
  warm: 0.08,
  dust: 0.9,
  glow: { x: 50, y: 42, color: PALETTE.cyan, strength: 0.4 },
};

const drifting: SceneState = {
  ...pulledBack,
  camera: [-0.9, 1.3, 11.5],
  offset: [0.4, 0.1, -2.8],
  roll: 0.12,
  twist: 2.8,
  glow: { x: 40, y: 58, color: PALETTE.blue, strength: 0.45 },
};

/** Chapter 03: the network carries the scene; the ribbon steps back. */
const network: SceneState = {
  ...drifting,
  camera: [0, 0.6, 12],
  target: [0, 0, 0],
  offset: [0, -2.6, -4],
  roll: 0,
  opacity: 0.3,
  amp: 0.5,
  freq: 0.35,
  twist: 1.2,
  width: 1.4,
  speed: 0.2,
  colorA: PALETTE.blue,
  colorB: PALETTE.cyan,
  colorC: PALETTE.blue,
  dust: 0.7,
  glow: { x: 50, y: 50, color: PALETTE.violet, strength: 0.35 },
};

/** Chapter 04: dense, complex, close: the camera moves into the system. */
const intelligence: SceneState = {
  ...network,
  camera: [0, 0.3, 6.2],
  target: [0, 0, -1],
  offset: [0, -0.2, -1.5],
  roll: 0.18,
  opacity: 1,
  amp: 1.15,
  freq: 0.75,
  twist: 3.6,
  width: 1.9,
  speed: 0.45,
  colorA: PALETTE.violet,
  colorB: PALETTE.cyan,
  colorC: PALETTE.blue,
  warm: 0.05,
  dust: 1.2,
  glow: { x: 35, y: 50, color: PALETTE.violet, strength: 0.6 },
};

/** Chapter 05: calm and low, out of the way of the career panels. */
const horizon: SceneState = {
  ...intelligence,
  camera: [0, 0.4, 10],
  target: [0, 0, 0],
  offset: [0, -2.8, -2],
  roll: -0.04,
  opacity: 0.55,
  amp: 0.45,
  freq: 0.5,
  twist: 1,
  width: 1.1,
  speed: 0.25,
  colorA: PALETTE.blue,
  colorB: PALETTE.violet,
  dust: 0.6,
  glow: { x: 60, y: 80, color: PALETTE.blue, strength: 0.35 },
};

/** Chapter 06: almost dark. A few faint lights remain. */
const quiet: SceneState = {
  ...horizon,
  opacity: 0.08,
  speed: 0.12,
  dust: 0.3,
  glow: { x: 50, y: 50, color: PALETTE.blue, strength: 0.12 },
};

/** Chapter 07: warm and slow. */
const warm: SceneState = {
  ...horizon,
  camera: [0, 0.2, 9.5],
  offset: [0.6, -1.9, -2],
  roll: 0.06,
  opacity: 0.55,
  amp: 0.4,
  twist: 0.8,
  speed: 0.14,
  colorA: PALETTE.amber,
  colorB: PALETTE.violet,
  colorC: PALETTE.amber,
  warm: 1,
  dust: 0.35,
  glow: { x: 32, y: 60, color: PALETTE.amber, strength: 0.6 },
};

/** Chapter 08: the opening ribbon returns, carrying a little of everything since. */
const evolved: SceneState = {
  ...opening,
  camera: [0, 0.5, 9.5],
  offset: [0, -1.1, -1],
  roll: -0.08,
  amp: 0.75,
  freq: 0.62,
  twist: 2.4,
  width: 1.4,
  speed: 0.34,
  colorA: PALETTE.cyan,
  colorB: PALETTE.violet,
  colorC: PALETTE.blue,
  warm: 0.35,
  dust: 0.8,
  glow: { x: 60, y: 40, color: PALETTE.cyan, strength: 0.45 },
};

/** Chapter 09: everything converges into a thin line of light, low, beneath the last words. */
const converged: SceneState = {
  ...evolved,
  camera: [0, 0, 10],
  target: [0, 0, 0],
  offset: [0, -2.7, 0],
  roll: 0,
  opacity: 0.6,
  amp: 0.08,
  twist: 0,
  width: 0.06,
  speed: 0.2,
  warm: 0.2,
  dust: 0.2,
  glow: { x: 50, y: 50, color: PALETTE.blue, strength: 0.2 },
};

/** The story's light, keyed to scroll. Keys must be in page order. */
export const SCENE_KEYS: readonly SceneKey[] = [
  { chapter: "introduction", at: 0, state: opening },
  { chapter: "introduction", at: 0.55, state: behindPortrait },
  { chapter: "introduction", at: 0.8, state: behindPortrait },
  { chapter: "person", at: 0.15, state: pulledBack },
  { chapter: "person", at: 0.9, state: drifting },
  { chapter: "leadership", at: 0.15, state: network },
  { chapter: "leadership", at: 0.9, state: network },
  { chapter: "ai", at: 0.2, state: intelligence },
  { chapter: "ai", at: 0.9, state: { ...intelligence, camera: [0.4, 0.2, 4.8] } },
  { chapter: "work", at: 0.15, state: horizon },
  { chapter: "work", at: 0.9, state: horizon },
  { chapter: "lessons", at: 0.1, state: quiet },
  { chapter: "lessons", at: 0.95, state: quiet },
  { chapter: "family", at: 0.2, state: warm },
  { chapter: "family", at: 0.85, state: warm },
  { chapter: "next", at: 0.15, state: evolved },
  { chapter: "next", at: 0.9, state: evolved },
  { chapter: "closing", at: 0.25, state: converged },
];

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export function mixStates(a: SceneState, b: SceneState, t: number): SceneState {
  return {
    camera: mix3(a.camera, b.camera, t),
    target: mix3(a.target, b.target, t),
    offset: mix3(a.offset, b.offset, t),
    roll: mix(a.roll, b.roll, t),
    opacity: mix(a.opacity, b.opacity, t),
    amp: mix(a.amp, b.amp, t),
    freq: mix(a.freq, b.freq, t),
    twist: mix(a.twist, b.twist, t),
    width: mix(a.width, b.width, t),
    speed: mix(a.speed, b.speed, t),
    colorA: mix3(a.colorA, b.colorA, t),
    colorB: mix3(a.colorB, b.colorB, t),
    colorC: mix3(a.colorC, b.colorC, t),
    warm: mix(a.warm, b.warm, t),
    dust: mix(a.dust, b.dust, t),
    glow: {
      x: mix(a.glow.x, b.glow.x, t),
      y: mix(a.glow.y, b.glow.y, t),
      color: mix3(a.glow.color, b.glow.color, t),
      strength: mix(a.glow.strength, b.glow.strength, t),
    },
  };
}

/**
 * The state at an absolute scroll position, given each key's resolved scroll position.
 * Pure function of scroll, so scrolling backward, jumping or reloading always lands on the same frame.
 */
export function stateAt(scroll: number, positions: readonly number[]): SceneState {
  const keys = SCENE_KEYS;
  if (scroll <= positions[0]) return keys[0].state;
  for (let i = 1; i < keys.length; i++) {
    if (scroll <= positions[i]) {
      const span = positions[i] - positions[i - 1] || 1;
      const t = (scroll - positions[i - 1]) / span;
      return mixStates(keys[i - 1].state, keys[i].state, t * t * (3 - 2 * t));
    }
  }
  return keys[keys.length - 1].state;
}
