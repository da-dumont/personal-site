/*
  Node layouts for the story's diagrams, computed at build time.
  Each node has a `from` (where the story starts it) and a `to` (where it settles).
*/
import { seededRandom } from "./random";

export type Point = [number, number];
export interface LayoutNode {
  from: Point;
  to: Point;
}
export interface LayoutEdge {
  a: number;
  b: number;
}

const point = (p: Point) => p.map((n) => n.toFixed(1)).join(",");
/** Data attributes for a morphing circle (see interactive/morph.ts). */
export const morphAttrs = (node: LayoutNode) => ({
  "data-from": point(node.from),
  "data-to": point(node.to),
  cx: node.to[0].toFixed(1),
  cy: node.to[1].toFixed(1),
});
export const edgeAttrs = (edge: LayoutEdge, nodes: LayoutNode[]) => ({
  "data-a": edge.a,
  "data-b": edge.b,
  x1: nodes[edge.a].to[0].toFixed(1),
  y1: nodes[edge.a].to[1].toFixed(1),
  x2: nodes[edge.b].to[0].toFixed(1),
  y2: nodes[edge.b].to[1].toFixed(1),
});

/**
 * Chapter 03's team network: three teams of people, scattered and disconnected at first,
 * then drawn into tight groups with connections across them.
 */
export function networkLayout() {
  const width = 1000;
  const height = 600;
  const random = seededRandom(11);
  const teams: Point[] = [
    [230, 210],
    [770, 190],
    [520, 450],
  ];
  const perTeam = 7;
  const nodes: LayoutNode[] = teams.flatMap(([cx, cy]) =>
    Array.from({ length: perTeam }, (_, i) => {
      const angle = (i / perTeam) * Math.PI * 2 + random() * 0.4;
      const radius = i === 0 ? 0 : 70 + random() * 35;
      return {
        from: [60 + random() * 880, 50 + random() * 500] as Point,
        to: [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius * 0.8] as Point,
      };
    }),
  );
  const local: LayoutEdge[] = [];
  const cross: LayoutEdge[] = [];
  teams.forEach((_, team) => {
    const lead = team * perTeam;
    for (let i = 1; i < perTeam; i++) {
      local.push({ a: lead, b: lead + i });
      if (i > 1 && random() < 0.5) local.push({ a: lead + i - 1, b: lead + i });
    }
  });
  // Leads connect to each other, plus a few person-to-person links across teams.
  cross.push({ a: 0, b: perTeam }, { a: perTeam, b: 2 * perTeam }, { a: 0, b: 2 * perTeam });
  for (let k = 0; k < 5; k++) {
    const t1 = k % 3;
    const t2 = (k + 1) % 3;
    cross.push({ a: t1 * perTeam + 1 + Math.floor(random() * 6), b: t2 * perTeam + 1 + Math.floor(random() * 6) });
  }
  return { width, height, nodes, local, cross };
}

/** Chapter 04's loop: stages evenly around a circle, the first at the top. */
export function loopLayout(stageCount: number, size = 480, radius = 170) {
  const center = size / 2;
  const angleOf = (i: number) => -Math.PI / 2 + (i / stageCount) * Math.PI * 2;
  const stages = Array.from({ length: stageCount }, (_, i) => {
    const angle = angleOf(i);
    return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });
  return { size, center, radius, stages };
}
