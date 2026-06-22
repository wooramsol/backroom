import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { WALL_T } from "../../constants.js";
import { collectRoomWallSegments } from "./wallSegments.js";
import { segmentsToFootprint, footprintBoundaryEdges } from "./WallFootprint.js";
import { validateWallMesh, repairFootprint } from "./WallQuality.js";

const SNAP = 1e-4;

function vtxKey(x, y, z) {
  const rx = Math.round(x / SNAP) * SNAP;
  const ry = Math.round(y / SNAP) * SNAP;
  const rz = Math.round(z / SNAP) * SNAP;
  return `${rx},${ry},${rz}`;
}

function worldUV(wx, wy, wz, nx, nz, tileW, tileH) {
  const ax = Math.abs(nx);
  const az = Math.abs(nz);
  let u;
  if (ax >= az) u = wz / tileW;
  else u = wx / tileW;
  const v = wy / tileH;
  return [u, v];
}

/**
 * Builds one continuous architectural wall mesh from outline segments.
 * Footprint union removes corner overlap; boundary extrusion shares vertices.
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
  if (!segments.length) return null;

  let cells = segmentsToFootprint(segments);
  if (!cells.length) return null;

  let issues = options.room ? validateWallMesh(options.room, segments, cells) : [];
  const protrusions = issues.filter((i) => i.kind === "protrusion");
  if (protrusions.length) {
    cells = repairFootprint(cells);
    issues = options.room ? validateWallMesh(options.room, segments, cells) : [];
  }

  const edges = footprintBoundaryEdges(cells);
  if (!edges.length) return null;

  const positions = [];
  const uvs = [];
  const indices = [];
  const map = new Map();

  const addV = (x, y, z, nx, nz) => {
    const wx = roomWx + x;
    const wy = y;
    const wz = roomWz + z;
    const [u, v] = worldUV(wx, wy, wz, nx, nz, tileW, tileH);
    const k = vtxKey(x, y, z);
    if (map.has(k)) return map.get(k);
    const i = positions.length / 3;
    positions.push(x, y, z);
    uvs.push(u, v);
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

  let geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo = mergeVertices(geo, SNAP);
  geo.computeVertexNormals();
  geo = removeDegenerateFaces(geo);

  if (options.validate !== false && options.room) {
    if (issues.length && options.onIssues) options.onIssues(issues);
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

  if (keep.length === idx.count) return geo;
  geo.setIndex(keep);
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
