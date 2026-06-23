import { WALL_T, WALL_JOINT_OVERLAP } from "../../constants.js";
import { orientExtrudeLoops } from "./WallGeometryFinalize.js";

const EPS = 1e-5;

/** Outline source for QA reporting — center-line rects, not grid-cell boundary. */
export const OUTLINE_SOURCE = "wall-center-line";

export function outlineGenerationMode() {
  return OUTLINE_SOURCE;
}

/** Merge collinear wall runs that share the same center line (axis + pos). */
export function mergeCollinearWallSegments(segments) {
  const zByPos = new Map();
  const xByPos = new Map();

  for (const seg of segments) {
    const s0 = seg.span0;
    const s1 = seg.span1;
    if (s1 - s0 < 0.05) continue;
    const entry = {
      axis: seg.axis,
      pos: snapSegCoord(seg.pos),
      span0: snapSegCoord(seg.span0),
      span1: snapSegCoord(seg.span1),
      door: seg.door ?? null,
    };
    if (seg.axis === "z") {
      if (!zByPos.has(seg.pos)) zByPos.set(seg.pos, []);
      zByPos.get(seg.pos).push(entry);
    } else {
      if (!xByPos.has(seg.pos)) xByPos.set(seg.pos, []);
      xByPos.get(seg.pos).push(entry);
    }
  }

  const mergeIntervals = (list) => {
    const sorted = list
      .filter((s) => !s.door)
      .map((s) => ({ ...s }))
      .sort((a, b) => a.span0 - b.span0);
    const out = [];
    for (const s of sorted) {
      const last = out[out.length - 1];
      if (!last || s.span0 > last.span1 + EPS) {
        out.push(s);
        continue;
      }
      last.span1 = Math.max(last.span1, s.span1);
    }
    for (const s of list.filter((x) => x.door)) out.push(s);
    return out;
  };

  const merged = [];
  for (const [, list] of zByPos) merged.push(...mergeIntervals(list));
  for (const [, list] of xByPos) merged.push(...mergeIntervals(list));
  return merged;
}

function rectsOverlap(a, b) {
  return a.x0 < b.x1 - EPS && a.x1 > b.x0 + EPS && a.z0 < b.z1 - EPS && a.z1 > b.z0 + EPS;
}

/** Group footprint rectangles that touch or overlap (center-line union islands). */
export function connectedRectGroups(rects) {
  const groups = [];
  const used = new Set();

  for (let i = 0; i < rects.length; i++) {
    if (used.has(i)) continue;
    const group = [];
    const stack = [i];
    used.add(i);
    while (stack.length) {
      const idx = stack.pop();
      group.push(rects[idx]);
      for (let j = 0; j < rects.length; j++) {
        if (used.has(j)) continue;
        if (rectsOverlap(rects[idx], rects[j])) {
          used.add(j);
          stack.push(j);
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

function rectBoundaryEdges(rects) {
  const counts = new Map();
  const directed = new Map();

  const add = (x0, z0, x1, z1) => {
    if (Math.hypot(x1 - x0, z1 - z0) < EPS) return;
    const k = edgeKey(x0, z0, x1, z1);
    const prev = counts.get(k) || 0;
    counts.set(k, prev + 1);
    if (prev === 0) directed.set(k, { x0, z0, x1, z1 });
  };

  for (const r of rects) {
    add(r.x0, r.z0, r.x1, r.z0);
    add(r.x1, r.z0, r.x1, r.z1);
    add(r.x1, r.z1, r.x0, r.z1);
    add(r.x0, r.z1, r.x0, r.z0);
  }

  const edges = [];
  for (const [k, n] of counts) {
    if (n !== 1) continue;
    edges.push(directed.get(k));
  }
  return edges;
}

/**
 * Closed outline loops from center-line footprint rectangles.
 * Uses rect-corner occupancy grid (union) then merges collinear boundary edges.
 */
export function footprintOutlineLoopsFromRects(rects) {
  const cells = subdivideFootprintCells(rects);
  return chainBoundaryLoops(mergeCollinearEdges(gridBoundaryEdges(cells)));
}

function snapSegCoord(v) {
  return Math.round(v / OUTLINE_SNAP) * OUTLINE_SNAP;
}

function snapRect(r) {
  return {
    x0: snapSegCoord(r.x0),
    x1: snapSegCoord(r.x1),
    z0: snapSegCoord(r.z0),
    z1: snapSegCoord(r.z1),
  };
}

/** Axis-aligned wall run → solid footprint rectangle in chunk XZ (metres). */
export function segmentToRect(seg) {
  const half = WALL_T / 2;
  const pad = WALL_JOINT_OVERLAP * 0.5;
  const pos = snapSegCoord(seg.pos);
  const span0 = snapSegCoord(seg.span0) - pad;
  const span1 = snapSegCoord(seg.span1) + pad;
  if (seg.axis === "z") {
    return snapRect({
      x0: span0,
      x1: span1,
      z0: pos - half,
      z1: pos + half,
    });
  }
  return snapRect({
    x0: pos - half,
    x1: pos + half,
    z0: span0,
    z1: span1,
  });
}

function pointInRect(px, pz, r) {
  return px > r.x0 + EPS && px < r.x1 - EPS && pz > r.z0 + EPS && pz < r.z1 - EPS;
}

/**
 * Fine grid cells inside the union (before maximal merge).
 * Used for robust boundary tracing — avoids partial-edge false boundaries.
 */
export function subdivideFootprintCells(rects) {
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

  return cells;
}

/**
 * Exact union of orthogonal wall rectangles via coordinate subdivision.
 * Overlapping corners merge into one solid footprint — no pillar protrusions.
 */
export function unionFootprint(rects) {
  return mergeCells(subdivideFootprintCells(rects));
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

const cellKey = (c) => `${c.x0},${c.z0},${c.x1},${c.z1}`;

/** Flood-fill adjacent fine-grid cells into connected wall islands. */
export function connectedFootprintGroups(cells) {
  const groups = [];
  const used = new Set();

  const neighbors = (c) => {
    const out = [];
    const corners = (r) => [
      [r.x0, r.z0],
      [r.x0, r.z1],
      [r.x1, r.z0],
      [r.x1, r.z1],
    ];
    const sharesCorner = (a, b) => {
      for (const [x, z] of corners(a)) {
        for (const [x2, z2] of corners(b)) {
          if (Math.abs(x - x2) < EPS && Math.abs(z - z2) < EPS) return true;
        }
      }
      return false;
    };

    for (const o of cells) {
      if (o === c) continue;
      if (Math.abs(o.x0 - c.x1) < EPS && o.z0 < c.z1 - EPS && o.z1 > c.z0 + EPS) out.push(o);
      if (Math.abs(o.x1 - c.x0) < EPS && o.z0 < c.z1 - EPS && o.z1 > c.z0 + EPS) out.push(o);
      if (Math.abs(o.z0 - c.z1) < EPS && o.x0 < c.x1 - EPS && o.x1 > c.x0 + EPS) out.push(o);
      if (Math.abs(o.z1 - c.z0) < EPS && o.x0 < c.x1 - EPS && o.x1 > c.x0 + EPS) out.push(o);
      if (sharesCorner(c, o)) out.push(o);
    }
    return out;
  };

  for (const c of cells) {
    const k = cellKey(c);
    if (used.has(k)) continue;
    const group = [];
    const stack = [c];
    used.add(k);
    while (stack.length) {
      const cur = stack.pop();
      group.push(cur);
      for (const nb of neighbors(cur)) {
        const nk = cellKey(nb);
        if (used.has(nk)) continue;
        used.add(nk);
        stack.push(nb);
      }
    }
    groups.push(group);
  }

  return groups;
}

function gridBoundaryEdges(cells) {
  if (!cells.length) return [];

  const occ = new Set(cells.map(cellKey));
  const has = (x0, z0, x1, z1) => occ.has(`${x0},${z0},${x1},${z1}`);

  const xs = new Set();
  const zs = new Set();
  for (const c of cells) {
    xs.add(c.x0);
    xs.add(c.x1);
    zs.add(c.z0);
    zs.add(c.z1);
  }
  const xArr = [...xs].sort((a, b) => a - b);
  const zArr = [...zs].sort((a, b) => a - b);

  const edges = [];
  for (let i = 0; i < xArr.length - 1; i++) {
    for (let j = 0; j < zArr.length - 1; j++) {
      const x0 = xArr[i];
      const x1 = xArr[i + 1];
      const z0 = zArr[j];
      const z1 = zArr[j + 1];
      if (!has(x0, z0, x1, z1)) continue;

      if (j === 0 || !has(x0, zArr[j - 1], x1, z0)) {
        edges.push({ x0, z0, x1, z1: z0 });
      }
      if (i === xArr.length - 2 || !has(x1, z0, xArr[i + 2], z1)) {
        edges.push({ x0: x1, z0, x1, z1 });
      }
      if (j === zArr.length - 2 || !has(x0, z1, x1, zArr[j + 2])) {
        edges.push({ x0, z0: z1, x1, z1 });
      }
      if (i === 0 || !has(xArr[i - 1], z0, x0, z1)) {
        edges.push({ x0, z0, x1: x0, z1 });
      }
    }
  }

  return edges;
}

function edgeAxis(e) {
  if (Math.abs(e.z1 - e.z0) < EPS) return "h";
  if (Math.abs(e.x1 - e.x0) < EPS) return "v";
  return null;
}

/** Merge all collinear boundary segments on the same axis line. */
function mergeCollinearEdges(edges) {
  const horiz = new Map();
  const vert = new Map();

  for (const e of edges) {
    const axis = edgeAxis(e);
    if (axis === "h") {
      const z = snapOutlineCoord(e.z0);
      if (!horiz.has(z)) horiz.set(z, []);
      horiz.get(z).push([Math.min(e.x0, e.x1), Math.max(e.x0, e.x1)]);
    } else if (axis === "v") {
      const x = snapOutlineCoord(e.x0);
      if (!vert.has(x)) vert.set(x, []);
      vert.get(x).push([Math.min(e.z0, e.z1), Math.max(e.z0, e.z1)]);
    }
  }

  const mergeIntervals = (intervals) => {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const out = [intervals[0].slice()];
    for (let i = 1; i < intervals.length; i++) {
      const [a, b] = intervals[i];
      const last = out[out.length - 1];
      if (a <= last[1] + EPS) last[1] = Math.max(last[1], b);
      else out.push([a, b]);
    }
    return out;
  };

  const merged = [];
  for (const [z, intervals] of horiz) {
    for (const [x0, x1] of mergeIntervals(intervals)) {
      if (x1 - x0 > EPS) merged.push({ x0, z0: z, x1, z1: z });
    }
  }
  for (const [x, intervals] of vert) {
    for (const [z0, z1] of mergeIntervals(intervals)) {
      if (z1 - z0 > EPS) merged.push({ x0: x, z0, x1: x, z1 });
    }
  }
  return merged;
}

const OUTLINE_SNAP = 0.02;

function snapOutlineCoord(v) {
  return Math.round(v / OUTLINE_SNAP) * OUTLINE_SNAP;
}

function snapOutlineLoop(loop) {
  return loop.map(([x, z]) => [snapOutlineCoord(x), snapOutlineCoord(z)]);
}

function chainBoundaryLoops(edges) {
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
    const origin = ptKey(edges[s].x0, edges[s].z0);
    let guard = 0;

    while (guard++ <= edges.length + 2) {
      const e = edges[idx];
      if (!used.has(idx)) {
        used.add(idx);
        loop.push([forward ? e.x0 : e.x1, forward ? e.z0 : e.z1]);
      }

      const next = forward ? ptKey(e.x1, e.z1) : ptKey(e.x0, e.z0);
      if (next === origin && loop.length >= 3) break;

      const cand = (adj.get(next) || []).find((c) => !used.has(c.i));
      if (!cand) break;
      idx = cand.i;
      forward = cand.atStart;
    }

    if (loop.length >= 3) loops.push(loop);
  }

  return loops;
}

/**
 * Closed outline loops for a connected footprint island (grid-accurate boundary).
 */
export function footprintOutlineLoops(cells) {
  return chainBoundaryLoops(mergeCollinearEdges(gridBoundaryEdges(cells)));
}

/** Outline → outer shell + optional holes for one connected island. */
export function footprintSolidOutlineFromRects(rects) {
  const loops = footprintOutlineLoopsFromRects(rects).map(snapOutlineLoop);
  const { outer, holes } = classifyFootprintLoops(loops);
  return orientExtrudeLoops(outer, holes);
}

/** @deprecated grid-cell outline — kept for diagnostics only */
export function footprintSolidOutline(cells) {
  const loops = footprintOutlineLoops(cells);
  const { outer, holes } = classifyFootprintLoops(loops);
  return orientExtrudeLoops(outer, holes);
}

/**
 * Per connected island: one outer loop (+ holes) ready for extrusion.
 * Outline follows wall center-line footprint rectangles, not grid-cell stairs.
 */
export function footprintExtrudeOutlines(segments) {
  const merged = mergeCollinearWallSegments(segments);
  const rects = merged.map(segmentToRect);
  return connectedRectGroups(rects).map((group) => footprintSolidOutlineFromRects(group));
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

export function segmentsToFootprintGrid(segments) {
  return subdivideFootprintCells(segments.map(segmentToRect));
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
