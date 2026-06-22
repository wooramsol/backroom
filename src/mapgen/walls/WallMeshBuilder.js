import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { WALL_T } from "../../constants.js";
import { collectRoomWallSegments } from "./wallSegments.js";
import { segmentsToFootprint, segmentToRect } from "./WallFootprint.js";
import { validateWallMesh, repairFootprint } from "./WallQuality.js";
import { bakeWorldWallUVBuffer } from "./WorldWallUV.js";

const SNAP = 1e-4;

function rectToLoop(r) {
  return [
    [r.x0, r.z0],
    [r.x1, r.z0],
    [r.x1, r.z1],
    [r.x0, r.z1],
  ];
}

function loopToShape(loop) {
  const shape = new THREE.Shape();
  shape.moveTo(loop[0][0], loop[0][1]);
  for (let i = 1; i < loop.length; i++) shape.lineTo(loop[i][0], loop[i][1]);
  shape.closePath();
  return shape;
}

function loopToPath(loop) {
  const path = new THREE.Path();
  path.moveTo(loop[0][0], loop[0][1]);
  for (let i = 1; i < loop.length; i++) path.lineTo(loop[i][0], loop[i][1]);
  path.closePath();
  return path;
}

function extrudeFootprint(outer, holes, height) {
  if (!outer || outer.length < 3) return null;

  const shape = loopToShape(outer);
  shape.holes = holes.filter((h) => h.length >= 3).map(loopToPath);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.scale(1, 1, -1);
  return stripHorizontalCaps(geo);
}

/**
 * Solid WALL_T prism per wall run, merged into one continuous mesh.
 * Overlapping corners/end joints weld into closed architectural volumes.
 */
export function buildSolidWallGeometry(
  segments,
  height,
  roomWx,
  roomWz,
  tileW,
  tileH,
  options = {},
) {
  if (!segments.length || height < SNAP) return null;

  const cells = segmentsToFootprint(segments);
  if (!cells.length) return null;

  let issues = options.room ? validateWallMesh(options.room, segments, cells) : [];
  if (issues.some((i) => i.kind === "protrusion")) {
    const repaired = repairFootprint(cells);
    issues = options.room ? validateWallMesh(options.room, segments, repaired) : [];
  }

  const parts = [];
  for (const seg of segments) {
    if (seg.span1 - seg.span0 < 0.05) continue;
    const g = extrudeFootprint(rectToLoop(segmentToRect(seg)), [], height);
    if (g) parts.push(g);
  }

  if (!parts.length) return null;

  let geo = parts.length === 1 ? parts[0] : mergeGeometries(parts, false);
  for (const p of parts) {
    if (p !== geo) p.dispose();
  }

  geo.computeVertexNormals();
  geo = removeDegenerateFaces(geo);
  bakeWorldWallUVBuffer(geo, roomWx, roomWz, tileW, tileH);

  if (options.validate !== false && options.room && issues.length && options.onIssues) {
    options.onIssues(issues);
  }

  return geo;
}

function stripHorizontalCaps(geo) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const idx = geo.index;

  const keepTri = (i0, i1, i2) => Math.abs(norm.getY(i0)) <= 0.85;

  if (idx) {
    const keep = [];
    for (let t = 0; t < idx.count; t += 3) {
      const i0 = idx.getX(t);
      if (!keepTri(i0)) continue;
      keep.push(i0, idx.getX(t + 1), idx.getX(t + 2));
    }
    if (keep.length === idx.count) return geo;
    const out = geo.clone();
    out.setIndex(keep);
    geo.dispose();
    return out;
  }

  const newPos = [];
  const newNorm = [];
  for (let i = 0; i < pos.count; i += 3) {
    if (!keepTri(i)) continue;
    for (let k = 0; k < 3; k++) {
      newPos.push(pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k));
      newNorm.push(norm.getX(i + k), norm.getY(i + k), norm.getZ(i + k));
    }
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.Float32BufferAttribute(newPos, 3));
  out.setAttribute("normal", new THREE.Float32BufferAttribute(newNorm, 3));
  geo.dispose();
  return out;
}

function forEachTriangle(geo, fn) {
  const idx = geo.index;
  if (idx) {
    for (let t = 0; t < idx.count; t += 3) fn(idx.getX(t), idx.getX(t + 1), idx.getX(t + 2));
  } else {
    for (let i = 0; i < geo.attributes.position.count; i += 3) fn(i, i + 1, i + 2);
  }
}

function removeDegenerateFaces(geo) {
  const pos = geo.attributes.position;
  const idx = geo.index;
  const keep = [];
  const seen = new Set();

  forEachTriangle(geo, (ia, ib, ic) => {
    if (ia === ib || ib === ic || ic === ia) return;

    const ax = pos.getX(ia);
    const ay = pos.getY(ia);
    const az = pos.getZ(ia);
    const bx = pos.getX(ib);
    const by = pos.getY(ib);
    const bz = pos.getZ(ib);
    const cx = pos.getX(ic);
    const cy = pos.getY(ic);
    const cz = pos.getZ(ic);

    const abx = bx - ax;
    const aby = by - ay;
    const abz = bz - az;
    const acx = cx - ax;
    const acy = cy - ay;
    const acz = cz - az;
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    if (nx * nx + ny * ny + nz * nz < 1e-12) return;

    const sk = [ia, ib, ic].sort((a, b) => a - b).join(",");
    if (seen.has(sk)) return;
    seen.add(sk);
    keep.push(ia, ib, ic);
  });

  if (!idx) {
    const newNorm = geo.attributes.normal;
    const newUv = geo.attributes.uv;
    const newPos = [];
    const norms = [];
    const uvs = [];
    for (let t = 0; t < keep.length; t += 3) {
      for (const vi of [keep[t], keep[t + 1], keep[t + 2]]) {
        newPos.push(pos.getX(vi), pos.getY(vi), pos.getZ(vi));
        if (newNorm) norms.push(newNorm.getX(vi), newNorm.getY(vi), newNorm.getZ(vi));
        if (newUv) uvs.push(newUv.getX(vi), newUv.getY(vi));
      }
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(newPos, 3));
    if (norms.length) out.setAttribute("normal", new THREE.Float32BufferAttribute(norms, 3));
    if (uvs.length) out.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.dispose();
    return out;
  }

  if (keep.length !== idx.count) geo.setIndex(keep);
  return geo;
}

export function buildContinuousWallGeometry(segments, height, roomWx, roomWz, tileW, tileH, options) {
  return buildSolidWallGeometry(segments, height, roomWx, roomWz, tileW, tileH, options);
}

export function buildRoomWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const tileW = wallTex?.userData?.tileW ?? 0.76;
  const tileH = wallTex?.userData?.tileH ?? tileW;
  return buildSolidWallGeometry(collectRoomWallSegments(room), h, roomWx, roomWz, tileW, tileH, { room });
}

export function tileHFromWallTex(wallTex) {
  return wallTex?.userData?.tileH ?? 0.76;
}

export function wallThicknessOK(cells) {
  for (const c of cells) {
    if (Math.min(c.x1 - c.x0, c.z1 - c.z0) > WALL_T + 0.03) return false;
  }
  return true;
}

export function countThicknessFaces(geo) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  let n = 0;

  forEachTriangle(geo, (ia, ib, ic) => {
    const ny = Math.abs(norm.getY(ia));
    if (ny > 0.5) return;

    const ax = Math.abs(norm.getX(ia));
    const az = Math.abs(norm.getZ(ia));
    const xs = [pos.getX(ia), pos.getX(ib), pos.getX(ic)];
    const ys = [pos.getY(ia), pos.getY(ib), pos.getY(ic)];
    const zs = [pos.getZ(ia), pos.getZ(ib), pos.getZ(ic)];
    const dx = Math.max(...xs) - Math.min(...xs);
    const dz = Math.max(...zs) - Math.min(...zs);
    const dy = Math.max(...ys) - Math.min(...ys);
    if (dy < 0.5) return;

    if (ax > az) {
      if (dz > 0.04 && dz < WALL_T + 0.08) n++;
    } else if (dz > 0.04 && dz < WALL_T + 0.08) {
      n++;
    } else if (dx > 0.04 && dx < WALL_T + 0.08) {
      n++;
    }
  });

  return n;
}
