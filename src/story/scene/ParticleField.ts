import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { PALETTE, type SceneState } from "./states";
import { dustVertex, pointFragment, ribbonVertex } from "./shaders";

interface Quality {
  /** Points along and across the ribbon. */
  columns: number;
  rows: number;
  dust: number;
  maxPixelRatio: number;
}

const DESKTOP: Quality = { columns: 520, rows: 72, dust: 1800, maxPixelRatio: 1.75 };
const PHONE: Quality = { columns: 260, rows: 40, dust: 700, maxPixelRatio: 1.5 };
/** Average frame time (ms) above which the field drops to fewer points and a lower pixel ratio. */
const SLOW_FRAME_MS = 24;

/** A second, fainter ribbon that follows the first for depth. */
const ECHO = { offset: [-0.7, 0.4, -1.4], amp: 0.8, width: 0.5, opacity: 0.5, phase: 2.1, roll: 0.08 } as const;

/** 0..n-1 in random order, so any leading slice of the points is an even thinning of the whole. */
function shuffledIndices(n: number): Uint32Array {
  const order = Uint32Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function ribbonGeometry(columns: number, rows: number): BufferGeometry {
  const count = columns * rows;
  const grid = new Float32Array(count * 2);
  const random = new Float32Array(count);
  const order = shuffledIndices(count);
  for (let i = 0; i < count; i++) {
    const col = order[i] % columns;
    const row = Math.floor(order[i] / columns);
    grid[i * 2] = (col / (columns - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.002;
    grid[i * 2 + 1] = (row / (rows - 1)) * 2 - 1;
    random[i] = Math.random();
  }
  const geometry = new BufferGeometry();
  // three needs a position attribute to size the draw call; the shader positions points from aGrid.
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aGrid", new BufferAttribute(grid, 2));
  geometry.setAttribute("aRandom", new BufferAttribute(random, 1));
  return geometry;
}

function dustGeometry(count: number): BufferGeometry {
  const position = new Float32Array(count * 3);
  const random = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    position[i * 3] = (Math.random() - 0.5) * 30;
    position[i * 3 + 1] = (Math.random() - 0.5) * 14;
    position[i * 3 + 2] = -Math.random() * 18 + 2;
    random[i] = Math.random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aRandom", new BufferAttribute(random, 1));
  return geometry;
}

function pointsMaterial(vertexShader: string, uniforms: Record<string, { value: unknown }>): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader: pointFragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

function ribbonUniforms(pixelRatio: number, phase: number, opacity: number) {
  return {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uAmp: { value: 0.5 },
    uFreq: { value: 0.5 },
    uTwist: { value: 1 },
    uWidth: { value: 1 },
    uPhase: { value: phase },
    uSize: { value: 26 },
    uPixelRatio: { value: pixelRatio },
    uOpacity: { value: opacity },
    uPointer: { value: new Vector2(9, 9) },
    uPointerStrength: { value: 0 },
    uColorA: { value: new Color() },
    uColorB: { value: new Color() },
    uColorC: { value: new Color() },
    uWarmColor: { value: new Color(...PALETTE.amber) },
    uWarm: { value: 0 },
  };
}

/**
 * The story's luminous particle field: two twisting ribbons and distant dust, drawn as GPU points.
 * It knows nothing about scroll or chapters; callers hand it a SceneState and drive time.
 */
export class ParticleField {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(35, 1, 0.1, 100);
  private readonly ribbon: Points<BufferGeometry, ShaderMaterial>;
  private readonly echo: Points<BufferGeometry, ShaderMaterial>;
  private readonly dust: Points<BufferGeometry, ShaderMaterial>;
  private quality: Quality;
  private pixelRatio: number;
  private time = 0;
  private speed = 0.3;
  private pointerStrength = 0;
  private pointerTarget = 0;
  private frameSamples: number[] = [];
  private degraded = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.quality = matchMedia("(max-width: 767px)").matches ? PHONE : DESKTOP;
    this.pixelRatio = Math.min(devicePixelRatio, this.quality.maxPixelRatio);

    const ribbonGeo = ribbonGeometry(this.quality.columns, this.quality.rows);
    this.ribbon = new Points(ribbonGeo, pointsMaterial(ribbonVertex, ribbonUniforms(this.pixelRatio, 0, 1)));
    this.echo = new Points(
      ribbonGeometry(Math.round(this.quality.columns * 0.6), Math.round(this.quality.rows * 0.5)),
      pointsMaterial(ribbonVertex, ribbonUniforms(this.pixelRatio, ECHO.phase, ECHO.opacity)),
    );
    this.dust = new Points(
      dustGeometry(this.quality.dust),
      pointsMaterial(dustVertex, {
        uTime: { value: 0 },
        uSize: { value: 22 },
        uPixelRatio: { value: this.pixelRatio },
        uOpacity: { value: 0.5 },
        uColor: { value: new Color(...PALETTE.cyan).lerp(new Color(1, 1, 1), 0.4) },
      }),
    );
    for (const points of [this.ribbon, this.echo, this.dust]) points.frustumCulled = false;
    this.scene.add(this.dust, this.echo, this.ribbon);
    this.resize();
  }

  /** 0..1: how much of the ribbon has emerged from the dark. */
  set reveal(value: number) {
    this.ribbon.material.uniforms.uReveal.value = value;
    this.echo.material.uniforms.uReveal.value = value;
  }

  apply(state: SceneState): void {
    this.camera.position.set(...state.camera);
    this.camera.lookAt(...state.target);
    this.speed = state.speed;

    this.ribbon.position.set(...state.offset);
    this.ribbon.rotation.z = state.roll;
    this.echo.position.set(
      state.offset[0] + ECHO.offset[0],
      state.offset[1] + ECHO.offset[1],
      state.offset[2] + ECHO.offset[2],
    );
    this.echo.rotation.z = state.roll + ECHO.roll;

    for (const [points, amp, width, opacity] of [
      [this.ribbon, 1, 1, 1],
      [this.echo, ECHO.amp, ECHO.width, ECHO.opacity],
    ] as const) {
      const u = points.material.uniforms;
      u.uOpacity.value = state.opacity * opacity;
      u.uAmp.value = state.amp * amp;
      u.uFreq.value = state.freq;
      u.uTwist.value = state.twist;
      u.uWidth.value = state.width * width;
      u.uWarm.value = state.warm;
      (u.uColorA.value as Color).setRGB(...state.colorA);
      (u.uColorB.value as Color).setRGB(...state.colorB);
      (u.uColorC.value as Color).setRGB(...state.colorC);
    }
    this.dust.material.uniforms.uOpacity.value = state.dust;
  }

  /** Pointer in normalized device coordinates, or null when it leaves the window. */
  pointer(ndc: { x: number; y: number } | null): void {
    this.pointerTarget = ndc ? 1 : 0;
    if (!ndc) return;
    for (const points of [this.ribbon, this.echo]) (points.material.uniforms.uPointer.value as Vector2).set(ndc.x, ndc.y);
  }

  /** Advance ambient motion by dt seconds and draw. Pass 0 to redraw without motion. */
  frame(dt: number): void {
    const start = performance.now();
    this.time += dt * this.speed;
    this.pointerStrength += (this.pointerTarget - this.pointerStrength) * Math.min(1, dt * 3);
    for (const points of [this.ribbon, this.echo]) {
      points.material.uniforms.uTime.value = this.time;
      points.material.uniforms.uPointerStrength.value = this.pointerStrength;
    }
    this.dust.material.uniforms.uTime.value = this.time / this.speed;
    this.renderer.render(this.scene, this.camera);
    if (dt > 0) this.watchFrameTime(performance.now() - start, dt * 1000);
  }

  resize(): void {
    const { clientWidth: width, clientHeight: height } = this.canvas;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Keep the ribbon's length on screen as the viewport narrows.
    this.camera.fov = width < height ? 52 : 35;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    for (const points of [this.ribbon, this.echo, this.dust]) {
      points.geometry.dispose();
      points.material.dispose();
    }
    this.renderer.dispose();
  }

  /** After two seconds of slow frames, draw fewer points at a lower pixel ratio. Happens at most once. */
  private watchFrameTime(renderMs: number, frameMs: number): void {
    // Ignore the long gaps from background tabs and scroll jumps; they say nothing about rendering cost.
    if (this.degraded || frameMs > 100) return;
    this.frameSamples.push(Math.max(renderMs, frameMs));
    if (this.frameSamples.length < 120) return;
    const average = this.frameSamples.reduce((a, b) => a + b, 0) / this.frameSamples.length;
    this.frameSamples = [];
    if (average < SLOW_FRAME_MS) return;
    this.degraded = true;
    this.pixelRatio = 1;
    for (const points of [this.ribbon, this.echo, this.dust]) {
      points.material.uniforms.uPixelRatio.value = 1;
      points.geometry.setDrawRange(0, Math.floor(points.geometry.attributes.aRandom.count * 0.6));
    }
    this.resize();
  }
}
