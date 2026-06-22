import * as THREE from "three";
import { WALL_T } from "../../constants.js";
import { collectRoomWallSegments } from "./wallSegments.js";
import {
  segmentsToFootprint,
  footprintBoundaryEdges,
  mergeBoundaryEdges,
} from "./WallFootprint.js";
import { validateWallMesh, repairFootprint } from "./WallQuality.js";
import { bakeWorldWallUVBuffer } from "./WorldWallUV.js";

const SNAP = 1e-4;

function vtxKey(x, y, z, nx, nz) {
  const rx = Math.round(x / SNAP) * SNAP;
  const ry = Math.round(y / SNAP) * SNAP;
  const rz = Math.round(z / SNAP) * SNAP;
  const sx = nx < -0.5 ? -1 : nx > 0.5 ? 1 : 0;
  const sz = nz < -0.5 ? -1 : nz > 0.5 ? 1 : 0;
  return `${rx},${ry},${rz},${sx},${sz}`;
}

/**
 * Step 1 wall pipeline — footprint union shell, no BoxGeometry.
 * Corners keep separate vertices per face normal so UV wraps cleanly.
 */
export function buildContinuousWallGeometry(
  segments,
  height,
  roomWx,
  roomWz,
  tileW,
  tileH,
  options = {},
) {
  if (!segments.length || height < SNAP) return null;

  let cells = segmentsToFootprint(segments);
  if (!cells.length) return null;

  let issues = options.room ? validateWallMesh(options.room, segments, cells) : [];
  if (issues.some((i) => i.kind === "protrusion")) {
    cells = repairFootprint(cells);
    issues = options.room ? validateWallMesh(options.room, segments, cells) : [];
  }

  const edges = mergeBoundaryEdges(footprintBoundaryEdges(cells));
  if (!edges.length) return null;

  const positions = [];
  const indices = [];
  const map = new Map();

  const addV = (x, y, z, nx, nz) => {
    const k = vtxKey(x, y, z, nx, nz);
    if (map.has(k)) return map.get(k);
    const i = positions.length / 3;
    positions.push(x, y, z);
    map.set(k, i);
    return i;
  };

  const quad = (a, b, c, d, nx, nz) => {
    const ia = addV(...a, nx, nz);
    const ib = addV(...b, nx, nz);
    const ic = addV(...c, nx, nz);
    const id = addV(...d, nx, nz);
    indices.push(ia, ib, ic, ia, ic, id);
  };

  for (const e of edges) {
    const nx = e.axis === "x" ? e.sign : 0;
    const nz = e.axis === "z" ? e.sign : 0;

    if (e.axis === "x") {
      const x = e.x0;
      if (e.sign < 0) {
        quad([x, 0, e.z0], [x, 0, e.z1], [x, height, e.z1], [x, height, e.z0], nx, nz);
      } else {
        quad([x, 0, e.z1], [x, 0, e.z0], [x, height, e.z0], [x, height, e.z1], nx, nz);
      }
    } else {
      const z = e.z0;
      if (e.sign < 0) {
        quad([e.x0, 0, z], [e.x1, 0, z], [e.x1, height, z], [e.x0, height, z], nx, nz);
      } else {
        quad([e.x1, 0, z], [e.x0, 0, z], [e.x0, height, z], [e.x1, height, z], nx, nz);
      }
    }
  }

  if (!indices.length) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  bakeWorldWallUVBuffer(geo, roomWx, roomWz, tileW, tileH);
  removeDegenerateFaces(geo);

  if (options.validate !== false && options.room && issues.length && options.onIssues) {
    options.onIssues(issues);
  }

  return geo;
}

function removeDegenerateFaces(geo) {
  const pos = geo.attributes.position;
  const idx = geo.index;
  if (!idx) return geo;

  const keep = [];
  const seen = new Set();

  for (let t = 0; t < idx.count; t += 3) {
    const ia = idx.getX(t);
    const ib = idx.getX(t + 1);
    const ic = idx.getX(t + 2);
    if (ia === ib || ib === ic || ic === ia) continue;

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
    if (nx * nx + ny * ny + nz * nz < 1e-12) continue;

    const sk = [ia, ib, ic].sort((a, b) => a - b).join(",");
    if (seen.has(sk)) continue;
    seen.add(sk);
    keep.push(ia, ib, ic);
  }

  if (keep.length !== idx.count) geo.setIndex(keep);
  return geo;
}

export function buildRoomWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const tileW = wallTex?.userData?.tileW ?? 0.76;
  const tileH = wallTex?.userData?.tileH ?? tileW;
  const segments = collectRoomWallSegments(room);
  return buildContinuousWallGeometry(segments, h, roomWx, roomWz, tileW, tileH, { room });
}

export function tileHFromWallTex(wallTex) {
  return wallTex?.userData?.tileH ?? 0.76;
}

/** QA helper — thin footprint axis must stay at WALL_T (no protrusion). */
export function wallThicknessOK(cells) {
  for (const c of cells) {
    const w = c.x1 - c.x0;
    const d = c.z1 - c.z0;
    const thin = Math.min(w, d);
    if (thin > WALL_T + 0.03) return false;
  }
  return true;
}
