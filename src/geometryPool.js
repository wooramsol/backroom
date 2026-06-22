import * as THREE from "three";
import { WALL_T } from "./constants.js";

const _boxCache = new Map();

/** Reuse box templates; returned clones are safe to transform/dispose */
export function cloneWallBox(axis, slen, segH, wallT = WALL_T) {
  const key = `${axis}|${slen.toFixed(3)}|${segH.toFixed(3)}|${wallT.toFixed(3)}`;
  let base = _boxCache.get(key);
  if (!base) {
    base =
      axis === "z"
        ? new THREE.BoxGeometry(slen, segH, wallT)
        : new THREE.BoxGeometry(wallT, segH, slen);
    base.userData.shared = true;
    _boxCache.set(key, base);
  }
  return base.clone();
}

/** Bake wallpaper UVs aligned to world metres (material repeat 1×1) */
export function bakePlaneWallUV(geo, widthM, heightM, tileW, tileH, worldU0, worldV0) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = (worldU0 + uv.getX(i) * widthM) / tileW;
    const v = (worldV0 + uv.getY(i) * heightM) / tileH;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

/** Bake wallpaper UVs aligned to world metres (material repeat 1×1) */
export function bakeWallUV(geo, spanU, spanV, tileW, tileH, worldU0 = 0, worldV0 = 0) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = (worldU0 + uv.getX(i) * spanU) / tileW;
    const v = (worldV0 + uv.getY(i) * spanV) / tileH;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

/**
 * Box wall UV — main faces world-aligned; edge/cap faces crop wallpaper to
 * the physical face size (wall thickness metres), continuing from the
 * adjoining wall surface like cut wallpaper strips.
 *
 * Requires non-indexed geometry so each face has its own corner UVs.
 */
export function bakeWallBoxUV(
  geo,
  axis,
  spanU,
  spanV,
  tileW,
  tileH,
  worldU0 = 0,
  worldV0 = 0,
  wallT = WALL_T,
) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  const halfU = spanU / 2;
  const halfV = spanV / 2;
  const halfT = wallT / 2;

  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const ly = pos.getY(i);
    const lz = pos.getZ(i);
    const nx = norm.getX(i);
    const ny = norm.getY(i);
    const nz = norm.getZ(i);
    const vMain = (worldV0 + ly + halfV) / tileH;
    let u;
    let v;

    if (axis === "z") {
      if (Math.abs(nz) > 0.5) {
        u = (worldU0 + lx + halfU) / tileW;
        v = vMain;
      } else if (Math.abs(nx) > 0.5) {
        const edgeWorldU = worldU0 + (nx > 0 ? spanU : 0);
        const t = nx > 0 ? lz + halfT : halfT - lz;
        u = (edgeWorldU + t) / tileW;
        v = vMain;
      } else {
        const edgeWorldV = worldV0 + (ny > 0 ? spanV : 0);
        const t = ny > 0 ? lz + halfT : halfT - lz;
        u = (worldU0 + lx + halfU) / tileW;
        v = (edgeWorldV + t) / tileH;
      }
    } else if (Math.abs(nx) > 0.5) {
      u = (worldU0 + lz + halfU) / tileW;
      v = vMain;
    } else if (Math.abs(nz) > 0.5) {
      const edgeWorldU = worldU0 + (nz > 0 ? spanU : 0);
      const t = nz > 0 ? lx + halfT : halfT - lx;
      u = (edgeWorldU + t) / tileW;
      v = vMain;
    } else {
      const edgeWorldV = worldV0 + (ny > 0 ? spanV : 0);
      const t = ny > 0 ? lx + halfT : halfT - lx;
      u = (worldU0 + lz + halfU) / tileW;
      v = (edgeWorldV + t) / tileH;
    }

    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}
