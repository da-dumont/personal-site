/*
  Diagrams whose nodes move between two layouts. The markup renders the final layout (so it reads
  correctly without JS) and records both: circles carry data-from / data-to ("x,y"), lines name the
  two nodes they join with data-a / data-b (indexes into the data-node list).
*/

type Point = [number, number];

const parse = (value: string | undefined): Point => {
  const [x, y] = (value ?? "0,0").split(",").map(Number);
  return [x, y];
};

/** Returns a setter: 0 puts every node at its `from` position, 1 at its `to` position. */
export function nodeMorph(svg: SVGElement): (t: number) => void {
  const nodes = [...svg.querySelectorAll<SVGCircleElement>("[data-node]")].map((el) => ({
    from: parse(el.dataset.from),
    to: parse(el.dataset.to),
  }));
  const circles = [...svg.querySelectorAll<SVGCircleElement>("circle[data-from]")].map((el) => ({
    el,
    from: parse(el.dataset.from),
    to: parse(el.dataset.to),
  }));
  const lines = [...svg.querySelectorAll<SVGLineElement>("line[data-a]")].map((el) => ({
    el,
    a: Number(el.dataset.a),
    b: Number(el.dataset.b),
  }));
  const at = (p: { from: Point; to: Point }, t: number): Point => [
    p.from[0] + (p.to[0] - p.from[0]) * t,
    p.from[1] + (p.to[1] - p.from[1]) * t,
  ];

  return (t) => {
    for (const circle of circles) {
      const [x, y] = at(circle, t);
      circle.el.setAttribute("cx", x.toFixed(1));
      circle.el.setAttribute("cy", y.toFixed(1));
    }
    for (const line of lines) {
      const [x1, y1] = at(nodes[line.a], t);
      const [x2, y2] = at(nodes[line.b], t);
      line.el.setAttribute("x1", x1.toFixed(1));
      line.el.setAttribute("y1", y1.toFixed(1));
      line.el.setAttribute("x2", x2.toFixed(1));
      line.el.setAttribute("y2", y2.toFixed(1));
    }
  };
}
