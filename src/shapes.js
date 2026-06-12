const HW = 5;
const EPS = 0.2;

export function boundaryOf(v) {
  if (Math.abs(v[1] + HW) < EPS) return "n";
  if (Math.abs(v[1] - HW) < EPS) return "s";
  if (Math.abs(v[0] + HW) < EPS) return "w";
  if (Math.abs(v[0] - HW) < EPS) return "e";
  return null;
}

/** Classify wall side from edge geometry (corner verts break vertex-only checks). */
export function edgeInfo(v0, v1) {
  const midX = (v0[0] + v1[0]) / 2;
  const midZ = (v0[1] + v1[1]) / 2;

  if (Math.abs(v0[1] - v1[1]) < EPS) {
    if (Math.abs(midZ + HW) < EPS) return { boundary: "n", v0, v1 };
    if (Math.abs(midZ - HW) < EPS) return { boundary: "s", v0, v1 };
  }
  if (Math.abs(v0[0] - v1[0]) < EPS) {
    if (Math.abs(midX + HW) < EPS) return { boundary: "w", v0, v1 };
    if (Math.abs(midX - HW) < EPS) return { boundary: "e", v0, v1 };
  }

  const b0 = boundaryOf(v0);
  const b1 = boundaryOf(v1);
  return { boundary: b0 && b0 === b1 ? b0 : null, v0, v1 };
}

export function getEdges(verts) {
  const edges = [];
  for (let i = 0; i < verts.length; i++) {
    edges.push(edgeInfo(verts[i], verts[(i + 1) % verts.length]));
  }
  return edges;
}
