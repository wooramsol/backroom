const HW = 5;
const M = HW - 0.15;

/** Rectilinear room footprints (orthogonal walls only, reliable collision). */
export function generateShape(rng) {
  const type = rng.pick([
    "rect",
    "l",
    "t",
    "u",
    "z",
    "bay",
    "alcove",
    "step",
    "wide",
    "narrow",
  ]);

  let verts;
  switch (type) {
    case "l":
      verts = [
        [-M, -M],
        [M, -M],
        [M, 0],
        [1, 0],
        [1, M],
        [-M, M],
      ];
      break;
    case "t":
      verts = [
        [-M, -M],
        [M, -M],
        [M, -0.5],
        [1.2, -0.5],
        [1.2, M],
        [-1.2, M],
        [-1.2, -0.5],
        [-M, -0.5],
      ];
      break;
    case "u":
      verts = [
        [-M, -M],
        [M, -M],
        [M, M],
        [1, M],
        [1, -1],
        [-1, -1],
        [-1, M],
        [-M, M],
      ];
      break;
    case "z":
      verts = [
        [-M, -M],
        [M, -M],
        [M, 0],
        [-1, 0],
        [-1, M],
        [M, M],
        [M, 1],
        [-M, 1],
      ];
      break;
    case "bay":
      verts = [
        [-M, -M],
        [M, -M],
        [M, 0],
        [M - 1.5, 0],
        [M - 1.5, M],
        [-M + 1.5, M],
        [-M + 1.5, 0],
        [-M, 0],
      ];
      break;
    case "alcove":
      verts = [
        [-M, -M],
        [M, -M],
        [M, M],
        [0.5, M],
        [0.5, 1],
        [-0.5, 1],
        [-0.5, M],
        [-M, M],
      ];
      break;
    case "step":
      verts = [
        [-M, -M],
        [M, -M],
        [M, -1],
        [0, -1],
        [0, 1],
        [M, 1],
        [M, M],
        [-M, M],
      ];
      break;
    case "wide":
      verts = [
        [-M, -M * 0.7],
        [M, -M * 0.7],
        [M, M * 0.7],
        [-M, M * 0.7],
      ];
      break;
    case "narrow":
      verts = [
        [-M * 0.55, -M],
        [M * 0.55, -M],
        [M * 0.55, M],
        [-M * 0.55, M],
      ];
      break;
    default:
      verts = [
        [-M, -M],
        [M, -M],
        [M, M],
        [-M, M],
      ];
  }

  return { type, verts };
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
  const dx = Math.abs(v1[0] - v0[0]);
  const dz = Math.abs(v1[1] - v0[1]);
  const axis = dx >= dz ? "x" : "z";
  const len = axis === "x" ? dx : dz;
  return { boundary, axis, len, v0, v1 };
}

export function getEdges(verts) {
  const edges = [];
  for (let i = 0; i < verts.length; i++) {
    edges.push(edgeInfo(verts[i], verts[(i + 1) % verts.length]));
  }
  return edges;
}
