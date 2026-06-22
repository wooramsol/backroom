import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { WALL_T } from "../constants.js";
import { WALL_TILE_W } from "../textures.js";

const SNAP = 1e-4;

function vtxKey(x, y, z) {
  const rx = Math.round(x / SNAP) * SNAP;
  const ry = Math.round(y / SNAP) * SNAP;
  const rz = Math.round(z / SNAP) * SNAP;
  return `${rx},${ry},${rz}`;
}

/**
 * Builds one continuous extruded wall mesh from orthogonal outline segments.
 * Corners share vertices; no overlapping box pieces.
 */
export function buildExtrudedWallGeometry(segments, height, roomWx, roomWz, tileW, tileH) {
  if (!segments.length) return null;

  const half = WALL_T / 2;
  const positions = [];
  const uvs = [];
  const indices = [];
  const map = new Map();

  const addV = (x, y, z, u, v) => {
    const k = vtxKey(x, y, z);
    if (map.has(k)) return map.get(k);
    const i = positions.length / 3;
    positions.push(x, y, z);
    uvs.push(u, v);
    map.set(k, i);
    return i;
  };

  const quad = (a, b, c, d, uvA, uvB, uvC, uvD) => {
    const ia = addV(...a, ...uvA);
    const ib = addV(...b, ...uvB);
    const ic = addV(...c, ...uvC);
    const id = addV(...d, ...uvD);
    indices.push(ia, ib, ic, ia, ic, id);
  };

  for (const seg of segments) {
    const span = seg.span1 - seg.span0;
    if (span < SNAP) continue;

    if (seg.axis === "z") {
      const z = seg.pos;
      const x0 = seg.span0;
      const x1 = seg.span1;
      const u0 = (roomWx + x0) / tileW;
      const u1 = (roomWx + x1) / tileW;

      quad(
        [x0, 0, z - half],
        [x1, 0, z - half],
        [x1, height, z - half],
        [x0, height, z - half],
        [u0, 0],
        [u1, 0],
        [u1, height / tileH],
        [u0, height / tileH],
      );
      quad(
        [x1, 0, z + half],
        [x0, 0, z + half],
        [x0, height, z + half],
        [x1, height, z + half],
        [u1, 0],
        [u0, 0],
        [u0, height / tileH],
        [u1, height / tileH],
      );
    } else {
      const x = seg.pos;
      const z0 = seg.span0;
      const z1 = seg.span1;
      const u0 = (roomWz + z0) / tileW;
      const u1 = (roomWz + z1) / tileW;

      quad(
        [x - half, 0, z0],
        [x - half, 0, z1],
        [x - half, height, z1],
        [x - half, height, z0],
        [u0, 0],
        [u1, 0],
        [u1, height / tileH],
        [u0, height / tileH],
      );
      quad(
        [x + half, 0, z1],
        [x + half, 0, z0],
        [x + half, height, z0],
        [x + half, height, z1],
        [u1, 0],
        [u0, 0],
        [u0, height / tileH],
        [u1, height / tileH],
      );
    }
  }

  if (!indices.length) return null;

  let geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo = mergeVertices(geo, SNAP);
  geo.computeVertexNormals();
  return geo;
}

export function tileHFromWallTex(wallTex) {
  return wallTex.userData?.tileH ?? WALL_TILE_W;
}
