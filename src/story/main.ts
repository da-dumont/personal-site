import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ChapterId } from "./content";
import type { ParticleField } from "./scene/ParticleField";
import { startSmoothScroll } from "./motion/smoothScroll";
import { driveScene } from "./motion/sceneDriver";
import { trackChapterProgress } from "./ui/chapterProgress";
import { picker } from "./interactive/picker";
import { intelligenceLoop, type IntelligenceLoop } from "./interactive/loop";
import { introductionTimeline } from "./timelines/introduction";
import { personTimeline } from "./timelines/person";
import { buildingTimeline } from "./timelines/building";
import { leadershipTimeline } from "./timelines/leadership";
import { aiTimeline } from "./timelines/ai";
import { workTimeline } from "./timelines/work";
import { lessonsTimeline } from "./timelines/lessons";
import { familyTimeline } from "./timelines/family";
import { nextTimeline } from "./timelines/next";
import { closingTimeline } from "./timelines/closing";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

interface Explorers {
  loop: IntelligenceLoop | null;
}

/** Each chapter's scroll choreography. Only built when motion is allowed. */
const TIMELINES: Record<ChapterId, (section: HTMLElement, context: { phone: boolean; explorers: Explorers }) => void> = {
  introduction: (section, { phone }) => introductionTimeline(section, { phone }),
  person: personTimeline,
  building: buildingTimeline,
  leadership: leadershipTimeline,
  ai: (section, { explorers }) => explorers.loop && aiTimeline(section, explorers.loop),
  work: workTimeline,
  lessons: lessonsTimeline,
  family: familyTimeline,
  next: nextTimeline,
  closing: closingTimeline,
};

/** The optional interactive pieces. They work with or without motion; scrolling never requires them. */
function startExplorers(animate: boolean): Explorers {
  const layers = document.querySelector<HTMLElement>("[data-building='system']");
  if (layers) picker(layers);
  const loop = document.querySelector<HTMLElement>("[data-ai='loop']");
  return { loop: loop ? intelligenceLoop(loop, { animate }) : null };
}

/**
 * WebGL is an enhancement: without it the CSS atmosphere and all content still render.
 * Three.js loads as its own chunk so the text and scroll choreography never wait for it.
 */
async function createField(): Promise<ParticleField | null> {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-story-canvas]");
  if (!canvas) return null;
  try {
    const { ParticleField } = await import("./scene/ParticleField");
    return new ParticleField(canvas);
  } catch (error) {
    console.warn("Particle field unavailable; using the static atmosphere.", error);
    document.documentElement.classList.add("no-webgl");
    return null;
  }
}

function chapterTimelines(explorers: Explorers): void {
  gsap.matchMedia().add(
    { motion: "(prefers-reduced-motion: no-preference)", phone: "(max-width: 767px)" },
    ({ conditions }) => {
      if (!conditions?.motion) return;
      const phone = Boolean(conditions.phone);
      for (const [id, build] of Object.entries(TIMELINES)) {
        const section = document.getElementById(id);
        if (section) build(section, { phone, explorers });
      }
    },
  );
}

async function boot(): Promise<void> {
  const animate = !matchMedia(REDUCED_MOTION).matches;
  if (animate) startSmoothScroll();
  chapterTimelines(startExplorers(animate));
  trackChapterProgress();
  document.documentElement.classList.add("story-ready");
  driveScene(await createField(), { animate });
}

void boot();
