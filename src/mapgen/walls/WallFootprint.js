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

function cellKey(c) {
  return `${c.x0.toFixed(5)},${c.z0.toFixed(5)},${c.x1.toFixed(5)},${c.z1.toFixed(5)}`;
}

function hasNeighbor(cells, c, side) {
  for (const o of cells) {
    if (o === c) continue;
    if (side === "west" && Math.abs(o.x1 - c.x0) < EPS) {
      if (o.z0 < c.z1 - EPS && o.z1 > c.z0 + EPS) return true;
    }
    if (side === "east" && Math.abs(o.x0 - c.x1) < EPS) {
      if (o.z0 < c.z1 - EPS && o.z1 > c.z0 + EPS) return true;
    }
    if (side === "north" && Math.abs(o.z1 - c.z0) < EPS) {
      if (o.x0 < c.x1 - EPS && o.x1 > c.x0 + EPS) return true;
    }
    if (side === "south" && Math.abs(o.z0 - c.z1) < EPS) {
      if (o.x0 < c.x1 - EPS && o.x1 > c.x0 + EPS) return true;
    }
  }
  return false;
}

/**
 * Boundary edges of the union footprint — each becomes one vertical wallpaper face.
 * Returns { x0, z0, x1, z1, axis: "x"|"z", sign: ±1 } where axis is face normal axis.
 */
export function footprintBoundaryEdges(cells) {
  const edges = [];
  const edgeSeen = new Set();

  const addEdge = (x0, z0, x1, z1, axis, sign) => {
    if (Math.hypot(x1 - x0, z1 - z0) < EPS) return;
    const k = `${axis}|${sign}|${x0.toFixed(5)},${z0.toFixed(5)},${x1.toFixed(5)},${z1.toFixed(5)}`;
    if (edgeSeen.has(k)) return;
    edgeSeen.add(k);
    edges.push({ x0, z0, x1, z1, axis, sign });
  };

  for (const c of cells) {
    if (!hasNeighbor(cells, c, "west")) {
      addEdge(c.x0, c.z0, c.x0, c.z1, "x", -1);
    }
    if (!hasNeighbor(cells, c, "east")) {
      addEdge(c.x1, c.z0, c.x1, c.z1, "x", 1);
    }
    if (!hasNeighbor(cells, c, "north")) {
      addEdge(c.x0, c.z0, c.x1, c.z0, "z", -1);
    }
    if (!hasNeighbor(cells, c, "south")) {
      addEdge(c.x0, c.z1, c.x1, c.z1, "z", 1);
    }
  }

  return edges;
}

/** Merge colinear boundary segments on the same line — fewer faces, no corner change. */
export function mergeBoundaryEdges(edges) {
  const buckets = new Map();

  for (const e of edges) {
    const key = `${e.axis}|${e.sign}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(e);
  }

  const merged = [];

  for (const [, group] of buckets) {
    if (group[0].axis === "x") {
      const byX = new Map();
      for (const e of group) {
        const xk = e.x0.toFixed(5);
        if (!byX.has(xk)) byX.set(xk, []);
        byX.get(xk).push(e);
      }
      for (const [, xs] of byX) {
        xs.sort((a, b) => a.z0 - b.z0);
        let cur = { ...xs[0] };
        for (let i = 1; i < xs.length; i++) {
          const e = xs[i];
          if (Math.abs(e.z0 - cur.z1) < EPS) cur.z1 = e.z1;
          else {
            merged.push(cur);
            cur = { ...e };
          }
        }
        merged.push(cur);
      }
    } else {
      const byZ = new Map();
      for (const e of group) {
        const zk = e.z0.toFixed(5);
        if (!byZ.has(zk)) byZ.set(zk, []);
        byZ.get(zk).push(e);
      }
      for (const [, zs] of byZ) {
        zs.sort((a, b) => a.x0 - b.x0);
        let cur = { ...zs[0] };
        for (let i = 1; i < zs.length; i++) {
          const e = zs[i];
          if (Math.abs(e.x0 - cur.x1) < EPS) cur.x1 = e.x1;
          else {
            merged.push(cur);
            cur = { ...e };
          }
        }
        merged.push(cur);
      }
    }
  }

  return merged;
}

export function segmentsToFootprint(segments) {
  return unionFootprint(segments.map(segmentToRect));
}
