const HW = 5;
const M = HW - 0.1;

/**
 * Every shape uses the full cell boundary so all 4 doors stay connected.
 * Variety comes from non-blocking interior decor.
 */
export function generateShape(rng) {
  const decor = rng.pick([
    "plain",
    "pillars",
    "mat",
    "corner_nw",
    "corner_se",
    "cross",
    "island",
  ]);

  const verts = [
    [-M, -M],
    [M, -M],
    [M, M],
    [-M, M],
  ];

  let decorData = { type: "none" };

  switch (decor) {
    case "pillars":
      decorData = {
        type: "pillars",
        posts: [
          { x: -3, z: -3 },
          { x: 3, z: -3 },
          { x: -3, z: 3 },
          { x: 3, z: 3 },
        ],
      };
      break;
    case "mat":
      decorData = { type: "mat", size: rng.range(3, 5) };
      break;
    case "corner_nw":
      decorData = { type: "corner", x: -3.2, z: -3.2, w: 2.5, d: 2.5 };
      break;
    case "corner_se":
      decorData = { type: "corner", x: 3.2, z: 3.2, w: 2.5, d: 2.5 };
      break;
    case "cross":
      decorData = { type: "cross", w: 0.35, len: 3.8 };
      break;
    case "island":
      decorData = { type: "island", x: rng.range(-1, 1), z: rng.range(-1, 1), w: 2, d: 1.2 };
      break;
    default:
      decorData = { type: "none" };
  }

  return { type: decor, verts, decor: decorData };
}

const EPS = 0.2;

export function boundaryOf(v) {
  if (Math.abs(v[1] + HW) < EPS) return "n";
  if (Math.abs(v[1] - HW) < EPS) return "s";
  if (Math.abs(v[0] + HW) < EPS) return "w";
  if (Math.abs(v[0] - HW) < EPS) return "e";
  return null;
}

export function edgeInfo(v0, v1) {
  const b0 = boundaryOf(v0);
  const b1 = boundaryOf(v1);
  const boundary = b0 && b0 === b1 ? b0 : null;
  return { boundary, v0, v1 };
}

export function getEdges(verts) {
  const edges = [];
  for (let i = 0; i < verts.length; i++) {
    edges.push(edgeInfo(verts[i], verts[(i + 1) % verts.length]));
  }
  return edges;
}
