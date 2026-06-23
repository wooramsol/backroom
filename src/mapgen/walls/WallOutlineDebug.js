import * as THREE from "three";
import { WALL_T } from "../../constants.js";
import {
  mergeCollinearWallSegments,
  segmentToRect,
  connectedRectGroups,
  footprintOutlineLoopsFromRects,
  footprintSolidOutlineFromRects,
  classifyFootprintLoops,
  outlineGenerationMode,
  healWallRectJunctions,
} from "./WallFootprint.js";
import { simplifyOrthogonalLoop } from "./WallGeometryFinalize.js";

const EPS = 1e-5;

/** @typedef {{ x0:number,z0:number,x1:number,z1:number,axis:'x'|'z' }} CenterLine */

export function centerLinesFromSegments(segments) {
  return mergeCollinearWallSegments(segments).map((s) => {
    if (s.axis === "z") {
      return { x0: s.span0, z0: s.pos, x1: s.span1, z1: s.pos, axis: "z" };
    }
    return { x0: s.pos, z0: s.span0, x1: s.pos, z1: s.span1, axis: "x" };
  });
}

function loopEdges(loop) {
  const edges = [];
  for (let i = 0; i < loop.length; i++) {
    const [x0, z0] = loop[i];
    const [x1, z1] = loop[(i + 1) % loop.length];
    edges.push({
      x0,
      z0,
      x1,
      z1,
      len: Math.hypot(x1 - x0, z1 - z0),
      axis: Math.abs(z1 - z0) < EPS ? "h" : Math.abs(x1 - x0) < EPS ? "v" : "d",
    });
  }
  return edges;
}

/**
 * Detect zigzag / non-CAD outline issues.
 * @returns {{ microEdges, diagonalEdges, non90Corners, staircaseSteps, maxVertices }}
 */
export function analyzeOutlineLoop(loop, opts = {}) {
  const minLong = opts.minLongEdge ?? 0.5;
  const microLimit = opts.microLimit ?? 0.25;
  if (!loop?.length) {
    return { microEdges: 0, diagonalEdges: 0, non90Corners: 0, staircaseSteps: 0, maxVertices: 0, edges: [] };
  }

  const edges = loopEdges(loop);
  let microEdges = 0;
  let diagonalEdges = 0;
  let non90Corners = 0;
  let staircaseSteps = 0;

  for (const e of edges) {
    if (e.axis === "d") diagonalEdges++;
    else if (e.len < microLimit && e.len > WALL_T + 0.04) microEdges++;
  }

  const n = loop.length;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = loop[(i - 1 + n) % n];
    const [x1, z1] = loop[i];
    const [x2, z2] = loop[(i + 1) % n];
    const ax = x1 - x0;
    const az = z1 - z0;
    const bx = x2 - x1;
    const bz = z2 - z1;
    const dot = ax * bx + az * bz;
    const cross = ax * bz - az * bx;
    const angle = (Math.atan2(Math.abs(cross), Math.abs(dot) < EPS ? EPS : dot) * 180) / Math.PI;
    if (angle > 1 && Math.abs(angle - 90) > 1) non90Corners++;

    const lenA = Math.hypot(ax, az);
    const lenB = Math.hypot(bx, bz);
    if (lenA < microLimit && lenB < microLimit && lenA > EPS && lenB > EPS) staircaseSteps++;
  }

  const longStraight = edges.filter((e) => e.len >= minLong && e.axis !== "d").length;

  return {
    microEdges,
    diagonalEdges,
    non90Corners,
    staircaseSteps,
    maxVertices: loop.length,
    longStraight,
    edges: edges.map((e) => ({ len: +e.len.toFixed(4), axis: e.axis })),
  };
}

function edgeKey2d(x0, z0, x1, z1) {
  const ax = x0.toFixed(4);
  const az = z0.toFixed(4);
  const bx = x1.toFixed(4);
  const bz = z1.toFixed(4);
  if (ax > bx || (ax === bx && az > bz)) return `${bx},${bz},${ax},${az}`;
  return `${ax},${az},${bx},${bz}`;
}

/** Top-of-wall footprint edges from outward vertical faces (y ≈ wall height). */
export function meshVerticalBoundaryEdges(geo, height = null, yTol = 0.02) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  let yMax = height;
  if (yMax == null) {
    yMax = -Infinity;
    for (let i = 0; i < pos.count; i++) yMax = Math.max(yMax, pos.getY(i));
  }

  const counts = new Map();
  const directed = new Map();

  const add = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < EPS) return;
    const isH = Math.abs(z1 - z0) < EPS;
    const isV = Math.abs(x1 - x0) < EPS;
    if (!isH && !isV) return;
    const k = edgeKey2d(x0, z0, x1, z1);
    counts.set(k, (counts.get(k) || 0) + 1);
    if (!directed.has(k)) directed.set(k, { x0, z0, x1, z1 });
  };

  for (let i = 0; i < pos.count; i += 3) {
    if (Math.abs(norm.getY(i)) > 0.35) continue;
    const pairs = [
      [i, i + 1],
      [i + 1, i + 2],
      [i + 2, i],
    ];
    for (const [a, b] of pairs) {
      const ya = pos.getY(a);
      const yb = pos.getY(b);
      if (Math.abs(ya - yMax) > yTol || Math.abs(yb - yMax) > yTol) continue;
      add(pos.getX(a), pos.getZ(a), pos.getX(b), pos.getZ(b));
    }
  }

  const edges = [];
  for (const [k, n] of counts) {
    if (n !== 1) continue;
    edges.push(directed.get(k));
  }
  return edges;
}

/** @deprecated use meshVerticalBoundaryEdges */
export function meshTopSilhouetteEdges(geo) {
  return meshVerticalBoundaryEdges(geo);
}

/** Largest closed loop from mesh boundary edges for zigzag analysis. */
export function meshBoundaryOutlineLoop(geo) {
  const edges = meshVerticalBoundaryEdges(geo);
  if (!edges.length) return null;

  const adj = new Map();
  const ptKey = (x, z) => `${x.toFixed(4)},${z.toFixed(4)}`;
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

  if (!loops.length) return null;
  loops.sort((a, b) => b.length - a.length);
  return loops[0];
}

/** Collect per-island debug data for all pipeline stages. */
export function collectWallOutlineDebugPipeline(segments) {
  const merged = mergeCollinearWallSegments(segments);
  const rects = merged.map(segmentToRect);
  const groups = connectedRectGroups(rects);
  const centerLines = centerLinesFromSegments(segments);

  const islands = groups.map((groupRects, islandIndex) => {
    const healed = healWallRectJunctions(groupRects);
    const rawLoops = footprintOutlineLoopsFromRects(groupRects);
    const healedLoops = footprintOutlineLoopsFromRects(healed);
    const { outer: rawOuter, holes: rawHoles } = classifyFootprintLoops(rawLoops);
    const { outer: shapeOuter, holes: shapeHoles } = footprintSolidOutlineFromRects(groupRects);

    return {
      islandIndex,
      rects: groupRects,
      rawPolygon: rawOuter,
      rawHoles,
      shapePolygon: shapeOuter,
      shapeHoles,
      healedPolygon: classifyFootprintLoops(healedLoops).outer,
      rawAnalysis: analyzeOutlineLoop(rawOuter),
      healedAnalysis: analyzeOutlineLoop(classifyFootprintLoops(healedLoops).outer),
      shapeAnalysis: analyzeOutlineLoop(shapeOuter),
    };
  });

  return {
    mode: outlineGenerationMode(),
    centerLines,
    islands,
  };
}

export function buildCenterLineGeometry(centerLines, y = 0.05) {
  const pts = [];
  for (const l of centerLines) {
    pts.push(l.x0, y, l.z0, l.x1, y, l.z1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

export function buildLoopLineGeometry(loop, y = 0.08, closed = true) {
  if (!loop?.length) return new THREE.BufferGeometry();
  const pts = [];
  for (const [x, z] of loop) pts.push(x, y, z);
  if (closed && loop.length > 1) {
    const [x, z] = loop[0];
    pts.push(x, y, z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

export function buildRectOutlineGeometry(rects, y = 0.06) {
  const pts = [];
  for (const r of rects) {
    pts.push(r.x0, y, r.z0, r.x1, y, r.z0);
    pts.push(r.x1, y, r.z0, r.x1, y, r.z1);
    pts.push(r.x1, y, r.z1, r.x0, y, r.z1);
    pts.push(r.x0, y, r.z1, r.x0, y, r.z0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

export function summarizeZigzagReport(pipeline) {
  const lines = [];
  lines.push(`outline_mode: ${pipeline.mode}`);
  lines.push(`center_lines: ${pipeline.centerLines.length}`);
  for (const isl of pipeline.islands) {
    const r = isl.rawAnalysis;
    const s = isl.shapeAnalysis;
    lines.push(
      `island ${isl.islandIndex}: rawVerts=${r.maxVertices} shapeVerts=${s.maxVertices} ` +
        `raw(micro=${r.microEdges} diag=${r.diagonalEdges} stair=${r.staircaseSteps}) ` +
        `shape(micro=${s.microEdges} diag=${s.diagonalEdges} stair=${s.staircaseSteps})`,
    );
  }
  return lines.join("\n");
}
