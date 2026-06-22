import { WALL_T } from "../../constants.js";

const EPS = 1e-5;

/** Axis-aligned wall run → solid footprint rectangle in chunk XZ (metres). */
export function segmentToRect(seg) {
  const half = WALL_T / 2;
  if (seg.axis === "z") {
    return {
      x0: seg.span0,
      x1: seg.span1,
      z0: seg.pos - half,
      z1: seg.pos + half,
    };
  }
  return {
    x0: seg.pos - half,
    x1: seg.pos + half,
    z0: seg.span0,
    z1: seg.span1,
  };
}

function pointInRect(px, pz, r) {
  return px > r.x0 + EPS && px < r.x1 - EPS && pz > r.z0 + EPS && pz < r.z1 - EPS;
}

/**
 * Exact union of orthogonal wall rectangles via coordinate subdivision.
 * Overlapping corners merge into one solid footprint — no pillar protrusions.
 */
export function unionFootprint(rects) {
  if (!rects.length) return [];

  const xs = new Set();
  const zs = new Set();
  for (const r of rects) {
    xs.add(r.x0);
    xs.add(r.x1);
    zs.add(r.z0);
    zs.add(r.z1);
  }

  const xArr = [...xs].sort((a, b) => a - b);
  const zArr = [...zs].sort((a, b) => a - b);

  const cells = [];
  for (let i = 0; i < xArr.length - 1; i++) {
    for (let j = 0; j < zArr.length - 1; j++) {
      const x0 = xArr[i];
      const x1 = xArr[i + 1];
      const z0 = zArr[j];
      const z1 = zArr[j + 1];
      if (x1 - x0 < EPS || z1 - z0 < EPS) continue;
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      if (rects.some((r) => pointInRect(cx, cz, r))) {
        cells.push({ x0, x1, z0, z1 });
      }
    }
  }

  return mergeCells(cells);
}

function mergeCells(cells) {
  if (!cells.length) return [];

  const used = new Set();
  const merged = [];

  const key = (c) => `${c.x0},${c.z0},${c.x1},${c.z1}`;

  for (const start of cells) {
    if (used.has(key(start))) continue;

    let cur = { ...start };
    used.add(key(cur));

    let grew = true;
    while (grew) {
      grew = false;
      for (const c of cells) {
        const k = key(c);
        if (used.has(k)) continue;
        if (Math.abs(c.z0 - cur.z0) < EPS && Math.abs(c.z1 - cur.z1) < EPS) {
          if (Math.abs(c.x0 - cur.x1) < EPS) {
            cur.x1 = c.x1;
            used.add(k);
            grew = true;
          } else if (Math.abs(c.x1 - cur.x0) < EPS) {
            cur.x0 = c.x0;
            used.add(k);
            grew = true;
          }
        }
        if (Math.abs(c.x0 - cur.x0) < EPS && Math.abs(c.x1 - cur.x1) < EPS) {
          if (Math.abs(c.z0 - cur.z1) < EPS) {
            cur.z1 = c.z1;
            used.add(k);
            grew = true;
          } else if (Math.abs(c.z1 - cur.z0) < EPS) {
            cur.z0 = c.z0;
            used.add(k);
            grew = true;
          }
        }
      }
    }
    merged.push(cur);
  }

  return merged;
}

function edgeKey(x0, z0, x1, z1) {
  const ax = x0.toFixed(5);
  const az = z0.toFixed(5);
  const bx = x1.toFixed(5);
  const bz = z1.toFixed(5);
  if (ax > bx || (ax === bx && az > bz)) return `${bx},${bz},${ax},${az}`;
  return `${ax},${az},${bx},${bz}`;
}

/**
 * Undirected boundary edges of the solid footprint (internal edges cancel).
 * Each edge is a wall face at constant thickness — includes end caps and corners.
 */
export function footprintOutlineEdges(cells) {
  const counts = new Map();
  const directed = new Map();

  const add = (x0, z0, x1, z1) => {
    if (Math.hypot(x1 - x0, z1 - z0) < EPS) return;
    const k = edgeKey(x0, z0, x1, z1);
    const prev = counts.get(k) || 0;
    counts.set(k, prev + 1);
    if (prev === 0) directed.set(k, { x0, z0, x1, z1 });
  };

  for (const c of cells) {
    add(c.x0, c.z0, c.x1, c.z0);
    add(c.x1, c.z0, c.x1, c.z1);
    add(c.x1, c.z1, c.x0, c.z1);
    add(c.x0, c.z1, c.x0, c.z0);
  }

  const edges = [];
  for (const [k, n] of counts) {
    if (n !== 1) continue;
    edges.push(directed.get(k));
  }
  return edges;
}

const ptKey = (x, z) => `${x.toFixed(5)},${z.toFixed(5)}`;

function edgeAxis(e) {
  if (Math.abs(e.z1 - e.z0) < EPS) return "h";
  if (Math.abs(e.x1 - e.x0) < EPS) return "v";
  return null;
}

/** Merge collinear boundary segments that share an endpoint (grid subdivision artifacts). */
function mergeCollinearEdges(edges) {
  let list = edges.map((e) => ({ x0: e.x0, z0: e.z0, x1: e.x1, z1: e.z1 }));
  let changed = true;

  while (changed) {
    changed = false;
    const adj = new Map();
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      const sk = ptKey(e.x0, e.z0);
      const ek = ptKey(e.x1, e.z1);
      if (!adj.has(sk)) adj.set(sk, []);
      if (!adj.has(ek)) adj.set(ek, []);
      adj.get(sk).push(i);
      adj.get(ek).push(i);
    }

    outer: for (const [pk, idxs] of adj) {
      if (idxs.length !== 2) continue;
      const [i, j] = idxs;
      const a = list[i];
      const b = list[j];
      const axis = edgeAxis(a);
      if (!axis || axis !== edgeAxis(b)) continue;

      const uniq = new Map();
      for (const [x, z] of [
        [a.x0, a.z0],
        [a.x1, a.z1],
        [b.x0, b.z0],
        [b.x1, b.z1],
      ]) {
        uniq.set(ptKey(x, z), [x, z]);
      }
      if (uniq.size !== 3) continue;

      const pts = [...uniq.values()];
      if (axis === "h") {
        pts.sort((p, q) => p[0] - q[0]);
        if (Math.abs(pts[0][1] - pts[2][1]) > EPS) continue;
        list = list.filter((_, k) => k !== i && k !== j);
        list.push({ x0: pts[0][0], z0: pts[0][1], x1: pts[2][0], z1: pts[2][1] });
      } else {
        pts.sort((p, q) => p[1] - q[1]);
        if (Math.abs(pts[0][0] - pts[2][0]) > EPS) continue;
        list = list.filter((_, k) => k !== i && k !== j);
        list.push({ x0: pts[0][0], z0: pts[0][1], x1: pts[2][0], z1: pts[2][1] });
      }
      changed = true;
      break outer;
    }
  }

  return list;
}

function edgeOutDir(e, fromStart) {
  if (fromStart) {
    if (Math.abs(e.z1 - e.z0) < EPS) return e.x1 > e.x0 ? "E" : "W";
    return e.z1 > e.z0 ? "N" : "S";
  }
  if (Math.abs(e.z1 - e.z0) < EPS) return e.x0 > e.x1 ? "E" : "W";
  return e.z0 > e.z1 ? "N" : "S";
}

const TURN_LEFT = { E: "N", N: "W", W: "S", S: "E" };
const TURN_STRAIGHT = { E: "E", N: "N", W: "W", S: "S" };
const TURN_RIGHT = { E: "S", N: "E", W: "N", S: "W" };

function pickNextEdge(inDir, options) {
  const order = [TURN_LEFT[inDir], TURN_STRAIGHT[inDir], TURN_RIGHT[inDir]];
  for (const want of order) {
    const hit = options.find((o) => o.outDir === want);
    if (hit) return hit;
  }
  return options[0];
}

/** Chain directed boundary edges into closed loops (XZ plane). */
export function footprintOutlineLoops(cells) {
  const edges = mergeCollinearEdges(footprintOutlineEdges(cells));
  if (!edges.length) return [];

  const adj = new Map();
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    const sk = ptKey(e.x0, e.z0);
    const ek = ptKey(e.x1, e.z1);
    if (!adj.has(sk)) adj.set(sk, []);
    if (!adj.has(ek)) adj.set(ek, []);
    adj.get(sk).push({ i, atStart: true });
    adj.get(ek).push({ i, atStart: false });
  }

  const used = new Set();
  const loops = [];

  for (let s = 0; s < edges.length; s++) {
    if (used.has(s)) continue;

    const loop = [];
    let idx = s;
    let forward = true;
    let inDir = null;
    const origin = ptKey(edges[s].x0, edges[s].z0);
    let guard = 0;

    while (guard++ <= edges.length + 4) {
      const e = edges[idx];
      if (!used.has(idx)) {
        used.add(idx);
        loop.push([forward ? e.x0 : e.x1, forward ? e.z0 : e.z1]);
      }

      const outDir = edgeOutDir(e, forward);
      const next = forward ? ptKey(e.x1, e.z1) : ptKey(e.x0, e.z0);
      if (next === origin && loop.length >= 3) break;

      const options = (adj.get(next) || [])
        .filter((c) => !used.has(c.i))
        .map((c) => ({
          ...c,
          outDir: edgeOutDir(edges[c.i], c.atStart),
        }));

      if (!options.length) break;

      const pick = inDir == null ? options[0] : pickNextEdge(outDir, options);
      idx = pick.i;
      forward = pick.atStart;
      inDir = outDir;
    }

    if (loop.length >= 3) loops.push(loop);
  }

  return loops;
}

function signedArea(loop) {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x0, z0] = loop[i];
    const [x1, z1] = loop[(i + 1) % loop.length];
    a += x0 * z1 - x1 * z0;
  }
  return a * 0.5;
}

/** Largest loop = outer shell; smaller CCW loops = holes (door openings). */
export function classifyFootprintLoops(loops) {
  if (!loops.length) return { outer: null, holes: [] };

  const withArea = loops.map((loop) => ({
    loop,
    area: Math.abs(signedArea(loop)),
    sign: signedArea(loop),
  }));

  withArea.sort((a, b) => b.area - a.area);
  const outer = withArea[0].loop;
  const holes = withArea.slice(1).map((l) => l.loop);
  return { outer, holes };
}

export function segmentsToFootprint(segments) {
  return unionFootprint(segments.map(segmentToRect));
}

/** @deprecated boundary-only extrusion — use solid extrude in WallSolidMesh */
export function footprintBoundaryEdges(cells) {
  const edges = footprintOutlineEdges(cells);
  return edges.map((e) => {
    if (Math.abs(e.x0 - e.x1) < EPS) {
      return { x0: e.x0, z0: e.z0, x1: e.x1, z1: e.z1, axis: "x", sign: e.x0 >= 0 ? 1 : -1 };
    }
    return { x0: e.x0, z0: e.z0, x1: e.x1, z1: e.z1, axis: "z", sign: e.z0 >= 0 ? 1 : -1 };
  });
}

export function mergeBoundaryEdges(edges) {
  return edges;
}
