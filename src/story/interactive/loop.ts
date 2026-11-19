import { gsap } from "gsap";
import { picker } from "./picker";

export interface IntelligenceLoop {
  /** 0..1 around the loop; scroll drives this, and the stage under the signal becomes the chosen one. */
  progress(t: number): void;
}

/**
 * Chapter 04's Understand → Recommend → Act → Measure → Learn loop. A signal travels the ring
 * (leaving a lit trail), and each stage can be chosen directly to read about it.
 */
export function intelligenceLoop(figure: HTMLElement, { animate }: { animate: boolean }): IntelligenceLoop {
  const ring = figure.querySelector<SVGCircleElement>(".loop__ring")!;
  const signal = figure.querySelector<SVGCircleElement>("[data-loop='signal']")!;
  const trail = figure.querySelector<SVGCircleElement>("[data-loop='trail']")!;
  const ids = [...figure.querySelectorAll<HTMLElement>("[data-option]")].map((el) => el.dataset.option ?? "");
  const cx = Number(ring.getAttribute("cx"));
  const cy = Number(ring.getAttribute("cy"));
  const r = Number(ring.getAttribute("r"));

  let shown = 0;
  let stage = 0;
  let syncing = false;

  const place = (t: number) => {
    shown = t;
    const angle = -Math.PI / 2 + t * Math.PI * 2;
    signal.setAttribute("cx", (cx + Math.cos(angle) * r).toFixed(1));
    signal.setAttribute("cy", (cy + Math.sin(angle) * r).toFixed(1));
    trail.style.strokeDashoffset = String(1 - t);
  };

  // A visitor choosing a stage sends the signal there.
  const stages = picker(figure, (id) => {
    if (syncing || !id) return;
    stage = ids.indexOf(id);
    const target = stage / ids.length;
    if (!animate) return place(target);
    const motion = { t: shown };
    gsap.to(motion, { t: target, duration: 0.8, ease: "power3.inOut", onUpdate: () => place(motion.t) });
  });

  return {
    progress(t) {
      place(t);
      const next = Math.round(t * ids.length) % ids.length;
      if (next === stage) return;
      stage = next;
      syncing = true;
      stages.select(ids[next]);
      syncing = false;
    },
  };
}
